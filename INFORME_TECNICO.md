# Informe Técnico y Operativo del Proyecto E-commerce

Este documento proporciona un análisis exhaustivo de la arquitectura, configuración y procesos de CI/CD del proyecto, con el objetivo de diagnosticar inconsistencias y potenciales puntos de fallo en el pipeline.

## 1. Análisis de `package.json`

El proyecto es un monorepo gestionado con `pnpm` y `Turborepo`.

### 1.1. Raíz (`./package.json`)

-   **Rol**: Orquesta los workspaces y los comandos globales.
-   **Dependencias Clave (`devDependencies`):**
    -   `turbo`: Herramienta principal para la gestión del monorepo (builds, tests, etc.).
    -   `typescript`: Provee el tipado estático para todo el proyecto.
    -   `eslint`, `prettier`: Aseguran la calidad y consistencia del código.
-   **Scripts Principales:**
    -   `dev`, `build`, `lint`, `format`, `test`: Comandos orquestados por `Turborepo` que se ejecutan en los workspaces correspondientes (`backend` y `frontend`).
    -   `backend:*`, `frontend:*`: Atajos para ejecutar scripts específicos de cada workspace desde la raíz.

### 1.2. Backend (`apps/backend/package.json`)

-   **Rol**: API RESTful construida con NestJS para gestionar la lógica de negocio.
-   **Dependencias Clave (`dependencies`):**
    -   `@nestjs/*`: Core del framework para construir la API.
    -   `@prisma/client`: ORM para la interacción con la base de datos PostgreSQL.
    -   `mercadopago`: SDK para la integración de la pasarela de pagos.
    -   `passport`, `@nestjs/jwt`: Para la autenticación basada en JWT.
    -   `helmet`, `@nestjs/throttler`: Para la seguridad (headers y rate limiting).
    -   `nestjs-pino`: Para logging estructurado.
-   **Dependencias de Desarrollo (`devDependencies`):**
    -   `@nestjs/testing`, `jest`, `supertest`: Para tests unitarios y de integración.
    -   `prisma`: CLI para migraciones y generación del cliente.
    -   `ts-node`: Para ejecutar scripts de TypeScript (como los seeds).
-   **Scripts:**
    -   `start:dev`: Inicia el servidor en modo desarrollo con hot-reloading.
    -   `start:prod`: Inicia el servidor a partir del build de producción (`node dist/main`).
    -   `build`: Compila el código TypeScript a JavaScript en `dist/`.
    -   `test`, `test:cov`: Ejecutan tests con Jest y generan reportes de cobertura.
    -   `db:*`: Comandos para interactuar con Prisma (generar cliente, aplicar schema, ejecutar seeds).
    -   `db:seed:e2e`: Script específico para sembrar la base de datos para los tests E2E.

### 1.3. Frontend (`apps/frontend/package.json`)

-   **Rol**: Aplicación de cliente (SPA) construida con React y Vite.
-   **Dependencias Clave (`dependencies`):**
    -   `react`, `react-dom`, `react-router-dom`: Librerías base para la UI y el enrutamiento.
    -   `@tanstack/react-query`: Gestión del estado del servidor y data-fetching.
    -   `zustand`: Gestión del estado global del cliente (ej: carrito, estado de autenticación).
    -   `axios`: Cliente HTTP para las peticiones a la API.
    -   `@mercadopago/sdk-js`: SDK de MercadoPago para el lado del cliente.
    -   `lucide-react`: Iconos.
-   **Dependencias de Desarrollo (`devDependencies`):**
    -   `vite`, `@vitejs/plugin-react`: Herramientas para el desarrollo y build del frontend.
    -   `vitest`, `@testing-library/react`: Para tests unitarios y de componentes.
    -   `tailwindcss`, `postcss`, `autoprefixer`: Para el estilizado de la aplicación.
    -   `@playwright/test`: Para los tests End-to-End.
    -   `prisma`, `@prisma/client`: Utilizado en los helpers de los tests E2E para verificar el estado de la DB.
-   **Scripts:**
    -   `dev`: Inicia el servidor de desarrollo de Vite.
    -   `build`: Realiza el type-checking con `tsc` y el build con `vite`, generando los assets estáticos en `dist/`.
    -   `test:*`: Comandos para ejecutar tests unitarios con `vitest`.
    -   `test:e2e`: Ejecuta los tests End-to-End con Playwright.

## 2. Estructura del Proyecto

