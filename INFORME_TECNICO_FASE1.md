Hola

### Informe Técnico Completo – Fase 1 (E-commerce de Informática)

#### 1. Arquitectura General
- **Tecnologías**
  - **Frontend**: React 18, Vite, TypeScript, React Router, Zustand, React Query, Axios, `@mercadopago/sdk-js`.
  - **Backend**: NestJS 10, TypeScript, Prisma ORM (PostgreSQL), JWT (Passport), Throttler (rate limiting), Swagger, Zod (validación puntual), Pino (logs), MercadoPago SDK v2.
  - **Base de datos**: PostgreSQL 15 (Docker), esquema gestionado por Prisma.
  - **CI/CD**: GitHub Actions, Docker/Docker Compose (staging), Playwright (E2E), Codecov (coverage unitario).
- **Monorepo**
  - Estructura: `apps/frontend`, `apps/backend`, `packages`.
  - Gestión con pnpm. Jobs de CI separados para build/tests unitarios y E2E (ambiente dockerizado con `docker-compose.staging.yml`).

#### 2. Backend
- **API y controladores**
  - Controladores actualizados a DTOs específicos y tipos centralizados en `apps/backend/src/types`.
  - Conversión explícita de tipos (p.ej., `parseInt` de `req.user.id`).
  - DTOs Swagger (`@ApiProperty`) para documentación consistente y evitar conflictos Zod/Swagger.
- **Seguridad**
  - Autenticación JWT (access/refresh) con Passport.
  - Rate limiting via `@nestjs/throttler`; guards específicos con `getTracker` asíncrono y tipado `ThrottlerRequest`.
  - `helmet` incluido como dependencia de seguridad; se recomienda confirmar su habilitación en bootstrap productivo.
  - Validaciones: DTOs, `class-validator` y Zod en flujos de checkout.
  - Logs estructurados con `nestjs-pino`.
- **Usuarios, autenticación y roles**
  - Usuarios con email/password (`bcryptjs`), refresh tokens modelados.
  - No se evidencian roles granulares (RBAC) en esta fase.
- **Mercado Pago**
  - SDK v2 adoptado correctamente (`MercadoPagoConfig`, `preference.create`, `Payment`).
  - Webhook implementado con tipado de headers/firmas; normalización de tipos (IDs, `street_number` string), y conversiones numéricas consistentes.
- **Seeds de datos**
  - Script `apps/backend/prisma/seed-e2e.ts` crea categorías, usuario de pruebas (`testuser@example.com / Test1234`) y 3 productos con variantes, imágenes y stock > 5.
  - En CI: `prisma db push` y luego `pnpm --filter backend db:seed:e2e` apuntando a `ecommerce_staging`.

#### 3. Frontend
- **Rutas y vistas**
  - PLP (`/productos`), PDP (`/productos/:id`), Carrito (drawer), Checkout (`/checkout`), `CheckoutSuccess` / `CheckoutFailure`.
  - Nota: en `ProductCard` los enlaces usan `id`; en otros contextos se utilizan `slug`. Consistencia a validar en Fase 2.
- **data-testid para testing**
  - Definidos y estables: `product-card`, `product-title`, `add-to-cart-button`, `cart-drawer`, `checkout-button`, `login-email`, `login-password`, `login-submit`, `order-status`, `search-input`, y selectores del carrito.
- **Buenas prácticas UI/UX**
  - Formateo ARS, estados deshabilitados, feedback visual, rutas dedicadas de éxito/fallo para pagos.
- **Consumo de APIs**
  - Axios con interceptor de autenticación; React Query para datos remotos; Zustand para estado de carrito.

#### 4. Base de datos
- **Esquema Prisma (principal)**
  - `Category(id, name, slug)`.
  - `Product(id, title, slug, description?, brand, categoryId, variants[])`.
  - `ProductVariant(id, sku UNIQUE, price, stock, images[], specs JSON, productId)`.
  - `User(id, email UNIQUE, password, name?, refreshTokens[])`, `RefreshToken`.
  - `Cart(id, userId?, items[])`, `CartItem(cartId, variantId, quantity)`.
  - `Order(id, userId?, total, status, mercadopagoId?, preferenceId?, paymentUrl?, shippingAddress JSON?, items[])`, `OrderItem(orderId, variantId, priceAtPurchase, quantity)`.
