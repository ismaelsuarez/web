### Informe técnico – Estado CI/CD, E2E y migración a Linux 22.04

#### 1) Contexto del proyecto
- **Monorepo**: pnpm + Turborepo.
- **Backend**: NestJS (TypeScript), Prisma, PostgreSQL, JWT (Passport), Throttler, Swagger, Pino.
- **Frontend**: React + Vite (TypeScript), React Router, Zustand, React Query, Axios, Tailwind.
- **Contenedores**: Docker + Docker Compose.
- **E2E**: Playwright con trazas y videos.

#### 2) Estado actual de CI (ubuntu-22.04)
- Runners fijados a `ubuntu-22.04` para evitar incompatibilidades de dependencias del sistema de Playwright.
- Instalación de navegadores con `playwright install --with-deps`.
- `pnpm` cacheado vía `actions/cache` usando el path del store (`pnpm store path`).
- Job de E2E desacoplado del build/test y basado en Docker Compose (paridad con producción):
  1. Levanta solo `postgres` y `redis` con `--wait`.
  2. Aplica esquema (`pnpm --filter backend db:push`).
  3. Ejecuta seed E2E (`pnpm --filter backend db:seed:e2e`).
  4. Verifica cantidad de productos por Prisma y, de forma autoritativa, por psql.
  5. Si 0 → reseed; si persiste 0 → seed de emergencia mínimo; si aún 0 → diagnósticos psql y fallo con mensaje claro.
  6. Arranca `backend` y `frontend` con `--wait` y corre E2E.
  7. Publica reporte HTML de Playwright.

#### 3) Cambios clave ya aplicados
- Backend en contenedor:
  - `start.sh`: genera Prisma Client, hace `prisma db push` con reintentos y arranca `node dist/main.js`.
  - `health-check.sh`: verifica proceso Node y `GET /health`.
  - Logging Pino: `pino-pretty` sólo en no-producción.
- Frontend en Nginx: healthcheck con `wget`; inyección de `VITE_API_URL` en `env-config.js` por `docker-entrypoint.sh`.
- Selectores `data-testid` en UI para estabilidad E2E.
- `authInterceptor`: evita duplicados de `/api` y prioriza `window.ENV.VITE_API_URL`.
- Seed E2E (`apps/backend/prisma/seed-e2e.ts`):
  - Inserta categoría base, usuario `testuser@example.com/Test1234`, 3 productos y sus variantes.
  - Instrumentación: log de `DATABASE_URL` enmascarada y conteos finales de categorías/productos/variantes; sale con código 2 si `products===0`.
- CI E2E robustecido:
  - Verificación por Prisma y por psql (`select count(*) from products;`).
  - Fallback reseed y seed de emergencia (mínimo 1 producto) si detecta catálogo vacío.
  - Diagnóstico psql si persiste vacío (BD/esquema/tablas/contadores).

#### 4) Incidencias resueltas y causa raíz
- Fallo `Setup Playwright dependencies` en Ubuntu 24.04 → runner fijado a 22.04 + `--with-deps`.
- `@prisma/client` no encontrado en verificación → ejecutar scripts con `pnpm --filter backend exec node`.
- Expansión de `$disconnect` por shell → usar comillas simples en el `node -e`.
- Nombres de tablas en diagnósticos psql (CamelCase vs snake_case) → corregido a `products`, `categories`, `product_variants`.
- `pnpm-lock.yaml` ausente → generado y commiteado para instalaciones determinísticas.
- E2E inestable por selectores → migrado a `data-testid` y `expect.poll` donde corresponde.

#### 5) Motivo de los falsos negativos “sin productos”
- Desalineación potencial entre:
  - Proceso que siembra (entorno host del runner) y el que consulta (contenedor/otra red),
  - o instantes de ejecución (reutilización de conexiones/cliente). 
- Solución: decisionamiento basado en psql dentro del contenedor `postgres` (verdad única) y seed instrumentado con conteos.

#### 6) Flujo E2E en CI (actual)
```yaml
e2e-tests:
  runs-on: ubuntu-22.04
  env:
    DATABASE_URL: postgresql://postgres:postgres@localhost:5432/ecommerce_staging?schema=public
    VITE_API_URL: http://localhost:3001
    NODE_ENV: test
  steps:
    - checkout + pnpm + node + cache
    - pnpm install --frozen-lockfile
    - pnpm --filter backend db:generate
    - docker compose up -d --wait postgres redis
    - pnpm --filter backend db:push
    - pnpm --filter backend db:seed:e2e  # instrumentado (muestra counts)
    - Verificar productos vía Prisma y psql (count)
    - Reseed si 0; seed de emergencia si persiste 0; diagnósticos psql
    - docker compose up -d --wait backend frontend
    - pnpm --filter frontend exec playwright install --with-deps
    - pnpm --filter frontend test:e2e
    - upload-artifact: apps/frontend/playwright-report/
    - docker compose down
```

#### 7) Guía de migración a Linux 22.04 (local)
1) Requisitos
```bash
node -v         # 18.x
pnpm -v         # 8.x
docker --version
docker compose version
```

2) Instalar deps y generar Prisma Client
```bash
pnpm install --frozen-lockfile
pnpm --filter backend db:generate
```

3) Levantar sólo DBs y aplicar esquema + seed
```bash
docker compose -f docker-compose.staging.yml up -d --wait postgres redis
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce_staging?schema=public" pnpm --filter backend db:push
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce_staging?schema=public" pnpm --filter backend db:seed:e2e

# Verificación autoritativa (psql)
docker compose -f docker-compose.staging.yml exec -T postgres \
  psql -U postgres -d ecommerce_staging -c 'select count(*) from products;'
```

4) Levantar servicios y probar
```bash
docker compose -f docker-compose.staging.yml up --build -d --wait backend frontend
xdg-open http://localhost:3000 || true
curl -sf http://localhost:3001/health || true
```

5) Ejecutar E2E localmente (opcional)
```bash
pnpm --filter frontend exec playwright install
pnpm --filter frontend test:e2e
```

#### 8) Checklist de troubleshooting (rápido)
- `DATABASE_URL` único y consistente en seed/verificación y en backend del Compose.
- `products` > 0 por psql antes de E2E.
- Runner Linux 22.04 + `playwright install --with-deps`.
- `pnpm-lock.yaml` presente y actualizado.
- `VITE_API_URL` correcto (o proxy `/api` de Nginx).
- Healthchecks de `backend`/`frontend` verdes antes de E2E.

#### 9) Pendientes/Mejoras sugeridas
- Ejecutar seed desde el mismo contenedor `backend` (misma red/env que la app) para eliminar cualquier brecha de entorno.
- Añadir métrica única del conteo en logs del backend al arrancar (para observabilidad en producción/staging).
- Consolidar un dataset de seed por entorno (dev/e2e) con fixtures auditables.

#### 10) Comandos útiles (resumen)
```bash
# Verificar conteos (psql en contenedor)
docker compose -f docker-compose.staging.yml exec -T postgres \
  psql -U postgres -d ecommerce_staging -c 'select count(*) from products;'

# Logs rápidos
docker compose -f docker-compose.staging.yml ps
docker compose -f docker-compose.staging.yml logs backend | tail -n 200
docker compose -f docker-compose.staging.yml logs frontend | tail -n 200
```

---
Este informe documenta el estado actual, decisiones técnicas y procedimientos para continuar en Linux 22.04 con paridad de CI y una cadena de verificación de datos robusta para E2E.