```
.
├── .github/workflows/ci.yml      # Pipeline de CI/CD con GitHub Actions
├── apps
│   ├── backend/
│   │   ├── prisma/
│   │   │   ├── schema.prisma     # Esquema de la base de datos
│   │   │   ├── seed.ts           # Seed para desarrollo
│   │   │   └── seed-e2e.ts       # Seed para tests E2E
│   │   ├── src/
│   │   │   ├── auth/             # Lógica de autenticación
│   │   │   ├── payments/         # Lógica de pagos (MercadoPago)
│   │   │   ├── products/         # Lógica de productos
│   │   │   ├── main.ts           # Punto de entrada de la aplicación NestJS
│   │   │   └── app.module.ts     # Módulo raíz de NestJS
│   │   ├── Dockerfile            # Instrucciones para construir la imagen del backend
│   │   ├── start.sh              # Script de inicio para el contenedor
│   │   └── health-check.sh       # Script para el healthcheck de Docker
│   └── frontend/
│       ├── src/
│       │   ├── components/       # Componentes de React reutilizables
│       │   ├── hooks/            # Hooks personalizados (useAuth, useCart)
│       │   ├── lib/              # Lógica auxiliar (cliente API, interceptors)
│       │   ├── pages/            # Componentes que representan páginas
│       │   ├── stores/           # Stores de Zustand
│       │   └── main.tsx          # Punto de entrada de la aplicación React
│       ├── tests-e2e/
│       │   └── checkout.spec.ts  # Test E2E del flujo de compra
│       ├── Dockerfile            # Instrucciones para construir la imagen del frontend
│       ├── vite.config.ts        # Configuración de Vite
│       └── playwright.config.ts  # Configuración de Playwright
├── packages/
│   ├── ui/                       # (Potencial) Paquete de componentes UI compartidos
│   └── tsconfig/                 # (Potencial) Configuraciones de TS compartidas
├── docker-compose.staging.yml    # Orquestación de servicios para staging/CI
├── package.json                  # Raíz del monorepo
├── pnpm-workspace.yaml           # Define los workspaces para pnpm
└── turbo.json                    # Configuración de Turborepo
```

-   **`apps/`**: Contiene las aplicaciones principales (backend y frontend).
-   **`packages/`**: Destinado a código compartido entre las aplicaciones.
-   **`.github/`**: Contiene los workflows de GitHub Actions.

## 3. Configuración de TypeScript (`tsconfig.json`)

-   **Raíz (`./tsconfig.json`)**: Configuración base muy estricta (`strict: true`, `noUnusedLocals`, `noUnusedParameters`, etc.), pensada para ser extendida por los workspaces. No emite output (`noEmit: true`).
-   **Backend (`apps/backend/tsconfig.json`)**:
    -   `module: "commonjs"`, `target: "ES2020"`: Configuración típica para un entorno Node.js con NestJS.
    -   `outDir: "./dist"`: El JavaScript compilado se guarda en el directorio `dist`.
    -   `emitDecoratorMetadata: true`, `experimentalDecorators: true`: Necesario para los decoradores de NestJS.
    -   Excluye los archivos de test (`**/*.spec.ts`) para evitar conflictos de tipos con Jest.
-   **Frontend (`apps/frontend/tsconfig.json`)**:
    -   `extends: "../../tsconfig.json"`: Hereda la configuración estricta de la raíz.
    -   `target: "ES2020"`, `module: "ESNext"`: Configuración moderna para ser procesada por Vite.
    -   `jsx: "react-jsx"`: Habilita la nueva transformación de JSX.
    -   `noEmit: true`: La transpilación la realiza Vite, `tsc` solo se usa para el chequeo de tipos.

## 4. Configuración de Vite (`apps/frontend/vite.config.ts`)

-   **Plugins**: Utiliza `@vitejs/plugin-react` para la integración con React.
-   **Servidor de Desarrollo (`server`):**
    -   Corre en el puerto `3000`.
    -   Configura un **proxy**: todas las peticiones a `/api` son redirigidas a `http://localhost:3001` (el backend). Esto es clave para el desarrollo local, pero puede ser una fuente de problemas si la URL del backend cambia en otros entornos.
-   **Build (`build`):**
    -   El output se genera en la carpeta `dist`.
    -   Genera `sourcemaps` para facilitar el debugging en producción.

## 5. Configuración de Prisma (`apps/backend/prisma/schema.prisma`)

-   **Datasource**: Configurado para `postgresql` y obtiene la URL de conexión de la variable de entorno `DATABASE_URL`.
-   **Generator**: `prisma-client-js` para generar el cliente de Prisma.
-   **Modelos y Relaciones:**
    -   `User`: Almacena usuarios. Tiene relaciones uno-a-muchos con `Cart`, `Order` y `RefreshToken`.
    -   `Category` y `Product`: Un producto pertenece a una categoría.
    -   `Product` y `ProductVariant`: Un producto puede tener múltiples variantes (ej: diferentes colores o tallas).
    -   `Cart` y `CartItem`: Un carrito contiene múltiples items.
    -   `Order` y `OrderItem`: Una orden contiene los detalles de los productos comprados.
    -   Las relaciones usan IDs (`categoryId`, `userId`, etc.) y están correctamente definidas con `@relation`.