- **Relaciones y reglas**
  - 1:N `Category → Product`, 1:N `Product → ProductVariant`, 1:N `Order → OrderItem`, 1:N `Cart → CartItem`.
  - Integridad de stock gestionada en capa de aplicación; sin constraint explícito para stock negativo a nivel DB.

#### 5. Tests
- **Unitarios**
  - Backend: `CartService`, `ShippingService`, guards de seguridad. Cobertura enviada a Codecov.
  - Frontend: Tests de componentes y páginas con Testing Library (formatos ARS, selectores estables).
- **E2E (Playwright)**
  - Configuración: `baseURL` `http://localhost:3000`, `headless: true`, `retries: 2`, `trace: on-first-retry`, `video: retain-on-failure`, reporter HTML.
  - Flujo: PLP → PDP → add-to-cart → cart → checkout → login → shipping → create payment → webhook → success.
  - Webhook: simulado con `request.post('/api/payments/mercadopago/webhook', ...)`.
  - Validación de orden pagada: `order-status` visible con mensaje de éxito.
  - Verificación de stock: helper Prisma (`apps/frontend/tests-e2e/utils/db.ts`) suma `stock` de variantes por `slug` y compara `initialStock` vs `finalStock`.
  - Estabilidad: uso de `data-testid`, `retries`, trazas y videos.

#### 6. CI/CD
- **GitHub Actions**
  - Job `test-and-build`: instalación, `prisma generate`, unit tests backend/frontend + coverage, lint, type-check, format check.
  - Job `e2e-tests`: `docker compose -f docker-compose.staging.yml up -d`, healthchecks (backend/frontend), `prisma db push`, `db:seed:e2e`, instalación navegadores Playwright, ejecución E2E.
- **Staging Compose**
  - Servicios: Postgres (db `ecommerce_staging`, `init.sql`), Redis, Backend NestJS, Frontend (Nginx), PgAdmin (perfil `admin`).
  - Healthchecks y dependencias (backend espera Postgres y Redis saludables).
- **Reportes**
  - Reporte HTML de Playwright subido como artifact (`apps/frontend/playwright-report/`).

#### 7. Seguridad
- **Middleware y headers**
  - `helmet` presente; confirmar activación en arranque para entornos productivos.
- **Validación y rate limiting**
  - DTOs/Zod para inputs críticos, Swagger para contratos, guards de Throttler en auth/pagos.
- **Logs y secretos**
  - Pino para logs estructurados. Variables de entorno definidas en CI (valores de test) y en Docker Compose (staging). Secretos reales deben gestionarse vía GitHub Secrets/variables de entorno seguras.
- **Datos sensibles**
  - DTOs limitan exposición; tipos específicos evitan fugas accidentales en respuestas.

#### 8. Estado de la Fase 1
- **Completado/estable**
  - Backend (productos, carrito, checkout, pagos y webhooks), Frontend (PLP, PDP, Carrito, Checkout, Success/Failure), E2E estables con seed automático y verificación de stock, CI/CD reproducible con Docker.
- **Riesgos / pendientes**
  - Consistencia de navegación PDP (`id` vs `slug`) a validar.
  - Confirmar habilitación de `helmet`/CSP en bootstrap productivo.
  - Reforzar validaciones de integridad de stock a nivel dominio (y/o DB si se requiere política estricta).
- **Recomendaciones**
  - Documentar explícitamente políticas de seguridad (headers, CSP, rate limiting, manejo de errores) y confirmar su estado en ambientes productivos.
  - Revisar contratos en Swagger y consistencia de rutas PDP.
  - Mantener `data-testid` como contrato de test durante la auditoría.

#### Conclusión
La Fase 1 presenta una arquitectura moderna y consistente, con flujos críticos implementados (checkout con Mercado Pago) y test E2E robustos (selectores estables, reintentos, trazas, verificación de stock en DB). El pipeline CI/CD soporta ejecución repetible con Docker y genera reportes auditables. Para el cierre definitivo de la fase, las principales atenciones son la confirmación de `helmet`/CSP, la consistencia de rutas PDP y el refuerzo de validaciones de integridad a nivel de dominio.