## 6. Orquestación con Docker

### 6.1. Backend (`apps/backend/Dockerfile`)

-   **Build Multi-etapa**:
    1.  **`base` stage**: Instala todas las dependencias (`pnpm install`), copia el código fuente y compila la aplicación (`pnpm --filter backend build`). Esto se hace para aprovechar el cache de Docker y no reinstalar todo en cada cambio de código.
    2.  **`production` stage**: Imagen final más ligera. Instala `pnpm` y otras utilidades (`wget`, `curl`). Crea un usuario no-root (`nestjs`) por seguridad. Copia solo las dependencias de producción (`pnpm install --prod`) y los artefactos del build del `base` stage.
-   **Permisos**: Se asegura de que el usuario `nestjs` sea el propietario de los archivos de la aplicación (`chown`).
-   **Entrypoint/CMD**:
    -   Utiliza `CMD ["/start.sh"]`. El script `start.sh` es el punto de entrada que primero genera el cliente Prisma, luego ejecuta `prisma db push` para aplicar el schema a la base de datos (con reintentos), y finalmente inicia la aplicación con `node dist/main.js`.
-   **Healthcheck**: Un `HEALTHCHECK` está definido para verificar que la ruta `/api/products` (debería ser `/health`) esté disponible, asegurando que la aplicación no solo ha arrancado, sino que está respondiendo.

### 6.2. Frontend (`apps/frontend/Dockerfile`)

-   **Build Multi-etapa**:
    1.  **`base` stage**: Similar al backend, instala dependencias y construye la aplicación React con `pnpm build`.
    2.  **`production` stage**: Utiliza una imagen ligera de `nginx:alpine`. Copia los archivos estáticos generados en el `base` stage a `/usr/share/nginx/html`.
-   **Gestión de Variables de Entorno**:
    -   Copia un script `docker-entrypoint.sh`. Este script se ejecuta al iniciar el contenedor, lee las variables de entorno (como `VITE_API_URL`) y las inyecta en un archivo `env-config.js`. Este archivo es luego cargado por `index.html`, permitiendo que la aplicación React acceda a estas variables en tiempo de ejecución.
-   **Entrypoint/CMD**:
    -   `ENTRYPOINT ["/docker-entrypoint.sh"]` y `CMD ["nginx", "-g", "daemon off;"]`. El entrypoint se encarga de las variables de entorno, y luego el CMD inicia el servidor Nginx para servir los archivos.

### 6.3. Docker Compose (`docker-compose.staging.yml`)

-   **Servicios**: Define `postgres`, `redis`, `backend`, y `frontend`.
-   **Red**: Todos los servicios se comunican a través de una red `bridge` llamada `ecommerce_network`, permitiendo que se refieran entre sí por sus nombres de servicio (ej: `postgres:5432`).
-   **Dependencias**: `backend` depende de que `postgres` y `redis` estén "healthy". `frontend` depende de que `backend` esté "healthy". Esto define el orden de arranque.
-   **Variables de Entorno**:
    -   Pasa variables de entorno a los contenedores. Es crucial que `DATABASE_URL` en el servicio `backend` apunte a `postgres:5432` y no a `localhost`.
    -   Permite sobreescribir variables desde el entorno del host (ej: `${JWT_ACCESS_SECRET:-default-value}`).
-   **Healthchecks**: Cada servicio tiene un `healthcheck` que Docker Compose utiliza para determinar si el servicio está listo y funcionando correctamente antes de iniciar los servicios que dependen de él. Los intervalos, timeouts y retries están configurados para dar tiempo suficiente a las aplicaciones para arrancar, especialmente en un entorno de CI que puede ser más lento.

## 7. Pipeline de Integración Continua (`.github/workflows/ci.yml`)

El pipeline se divide en dos jobs principales que corren secuencialmente: `test-and-build` y `e2e-tests`.

### 7.1. Job: `test-and-build`

-   **Propósito**: Realizar todas las verificaciones estáticas y tests unitarios.
-   **Pasos Clave:**
    1.  **Checkout y Setup**: Configura Node.js 18.x y `pnpm`.
    2.  **Cache**: Cachea las dependencias de `pnpm` para acelerar ejecuciones futuras.
    3.  **Install & Generate**: Instala dependencias y genera los clientes de Prisma.
    4.  **Tests Unitarios**: Ejecuta `pnpm --filter backend test` y `pnpm --filter frontend test:run`. También genera reportes de cobertura y los sube a Codecov.
    5.  **Verificaciones de Calidad**:
        -   `Lint backend/frontend`: `pnpm --filter ... lint`
        -   `Type check backend/frontend`: `pnpm --filter ... type-check`
        -   `Format check`: `pnpm --filter ... format --check`
-   **Puntos Probables de Fallo:**
    -   Errores de linting o formato.
    -   Errores de tipos de TypeScript.
    -   Tests unitarios que fallan.
    -   Inconsistencias en las dependencias (si `pnpm-lock.yaml` no está actualizado).

### 7.2. Job: `e2e-tests`

-   **Propósito**: Ejecutar tests End-to-End en un entorno lo más parecido a producción posible.
-   **Pasos Clave:**
    1.  **Setup**: Similar al job anterior.
    2.  **`docker compose ... up -d`**: Levanta toda la infraestructura (DB, Redis, Backend, Frontend) usando `docker-compose.staging.yml`.
    3.  **`Wait for services to be ready`**: Utiliza `curl` en un bucle para esperar a que los endpoints de health de backend y frontend respondan antes de continuar. **Este es un punto crítico**. Si los `healthchecks` en Docker Compose no son suficientes o el `wait` es muy corto, los tests pueden empezar antes de que los servicios estén listos.
    4.  **`Apply Prisma schema` y `Run E2E seed`**: Ejecuta `db:push` y `db:seed:e2e` contra la base de datos que corre en Docker. Es vital que la `DATABASE_URL` apunte a `localhost:5432` en este paso, ya que el comando se ejecuta en el runner de GitHub Actions, no dentro de un contenedor.
    5.  **`Install Playwright browsers`**: Instala los navegadores necesarios.
    6.  **`Run E2E tests`**: Ejecuta `pnpm --filter frontend test:e2e`.
    7.  **`Upload Playwright report`**: Sube el reporte HTML como un artefacto, accesible desde la página de la acción.
-   **Puntos Probables de Fallo:**
    -   **Fallo al iniciar servicios de Docker**: Errores en los `Dockerfile` o en `docker-compose.yml`. Permisos de archivos, scripts de entrypoint que fallan.
    -   **Healthchecks fallidos**: El backend o frontend no llegan a un estado "healthy" en el tiempo estipulado. Esto puede ser por un error en la app, configuración incorrecta de la DB, o `start_period` muy corto.
    -   **Conexión a la base de datos**: El script de seed o los tests no pueden conectar a la base de datos. Generalmente es un problema con la `DATABASE_URL` (usar `localhost` para comandos en el runner, `postgres` para comunicación inter-container).
    -   **Tests E2E inestables ("flaky")**: Tests que a veces pasan y a veces fallan. Puede ser por falta de esperas (`waitFor...`), selectores débiles, o data de seed inconsistente.
    -   **Inconsistencias de entorno**: La `VITE_API_URL` en el job de E2E debe apuntar al backend (`http://localhost:3001`), mientras que en el `docker-compose.staging.yml` se usa `/api` (proxy). Esta diferencia es manejada por el `authInterceptor.ts`, pero es un punto delicado.

## 8. Variables de Entorno

### Backend
| Variable | `docker-compose.staging.yml` (Staging) | `ci.yml` (Tests) | Propósito |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://...:@postgres:5432/...` | `postgresql://...:@localhost:5432/...` | Conexión a la base de datos. |
| `JWT_ACCESS_SECRET` | Secreto | Secreto de prueba | Firma de tokens de acceso JWT. |
| `JWT_REFRESH_SECRET`| Secreto | Secreto de prueba | Firma de tokens de refresco JWT. |
| `MERCADOPAGO_ACCESS_TOKEN` | Token de prueba | Token de prueba | Credencial de API para MercadoPago. |
| `FRONTEND_URL` | `http://localhost:3000` | `http://localhost:5173` | URL del frontend para callbacks. |
| `BACKEND_URL` | `http://localhost:3001` | `http://localhost:3001` | URL del backend para webhooks. |
| `PORT` | `3001` (implícito) | `3001` (implícito) | Puerto en el que corre la API. |
| `NODE_ENV` | `production` | `test` (implícito) | Entorno de ejecución. |

### Frontend
| Variable | `docker-compose.staging.yml` (Staging) | `ci.yml` (Tests) | Propósito |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | `/api` (usará el proxy de Nginx) | `http://localhost:3001` | URL base de la API. |
| `NODE_ENV` | `production` | `test` (implícito) | Entorno de ejecución. |

Este informe debería proporcionarte una visión clara de la configuración del proyecto y ayudarte a identificar las áreas problemáticas en tu pipeline de CI/CD. Los puntos más sensibles suelen ser la gestión de las variables de entorno entre los diferentes contextos (local, CI, Docker) y la correcta sincronización del arranque de los servicios.
