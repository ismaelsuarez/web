Run pnpm --filter frontend test:e2e

> @ecommerce/frontend@1.0.0 test:e2e /home/runner/work/web/web/apps/frontend
> playwright test


> @ecommerce/backend@1.0.0 db:generate /home/runner/work/web/web/apps/backend
> prisma generate

Prisma schema loaded from prisma/schema.prisma

✔ Generated Prisma Client (v5.7.1) to ./../../node_modules/.pnpm/@prisma+client@5.7.1_prisma@5.7.1/node_modules/@prisma/client in 148ms

Start using Prisma Client in Node.js (See: https://pris.ly/d/client)
```
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
```
or start using Prisma Client at the edge (See: https://pris.ly/d/accelerate)
```
import { PrismaClient } from '@prisma/client/edge'
const prisma = new PrismaClient()
```

See other ways of importing Prisma Client: http://pris.ly/d/importing-client

┌─────────────────────────────────────────────────────────────┐
│  Deploying your app to serverless or edge functions?        │
│  Try Prisma Accelerate for connection pooling and caching.  │
│  https://pris.ly/cli/accelerate                             │
└─────────────────────────────────────────────────────────────┘


> @ecommerce/backend@1.0.0 db:push /home/runner/work/web/web/apps/backend
> prisma db push

Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "ecommerce_staging", schema "public" at "localhost:5432"

The database is already in sync with the Prisma schema.

Running generate... (Use --skip-generate to skip the generators)
Running generate... - Prisma Client
✔ Generated Prisma Client (v5.7.1) to ./../../node_modules/.pnpm/@prisma+client@
5.7.1_prisma@5.7.1/node_modules/@prisma/client in 398ms


> @ecommerce/backend@1.0.0 db:seed:e2e /home/runner/work/web/web/apps/backend
> ts-node --project tsconfig.seed.json prisma/seed-e2e.ts

🌱 Starting E2E seed...
✅ E2E seed completed
true

Running 27 tests using 1 worker

  ✓  1 [chromium] › basic.spec.ts:6:3 › Basic E2E Tests › should load homepage (420ms)
  ✘  2 [chromium] › basic.spec.ts:16:3 › Basic E2E Tests › should navigate to products page (16.6s)
  ✘  3 [chromium] › basic.spec.ts:16:3 › Basic E2E Tests › should navigate to products page (retry #1) (16.8s)
  ✘  4 [chromium] › basic.spec.ts:16:3 › Basic E2E Tests › should navigate to products page (retry #2) (16.7s)
  ✓  5 [chromium] › basic.spec.ts:29:3 › Basic E2E Tests › should have working navigation (337ms)
  ✘  6 [chromium] › checkout.spec.ts:8:3 › E2E Checkout Flow › Complete checkout flow from catalog to order confirmation (21.6s)
  ✘  7 [chromium] › checkout.spec.ts:8:3 › E2E Checkout Flow › Complete checkout flow from catalog to order confirmation (retry #1) (21.9s)
  ✘  8 [chromium] › checkout.spec.ts:8:3 › E2E Checkout Flow › Complete checkout flow from catalog to order confirmation (retry #2) (21.7s)
  ✘  9 [chromium] › checkout.spec.ts:144:3 › E2E Checkout Flow › Product catalog loads with seed data (21.7s)
  ✘  10 [chromium] › checkout.spec.ts:144:3 › E2E Checkout Flow › Product catalog loads with seed data (retry #1) (21.9s)
  ✘  11 [chromium] › checkout.spec.ts:144:3 › E2E Checkout Flow › Product catalog loads with seed data (retry #2) (21.7s)
  ✘  12 [chromium] › checkout.spec.ts:159:3 › E2E Checkout Flow › Product detail page shows correct seed information (30.0s)
  ✘  13 [chromium] › checkout.spec.ts:159:3 › E2E Checkout Flow › Product detail page shows correct seed information (retry #1) (30.0s)
  ✘  14 [chromium] › checkout.spec.ts:159:3 › E2E Checkout Flow › Product detail page shows correct seed information (retry #2) (30.0s)
  ✘  15 [chromium] › checkout.spec.ts:173:3 › E2E Checkout Flow › Cart functionality works with seed products (30.0s)
  ✘  16 [chromium] › checkout.spec.ts:173:3 › E2E Checkout Flow › Cart functionality works with seed products (retry #1) (30.0s)
  ✘  17 [chromium] › checkout.spec.ts:173:3 › E2E Checkout Flow › Cart functionality works with seed products (retry #2) (30.0s)
  ✓  18 [chromium] › example.spec.ts:6:3 › Example E2E Tests › has title (345ms)
  ✘  19 [chromium] › example.spec.ts:13:3 › Example E2E Tests › get started link (16.6s)
  ✘  20 [chromium] › example.spec.ts:13:3 › Example E2E Tests › get started link (retry #1) (17.0s)
  ✘  21 [chromium] › example.spec.ts:13:3 › Example E2E Tests › get started link (retry #2) (16.2s)
  ✓  22 [firefox] › basic.spec.ts:6:3 › Basic E2E Tests › should load homepage (1.5s)
  ✘  23 [firefox] › basic.spec.ts:16:3 › Basic E2E Tests › should navigate to products page (15.8s)
  ✘  24 [firefox] › basic.spec.ts:16:3 › Basic E2E Tests › should navigate to products page (retry #1) (17.4s)
  ✘  25 [firefox] › basic.spec.ts:16:3 › Basic E2E Tests › should navigate to products page (retry #2) (16.8s)
  ✓  26 [firefox] › basic.spec.ts:29:3 › Basic E2E Tests › should have working navigation (1.5s)
  ✘  27 [firefox] › checkout.spec.ts:8:3 › E2E Checkout Flow › Complete checkout flow from catalog to order confirmation (20.4s)
  ✘  28 [firefox] › checkout.spec.ts:8:3 › E2E Checkout Flow › Complete checkout flow from catalog to order confirmation (retry #1) (23.6s)
  ✘  29 [firefox] › checkout.spec.ts:8:3 › E2E Checkout Flow › Complete checkout flow from catalog to order confirmation (retry #2) (21.3s)
  ✘  30 [firefox] › checkout.spec.ts:144:3 › E2E Checkout Flow › Product catalog loads with seed data (21.3s)
  ✘  31 [firefox] › checkout.spec.ts:144:3 › E2E Checkout Flow › Product catalog loads with seed data (retry #1) (23.1s)
  ✘  32 [firefox] › checkout.spec.ts:144:3 › E2E Checkout Flow › Product catalog loads with seed data (retry #2) (21.2s)
  ✘  33 [firefox] › checkout.spec.ts:159:3 › E2E Checkout Flow › Product detail page shows correct seed information (30.0s)
  ✘  34 [firefox] › checkout.spec.ts:159:3 › E2E Checkout Flow › Product detail page shows correct seed information (retry #1) (30.0s)
  ✘  35 [firefox] › checkout.spec.ts:159:3 › E2E Checkout Flow › Product detail page shows correct seed information (retry #2) (30.0s)
  ✘  36 [firefox] › checkout.spec.ts:173:3 › E2E Checkout Flow › Cart functionality works with seed products (30.0s)
  ✘  37 [firefox] › checkout.spec.ts:173:3 › E2E Checkout Flow › Cart functionality works with seed products (retry #1) (30.0s)
  ✘  38 [firefox] › checkout.spec.ts:173:3 › E2E Checkout Flow › Cart functionality works with seed products (retry #2) (30.0s)
  ✓  39 [firefox] › example.spec.ts:6:3 › Example E2E Tests › has title (1.6s)
  ✘  40 [firefox] › example.spec.ts:13:3 › Example E2E Tests › get started link (15.8s)
  ✘  41 [firefox] › example.spec.ts:13:3 › Example E2E Tests › get started link (retry #1) (17.3s)
  ✘  42 [firefox] › example.spec.ts:13:3 › Example E2E Tests › get started link (retry #2) (16.7s)
  ✓  43 [webkit] › basic.spec.ts:6:3 › Basic E2E Tests › should load homepage (969ms)
  ✘  44 [webkit] › basic.spec.ts:16:3 › Basic E2E Tests › should navigate to products page (16.7s)
  ✘  45 [webkit] › basic.spec.ts:16:3 › Basic E2E Tests › should navigate to products page (retry #1) (17.0s)
  ✘  46 [webkit] › basic.spec.ts:16:3 › Basic E2E Tests › should navigate to products page (retry #2) (16.6s)
  ✓  47 [webkit] › basic.spec.ts:29:3 › Basic E2E Tests › should have working navigation (765ms)
  ✘  48 [webkit] › checkout.spec.ts:8:3 › E2E Checkout Flow › Complete checkout flow from catalog to order confirmation (21.2s)
  ✘  49 [webkit] › checkout.spec.ts:8:3 › E2E Checkout Flow › Complete checkout flow from catalog to order confirmation (retry #1) (21.3s)
  ✘  50 [webkit] › checkout.spec.ts:8:3 › E2E Checkout Flow › Complete checkout flow from catalog to order confirmation (retry #2) (21.5s)
  ✘  51 [webkit] › checkout.spec.ts:144:3 › E2E Checkout Flow › Product catalog loads with seed data (21.2s)
  ✘  52 [webkit] › checkout.spec.ts:144:3 › E2E Checkout Flow › Product catalog loads with seed data (retry #1) (21.5s)
  ✘  53 [webkit] › checkout.spec.ts:144:3 › E2E Checkout Flow › Product catalog loads with seed data (retry #2) (20.8s)
  ✘  54 [webkit] › checkout.spec.ts:159:3 › E2E Checkout Flow › Product detail page shows correct seed information (30.0s)
  ✘  55 [webkit] › checkout.spec.ts:159:3 › E2E Checkout Flow › Product detail page shows correct seed information (retry #1) (30.0s)
  ✘  56 [webkit] › checkout.spec.ts:159:3 › E2E Checkout Flow › Product detail page shows correct seed information (retry #2) (30.0s)
  ✘  57 [webkit] › checkout.spec.ts:173:3 › E2E Checkout Flow › Cart functionality works with seed products (30.0s)
  ✘  58 [webkit] › checkout.spec.ts:173:3 › E2E Checkout Flow › Cart functionality works with seed products (retry #1) (30.0s)
  ✘  59 [webkit] › checkout.spec.ts:173:3 › E2E Checkout Flow › Cart functionality works with seed products (retry #2) (30.0s)
  ✓  60 [webkit] › example.spec.ts:6:3 › Example E2E Tests › has title (692ms)
  ✘  61 [webkit] › example.spec.ts:13:3 › Example E2E Tests › get started link (16.6s)
  ✘  62 [webkit] › example.spec.ts:13:3 › Example E2E Tests › get started link (retry #1) (17.2s)
  ✘  63 [webkit] › example.spec.ts:13:3 › Example E2E Tests › get started link (retry #2) (16.6s)


  1) [chromium] › basic.spec.ts:16:3 › Basic E2E Tests › should navigate to products page ──────────

    Error: Timed out 15000ms waiting for expect(locator).toHaveCount(expected)

    Locator: locator('[data-testid="product-card"]')
    Expected: 1
    Received: 0
    Call log:
      - expect.toHaveCount with timeout 15000ms
      - waiting for locator('[data-testid="product-card"]')
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"


      24 |     
      25 |     // Verificar que se renderiza al menos 1 product-card
    > 26 |     await expect(page.locator('[data-testid="product-card"]')).toHaveCount(1, { timeout: 15000 });
         |                                                                ^
      27 |   });
      28 |
      29 |   test('should have working navigation', async ({ page }) => {

        at /home/runner/work/web/web/apps/frontend/tests-e2e/basic.spec.ts:26:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/basic-Basic-E2E-Tests-should-navigate-to-products-page-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: Timed out 15000ms waiting for expect(locator).toHaveCount(expected)

    Locator: locator('[data-testid="product-card"]')
    Expected: 1
    Received: 0
    Call log:
      - expect.toHaveCount with timeout 15000ms
      - waiting for locator('[data-testid="product-card"]')
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"


      24 |     
      25 |     // Verificar que se renderiza al menos 1 product-card
    > 26 |     await expect(page.locator('[data-testid="product-card"]')).toHaveCount(1, { timeout: 15000 });
         |                                                                ^
      27 |   });
      28 |
      29 |   test('should have working navigation', async ({ page }) => {

        at /home/runner/work/web/web/apps/frontend/tests-e2e/basic.spec.ts:26:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/basic-Basic-E2E-Tests-should-navigate-to-products-page-chromium-retry1/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/basic-Basic-E2E-Tests-should-navigate-to-products-page-chromium-retry1/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/basic-Basic-E2E-Tests-should-navigate-to-products-page-chromium-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #2 ───────────────────────────────────────────────────────────────────────────────────────

    Error: Timed out 15000ms waiting for expect(locator).toHaveCount(expected)

    Locator: locator('[data-testid="product-card"]')
    Expected: 1
    Received: 0
    Call log:
      - expect.toHaveCount with timeout 15000ms
      - waiting for locator('[data-testid="product-card"]')
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"


      24 |     
      25 |     // Verificar que se renderiza al menos 1 product-card
    > 26 |     await expect(page.locator('[data-testid="product-card"]')).toHaveCount(1, { timeout: 15000 });
         |                                                                ^
      27 |   });
      28 |
      29 |   test('should have working navigation', async ({ page }) => {

        at /home/runner/work/web/web/apps/frontend/tests-e2e/basic.spec.ts:26:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/basic-Basic-E2E-Tests-should-navigate-to-products-page-chromium-retry2/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [chromium] › checkout.spec.ts:8:3 › E2E Checkout Flow › Complete checkout flow from catalog to order confirmation › Navigate to products catalog 

    Error: expect(received).toBeGreaterThan(expected)

    Expected: > 0
    Received:   0

    Call Log:
    - Timeout 20000ms exceeded while waiting on the predicate

      19 |       // Validar que se cargan productos del seed con retries tolerantes a readiness
      20 |       const cards = page.locator(SELECTORS.productCard);
    > 21 |       await expect.poll(async () => await cards.count(), { timeout: 20000, intervals: [500] }).toBeGreaterThan(0);
         |                                                                                                ^
      22 |       
      23 |       // Buscar el producto específico del seed
      24 |       const searchInput = page.locator(SELECTORS.searchInput);

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:21:96
        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:15:5

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Complete-checkout-flow-from-catalog-to-order-confirmation-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(received).toBeGreaterThan(expected)

    Expected: > 0
    Received:   0

    Call Log:
    - Timeout 20000ms exceeded while waiting on the predicate

      19 |       // Validar que se cargan productos del seed con retries tolerantes a readiness
      20 |       const cards = page.locator(SELECTORS.productCard);
    > 21 |       await expect.poll(async () => await cards.count(), { timeout: 20000, intervals: [500] }).toBeGreaterThan(0);
         |                                                                                                ^
      22 |       
      23 |       // Buscar el producto específico del seed
      24 |       const searchInput = page.locator(SELECTORS.searchInput);

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:21:96
        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:15:5

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Complete-checkout-flow-from-catalog-to-order-confirmation-chromium-retry1/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Complete-checkout-flow-from-catalog-to-order-confirmation-chromium-retry1/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/checkout-E2E-Checkout-Flow-Complete-checkout-flow-from-catalog-to-order-confirmation-chromium-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #2 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(received).toBeGreaterThan(expected)

    Expected: > 0
    Received:   0

    Call Log:
    - Timeout 20000ms exceeded while waiting on the predicate

      19 |       // Validar que se cargan productos del seed con retries tolerantes a readiness
      20 |       const cards = page.locator(SELECTORS.productCard);
    > 21 |       await expect.poll(async () => await cards.count(), { timeout: 20000, intervals: [500] }).toBeGreaterThan(0);
         |                                                                                                ^
      22 |       
      23 |       // Buscar el producto específico del seed
      24 |       const searchInput = page.locator(SELECTORS.searchInput);

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:21:96
        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:15:5

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Complete-checkout-flow-from-catalog-to-order-confirmation-chromium-retry2/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

  3) [chromium] › checkout.spec.ts:144:3 › E2E Checkout Flow › Product catalog loads with seed data 

    Error: expect(received).toBeGreaterThan(expected)

    Expected: > 0
    Received:   0

    Call Log:
    - Timeout 20000ms exceeded while waiting on the predicate

      149 |     
      150 |     // Verificar que hay productos del seed (tolerante)
    > 151 |     await expect.poll(async () => await page.locator('[data-testid="product-card"]').count(), { timeout: 20000, intervals: [500] }).toBeGreaterThan(0);
          |                                                                                                                                     ^
      152 |     
      153 |     // Verificar que aparecen los productos del seed
      154 |     await expect(page.locator('text=Notebook Gamer Pro')).toBeVisible();

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:151:133

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Product-catalog-loads-with-seed-data-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(received).toBeGreaterThan(expected)

    Expected: > 0
    Received:   0

    Call Log:
    - Timeout 20000ms exceeded while waiting on the predicate

      149 |     
      150 |     // Verificar que hay productos del seed (tolerante)
    > 151 |     await expect.poll(async () => await page.locator('[data-testid="product-card"]').count(), { timeout: 20000, intervals: [500] }).toBeGreaterThan(0);
          |                                                                                                                                     ^
      152 |     
      153 |     // Verificar que aparecen los productos del seed
      154 |     await expect(page.locator('text=Notebook Gamer Pro')).toBeVisible();

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:151:133

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Product-catalog-loads-with-seed-data-chromium-retry1/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Product-catalog-loads-with-seed-data-chromium-retry1/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/checkout-E2E-Checkout-Flow-Product-catalog-loads-with-seed-data-chromium-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #2 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(received).toBeGreaterThan(expected)

    Expected: > 0
    Received:   0

    Call Log:
    - Timeout 20000ms exceeded while waiting on the predicate

      149 |     
      150 |     // Verificar que hay productos del seed (tolerante)
    > 151 |     await expect.poll(async () => await page.locator('[data-testid="product-card"]').count(), { timeout: 20000, intervals: [500] }).toBeGreaterThan(0);
          |                                                                                                                                     ^
      152 |     
      153 |     // Verificar que aparecen los productos del seed
      154 |     await expect(page.locator('text=Notebook Gamer Pro')).toBeVisible();

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:151:133

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Product-catalog-loads-with-seed-data-chromium-retry2/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

  4) [chromium] › checkout.spec.ts:159:3 › E2E Checkout Flow › Product detail page shows correct seed information 

    Test timeout of 30000ms exceeded.

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
      - waiting for locator('[data-testid="product-card"]').first()


      160 |     // Ir a productos y seleccionar el notebook del seed
      161 |     await page.goto('/productos');
    > 162 |     await page.locator('[data-testid="product-card"]').first().click();
          |                                                                ^
      163 |     
      164 |     // Verificar elementos de la página de producto
      165 |     await expect(page.locator('[data-testid="product-title"]')).toBeVisible();

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:162:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Product-detail-page-shows-correct-seed-information-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Test timeout of 30000ms exceeded.

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
      - waiting for locator('[data-testid="product-card"]').first()


      160 |     // Ir a productos y seleccionar el notebook del seed
      161 |     await page.goto('/productos');
    > 162 |     await page.locator('[data-testid="product-card"]').first().click();
          |                                                                ^
      163 |     
      164 |     // Verificar elementos de la página de producto
      165 |     await expect(page.locator('[data-testid="product-title"]')).toBeVisible();

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:162:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Product-detail-page-shows-correct-seed-information-chromium-retry1/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Product-detail-page-shows-correct-seed-information-chromium-retry1/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/checkout-E2E-Checkout-Flow-Product-detail-page-shows-correct-seed-information-chromium-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #2 ───────────────────────────────────────────────────────────────────────────────────────

    Test timeout of 30000ms exceeded.

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
      - waiting for locator('[data-testid="product-card"]').first()


      160 |     // Ir a productos y seleccionar el notebook del seed
      161 |     await page.goto('/productos');
    > 162 |     await page.locator('[data-testid="product-card"]').first().click();
          |                                                                ^
      163 |     
      164 |     // Verificar elementos de la página de producto
      165 |     await expect(page.locator('[data-testid="product-title"]')).toBeVisible();

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:162:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Product-detail-page-shows-correct-seed-information-chromium-retry2/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

  5) [chromium] › checkout.spec.ts:173:3 › E2E Checkout Flow › Cart functionality works with seed products 

    Test timeout of 30000ms exceeded.

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
      - waiting for locator('[data-testid="product-card"]').first()


      174 |     // Agregar producto del seed al carrito
      175 |     await page.goto('/productos');
    > 176 |     await page.locator('[data-testid="product-card"]').first().click();
          |                                                                ^
      177 |     await page.locator('[data-testid="add-to-cart-button"]').click();
      178 |     
      179 |     // Verificar que aparece en el carrito

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:176:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Cart-functionality-works-with-seed-products-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Test timeout of 30000ms exceeded.

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
      - waiting for locator('[data-testid="product-card"]').first()


      174 |     // Agregar producto del seed al carrito
      175 |     await page.goto('/productos');
    > 176 |     await page.locator('[data-testid="product-card"]').first().click();
          |                                                                ^
      177 |     await page.locator('[data-testid="add-to-cart-button"]').click();
      178 |     
      179 |     // Verificar que aparece en el carrito

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:176:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Cart-functionality-works-with-seed-products-chromium-retry1/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Cart-functionality-works-with-seed-products-chromium-retry1/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/checkout-E2E-Checkout-Flow-Cart-functionality-works-with-seed-products-chromium-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #2 ───────────────────────────────────────────────────────────────────────────────────────

    Test timeout of 30000ms exceeded.

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
      - waiting for locator('[data-testid="product-card"]').first()


      174 |     // Agregar producto del seed al carrito
      175 |     await page.goto('/productos');
    > 176 |     await page.locator('[data-testid="product-card"]').first().click();
          |                                                                ^
      177 |     await page.locator('[data-testid="add-to-cart-button"]').click();
      178 |     
      179 |     // Verificar que aparece en el carrito

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:176:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Cart-functionality-works-with-seed-products-chromium-retry2/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

  6) [chromium] › example.spec.ts:13:3 › Example E2E Tests › get started link ──────────────────────

    Error: Timed out 15000ms waiting for expect(locator).toHaveCount(expected)

    Locator: locator('[data-testid="product-card"]')
    Expected: 1
    Received: 0
    Call log:
      - expect.toHaveCount with timeout 15000ms
      - waiting for locator('[data-testid="product-card"]')
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"


      21 |     
      22 |     // Verificar que se renderiza al menos 1 product-card
    > 23 |     await expect(page.locator('[data-testid="product-card"]')).toHaveCount(1, { timeout: 15000 });
         |                                                                ^
      24 |   });
      25 | });
      26 |

        at /home/runner/work/web/web/apps/frontend/tests-e2e/example.spec.ts:23:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/example-Example-E2E-Tests-get-started-link-chromium/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: Timed out 15000ms waiting for expect(locator).toHaveCount(expected)

    Locator: locator('[data-testid="product-card"]')
    Expected: 1
    Received: 0
    Call log:
      - expect.toHaveCount with timeout 15000ms
      - waiting for locator('[data-testid="product-card"]')
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"


      21 |     
      22 |     // Verificar que se renderiza al menos 1 product-card
    > 23 |     await expect(page.locator('[data-testid="product-card"]')).toHaveCount(1, { timeout: 15000 });
         |                                                                ^
      24 |   });
      25 | });
      26 |

        at /home/runner/work/web/web/apps/frontend/tests-e2e/example.spec.ts:23:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/example-Example-E2E-Tests-get-started-link-chromium-retry1/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/example-Example-E2E-Tests-get-started-link-chromium-retry1/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/example-Example-E2E-Tests-get-started-link-chromium-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #2 ───────────────────────────────────────────────────────────────────────────────────────

    Error: Timed out 15000ms waiting for expect(locator).toHaveCount(expected)

    Locator: locator('[data-testid="product-card"]')
    Expected: 1
    Received: 0
    Call log:
      - expect.toHaveCount with timeout 15000ms
      - waiting for locator('[data-testid="product-card"]')
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"


      21 |     
      22 |     // Verificar que se renderiza al menos 1 product-card
    > 23 |     await expect(page.locator('[data-testid="product-card"]')).toHaveCount(1, { timeout: 15000 });
         |                                                                ^
      24 |   });
      25 | });
      26 |

        at /home/runner/work/web/web/apps/frontend/tests-e2e/example.spec.ts:23:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/example-Example-E2E-Tests-get-started-link-chromium-retry2/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

  7) [firefox] › basic.spec.ts:16:3 › Basic E2E Tests › should navigate to products page ───────────

    Error: Timed out 15000ms waiting for expect(locator).toHaveCount(expected)

    Locator: locator('[data-testid="product-card"]')
    Expected: 1
    Received: 0
    Call log:
      - expect.toHaveCount with timeout 15000ms
      - waiting for locator('[data-testid="product-card"]')
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"


      24 |     
      25 |     // Verificar que se renderiza al menos 1 product-card
    > 26 |     await expect(page.locator('[data-testid="product-card"]')).toHaveCount(1, { timeout: 15000 });
         |                                                                ^
      27 |   });
      28 |
      29 |   test('should have working navigation', async ({ page }) => {

        at /home/runner/work/web/web/apps/frontend/tests-e2e/basic.spec.ts:26:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/basic-Basic-E2E-Tests-should-navigate-to-products-page-firefox/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: Timed out 15000ms waiting for expect(locator).toHaveCount(expected)

    Locator: locator('[data-testid="product-card"]')
    Expected: 1
    Received: 0
    Call log:
      - expect.toHaveCount with timeout 15000ms
      - waiting for locator('[data-testid="product-card"]')
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"


      24 |     
      25 |     // Verificar que se renderiza al menos 1 product-card
    > 26 |     await expect(page.locator('[data-testid="product-card"]')).toHaveCount(1, { timeout: 15000 });
         |                                                                ^
      27 |   });
      28 |
      29 |   test('should have working navigation', async ({ page }) => {

        at /home/runner/work/web/web/apps/frontend/tests-e2e/basic.spec.ts:26:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/basic-Basic-E2E-Tests-should-navigate-to-products-page-firefox-retry1/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/basic-Basic-E2E-Tests-should-navigate-to-products-page-firefox-retry1/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/basic-Basic-E2E-Tests-should-navigate-to-products-page-firefox-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #2 ───────────────────────────────────────────────────────────────────────────────────────

    Error: Timed out 15000ms waiting for expect(locator).toHaveCount(expected)

    Locator: locator('[data-testid="product-card"]')
    Expected: 1
    Received: 0
    Call log:
      - expect.toHaveCount with timeout 15000ms
      - waiting for locator('[data-testid="product-card"]')
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"


      24 |     
      25 |     // Verificar que se renderiza al menos 1 product-card
    > 26 |     await expect(page.locator('[data-testid="product-card"]')).toHaveCount(1, { timeout: 15000 });
         |                                                                ^
      27 |   });
      28 |
      29 |   test('should have working navigation', async ({ page }) => {

        at /home/runner/work/web/web/apps/frontend/tests-e2e/basic.spec.ts:26:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/basic-Basic-E2E-Tests-should-navigate-to-products-page-firefox-retry2/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

  8) [firefox] › checkout.spec.ts:8:3 › E2E Checkout Flow › Complete checkout flow from catalog to order confirmation › Navigate to products catalog 

    Error: expect(received).toBeGreaterThan(expected)

    Expected: > 0
    Received:   0

    Call Log:
    - Timeout 20000ms exceeded while waiting on the predicate

      19 |       // Validar que se cargan productos del seed con retries tolerantes a readiness
      20 |       const cards = page.locator(SELECTORS.productCard);
    > 21 |       await expect.poll(async () => await cards.count(), { timeout: 20000, intervals: [500] }).toBeGreaterThan(0);
         |                                                                                                ^
      22 |       
      23 |       // Buscar el producto específico del seed
      24 |       const searchInput = page.locator(SELECTORS.searchInput);

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:21:96
        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:15:5

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Complete-checkout-flow-from-catalog-to-order-confirmation-firefox/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(received).toBeGreaterThan(expected)

    Expected: > 0
    Received:   0

    Call Log:
    - Timeout 20000ms exceeded while waiting on the predicate

      19 |       // Validar que se cargan productos del seed con retries tolerantes a readiness
      20 |       const cards = page.locator(SELECTORS.productCard);
    > 21 |       await expect.poll(async () => await cards.count(), { timeout: 20000, intervals: [500] }).toBeGreaterThan(0);
         |                                                                                                ^
      22 |       
      23 |       // Buscar el producto específico del seed
      24 |       const searchInput = page.locator(SELECTORS.searchInput);

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:21:96
        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:15:5

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Complete-checkout-flow-from-catalog-to-order-confirmation-firefox-retry1/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Complete-checkout-flow-from-catalog-to-order-confirmation-firefox-retry1/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/checkout-E2E-Checkout-Flow-Complete-checkout-flow-from-catalog-to-order-confirmation-firefox-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #2 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(received).toBeGreaterThan(expected)

    Expected: > 0
    Received:   0

    Call Log:
    - Timeout 20000ms exceeded while waiting on the predicate

      19 |       // Validar que se cargan productos del seed con retries tolerantes a readiness
      20 |       const cards = page.locator(SELECTORS.productCard);
    > 21 |       await expect.poll(async () => await cards.count(), { timeout: 20000, intervals: [500] }).toBeGreaterThan(0);
         |                                                                                                ^
      22 |       
      23 |       // Buscar el producto específico del seed
      24 |       const searchInput = page.locator(SELECTORS.searchInput);

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:21:96
        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:15:5

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Complete-checkout-flow-from-catalog-to-order-confirmation-firefox-retry2/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

  9) [firefox] › checkout.spec.ts:144:3 › E2E Checkout Flow › Product catalog loads with seed data ─

    Error: expect(received).toBeGreaterThan(expected)

    Expected: > 0
    Received:   0

    Call Log:
    - Timeout 20000ms exceeded while waiting on the predicate

      149 |     
      150 |     // Verificar que hay productos del seed (tolerante)
    > 151 |     await expect.poll(async () => await page.locator('[data-testid="product-card"]').count(), { timeout: 20000, intervals: [500] }).toBeGreaterThan(0);
          |                                                                                                                                     ^
      152 |     
      153 |     // Verificar que aparecen los productos del seed
      154 |     await expect(page.locator('text=Notebook Gamer Pro')).toBeVisible();

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:151:133

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Product-catalog-loads-with-seed-data-firefox/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(received).toBeGreaterThan(expected)

    Expected: > 0
    Received:   0

    Call Log:
    - Timeout 20000ms exceeded while waiting on the predicate

      149 |     
      150 |     // Verificar que hay productos del seed (tolerante)
    > 151 |     await expect.poll(async () => await page.locator('[data-testid="product-card"]').count(), { timeout: 20000, intervals: [500] }).toBeGreaterThan(0);
          |                                                                                                                                     ^
      152 |     
      153 |     // Verificar que aparecen los productos del seed
      154 |     await expect(page.locator('text=Notebook Gamer Pro')).toBeVisible();

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:151:133

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Product-catalog-loads-with-seed-data-firefox-retry1/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Product-catalog-loads-with-seed-data-firefox-retry1/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/checkout-E2E-Checkout-Flow-Product-catalog-loads-with-seed-data-firefox-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #2 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(received).toBeGreaterThan(expected)

    Expected: > 0
    Received:   0

    Call Log:
    - Timeout 20000ms exceeded while waiting on the predicate

      149 |     
      150 |     // Verificar que hay productos del seed (tolerante)
    > 151 |     await expect.poll(async () => await page.locator('[data-testid="product-card"]').count(), { timeout: 20000, intervals: [500] }).toBeGreaterThan(0);
          |                                                                                                                                     ^
      152 |     
      153 |     // Verificar que aparecen los productos del seed
      154 |     await expect(page.locator('text=Notebook Gamer Pro')).toBeVisible();

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:151:133

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Product-catalog-loads-with-seed-data-firefox-retry2/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

  10) [firefox] › checkout.spec.ts:159:3 › E2E Checkout Flow › Product detail page shows correct seed information 

    Test timeout of 30000ms exceeded.

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
      - waiting for locator('[data-testid="product-card"]').first()


      160 |     // Ir a productos y seleccionar el notebook del seed
      161 |     await page.goto('/productos');
    > 162 |     await page.locator('[data-testid="product-card"]').first().click();
          |                                                                ^
      163 |     
      164 |     // Verificar elementos de la página de producto
      165 |     await expect(page.locator('[data-testid="product-title"]')).toBeVisible();

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:162:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Product-detail-page-shows-correct-seed-information-firefox/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Test timeout of 30000ms exceeded.

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
      - waiting for locator('[data-testid="product-card"]').first()


      160 |     // Ir a productos y seleccionar el notebook del seed
      161 |     await page.goto('/productos');
    > 162 |     await page.locator('[data-testid="product-card"]').first().click();
          |                                                                ^
      163 |     
      164 |     // Verificar elementos de la página de producto
      165 |     await expect(page.locator('[data-testid="product-title"]')).toBeVisible();

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:162:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Product-detail-page-shows-correct-seed-information-firefox-retry1/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Product-detail-page-shows-correct-seed-information-firefox-retry1/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/checkout-E2E-Checkout-Flow-Product-detail-page-shows-correct-seed-information-firefox-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #2 ───────────────────────────────────────────────────────────────────────────────────────

    Test timeout of 30000ms exceeded.

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
      - waiting for locator('[data-testid="product-card"]').first()


      160 |     // Ir a productos y seleccionar el notebook del seed
      161 |     await page.goto('/productos');
    > 162 |     await page.locator('[data-testid="product-card"]').first().click();
          |                                                                ^
      163 |     
      164 |     // Verificar elementos de la página de producto
      165 |     await expect(page.locator('[data-testid="product-title"]')).toBeVisible();

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:162:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Product-detail-page-shows-correct-seed-information-firefox-retry2/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

  11) [firefox] › checkout.spec.ts:173:3 › E2E Checkout Flow › Cart functionality works with seed products 

    Test timeout of 30000ms exceeded.

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
      - waiting for locator('[data-testid="product-card"]').first()


      174 |     // Agregar producto del seed al carrito
      175 |     await page.goto('/productos');
    > 176 |     await page.locator('[data-testid="product-card"]').first().click();
          |                                                                ^
      177 |     await page.locator('[data-testid="add-to-cart-button"]').click();
      178 |     
      179 |     // Verificar que aparece en el carrito

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:176:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Cart-functionality-works-with-seed-products-firefox/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Test timeout of 30000ms exceeded.

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
      - waiting for locator('[data-testid="product-card"]').first()


      174 |     // Agregar producto del seed al carrito
      175 |     await page.goto('/productos');
    > 176 |     await page.locator('[data-testid="product-card"]').first().click();
          |                                                                ^
      177 |     await page.locator('[data-testid="add-to-cart-button"]').click();
      178 |     
      179 |     // Verificar que aparece en el carrito

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:176:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Cart-functionality-works-with-seed-products-firefox-retry1/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Cart-functionality-works-with-seed-products-firefox-retry1/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/checkout-E2E-Checkout-Flow-Cart-functionality-works-with-seed-products-firefox-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #2 ───────────────────────────────────────────────────────────────────────────────────────

    Test timeout of 30000ms exceeded.

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
      - waiting for locator('[data-testid="product-card"]').first()


      174 |     // Agregar producto del seed al carrito
      175 |     await page.goto('/productos');
    > 176 |     await page.locator('[data-testid="product-card"]').first().click();
          |                                                                ^
      177 |     await page.locator('[data-testid="add-to-cart-button"]').click();
      178 |     
      179 |     // Verificar que aparece en el carrito

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:176:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Cart-functionality-works-with-seed-products-firefox-retry2/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

  12) [firefox] › example.spec.ts:13:3 › Example E2E Tests › get started link ──────────────────────

    Error: Timed out 15000ms waiting for expect(locator).toHaveCount(expected)

    Locator: locator('[data-testid="product-card"]')
    Expected: 1
    Received: 0
    Call log:
      - expect.toHaveCount with timeout 15000ms
      - waiting for locator('[data-testid="product-card"]')
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"


      21 |     
      22 |     // Verificar que se renderiza al menos 1 product-card
    > 23 |     await expect(page.locator('[data-testid="product-card"]')).toHaveCount(1, { timeout: 15000 });
         |                                                                ^
      24 |   });
      25 | });
      26 |

        at /home/runner/work/web/web/apps/frontend/tests-e2e/example.spec.ts:23:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/example-Example-E2E-Tests-get-started-link-firefox/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: Timed out 15000ms waiting for expect(locator).toHaveCount(expected)

    Locator: locator('[data-testid="product-card"]')
    Expected: 1
    Received: 0
    Call log:
      - expect.toHaveCount with timeout 15000ms
      - waiting for locator('[data-testid="product-card"]')
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"


      21 |     
      22 |     // Verificar que se renderiza al menos 1 product-card
    > 23 |     await expect(page.locator('[data-testid="product-card"]')).toHaveCount(1, { timeout: 15000 });
         |                                                                ^
      24 |   });
      25 | });
      26 |

        at /home/runner/work/web/web/apps/frontend/tests-e2e/example.spec.ts:23:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/example-Example-E2E-Tests-get-started-link-firefox-retry1/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/example-Example-E2E-Tests-get-started-link-firefox-retry1/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/example-Example-E2E-Tests-get-started-link-firefox-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #2 ───────────────────────────────────────────────────────────────────────────────────────

    Error: Timed out 15000ms waiting for expect(locator).toHaveCount(expected)

    Locator: locator('[data-testid="product-card"]')
    Expected: 1
    Received: 0
    Call log:
      - expect.toHaveCount with timeout 15000ms
      - waiting for locator('[data-testid="product-card"]')
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"


      21 |     
      22 |     // Verificar que se renderiza al menos 1 product-card
    > 23 |     await expect(page.locator('[data-testid="product-card"]')).toHaveCount(1, { timeout: 15000 });
         |                                                                ^
      24 |   });
      25 | });
      26 |

        at /home/runner/work/web/web/apps/frontend/tests-e2e/example.spec.ts:23:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/example-Example-E2E-Tests-get-started-link-firefox-retry2/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

  13) [webkit] › basic.spec.ts:16:3 › Basic E2E Tests › should navigate to products page ───────────

    Error: Timed out 15000ms waiting for expect(locator).toHaveCount(expected)

    Locator: locator('[data-testid="product-card"]')
    Expected: 1
    Received: 0
    Call log:
      - expect.toHaveCount with timeout 15000ms
      - waiting for locator('[data-testid="product-card"]')
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"


      24 |     
      25 |     // Verificar que se renderiza al menos 1 product-card
    > 26 |     await expect(page.locator('[data-testid="product-card"]')).toHaveCount(1, { timeout: 15000 });
         |                                                                ^
      27 |   });
      28 |
      29 |   test('should have working navigation', async ({ page }) => {

        at /home/runner/work/web/web/apps/frontend/tests-e2e/basic.spec.ts:26:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/basic-Basic-E2E-Tests-should-navigate-to-products-page-webkit/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: Timed out 15000ms waiting for expect(locator).toHaveCount(expected)

    Locator: locator('[data-testid="product-card"]')
    Expected: 1
    Received: 0
    Call log:
      - expect.toHaveCount with timeout 15000ms
      - waiting for locator('[data-testid="product-card"]')
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"


      24 |     
      25 |     // Verificar que se renderiza al menos 1 product-card
    > 26 |     await expect(page.locator('[data-testid="product-card"]')).toHaveCount(1, { timeout: 15000 });
         |                                                                ^
      27 |   });
      28 |
      29 |   test('should have working navigation', async ({ page }) => {

        at /home/runner/work/web/web/apps/frontend/tests-e2e/basic.spec.ts:26:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/basic-Basic-E2E-Tests-should-navigate-to-products-page-webkit-retry1/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/basic-Basic-E2E-Tests-should-navigate-to-products-page-webkit-retry1/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/basic-Basic-E2E-Tests-should-navigate-to-products-page-webkit-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #2 ───────────────────────────────────────────────────────────────────────────────────────

    Error: Timed out 15000ms waiting for expect(locator).toHaveCount(expected)

    Locator: locator('[data-testid="product-card"]')
    Expected: 1
    Received: 0
    Call log:
      - expect.toHaveCount with timeout 15000ms
      - waiting for locator('[data-testid="product-card"]')
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"


      24 |     
      25 |     // Verificar que se renderiza al menos 1 product-card
    > 26 |     await expect(page.locator('[data-testid="product-card"]')).toHaveCount(1, { timeout: 15000 });
         |                                                                ^
      27 |   });
      28 |
      29 |   test('should have working navigation', async ({ page }) => {

        at /home/runner/work/web/web/apps/frontend/tests-e2e/basic.spec.ts:26:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/basic-Basic-E2E-Tests-should-navigate-to-products-page-webkit-retry2/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

  14) [webkit] › checkout.spec.ts:8:3 › E2E Checkout Flow › Complete checkout flow from catalog to order confirmation › Navigate to products catalog 

    Error: expect(received).toBeGreaterThan(expected)

    Expected: > 0
    Received:   0

    Call Log:
    - Timeout 20000ms exceeded while waiting on the predicate

      19 |       // Validar que se cargan productos del seed con retries tolerantes a readiness
      20 |       const cards = page.locator(SELECTORS.productCard);
    > 21 |       await expect.poll(async () => await cards.count(), { timeout: 20000, intervals: [500] }).toBeGreaterThan(0);
         |                                                                                                ^
      22 |       
      23 |       // Buscar el producto específico del seed
      24 |       const searchInput = page.locator(SELECTORS.searchInput);

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:21:96
        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:15:5

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Complete-checkout-flow-from-catalog-to-order-confirmation-webkit/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(received).toBeGreaterThan(expected)

    Expected: > 0
    Received:   0

    Call Log:
    - Timeout 20000ms exceeded while waiting on the predicate

      19 |       // Validar que se cargan productos del seed con retries tolerantes a readiness
      20 |       const cards = page.locator(SELECTORS.productCard);
    > 21 |       await expect.poll(async () => await cards.count(), { timeout: 20000, intervals: [500] }).toBeGreaterThan(0);
         |                                                                                                ^
      22 |       
      23 |       // Buscar el producto específico del seed
      24 |       const searchInput = page.locator(SELECTORS.searchInput);

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:21:96
        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:15:5

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Complete-checkout-flow-from-catalog-to-order-confirmation-webkit-retry1/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Complete-checkout-flow-from-catalog-to-order-confirmation-webkit-retry1/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/checkout-E2E-Checkout-Flow-Complete-checkout-flow-from-catalog-to-order-confirmation-webkit-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #2 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(received).toBeGreaterThan(expected)

    Expected: > 0
    Received:   0

    Call Log:
    - Timeout 20000ms exceeded while waiting on the predicate

      19 |       // Validar que se cargan productos del seed con retries tolerantes a readiness
      20 |       const cards = page.locator(SELECTORS.productCard);
    > 21 |       await expect.poll(async () => await cards.count(), { timeout: 20000, intervals: [500] }).toBeGreaterThan(0);
         |                                                                                                ^
      22 |       
      23 |       // Buscar el producto específico del seed
      24 |       const searchInput = page.locator(SELECTORS.searchInput);

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:21:96
        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:15:5

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Complete-checkout-flow-from-catalog-to-order-confirmation-webkit-retry2/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

  15) [webkit] › checkout.spec.ts:144:3 › E2E Checkout Flow › Product catalog loads with seed data ─

    Error: expect(received).toBeGreaterThan(expected)

    Expected: > 0
    Received:   0

    Call Log:
    - Timeout 20000ms exceeded while waiting on the predicate

      149 |     
      150 |     // Verificar que hay productos del seed (tolerante)
    > 151 |     await expect.poll(async () => await page.locator('[data-testid="product-card"]').count(), { timeout: 20000, intervals: [500] }).toBeGreaterThan(0);
          |                                                                                                                                     ^
      152 |     
      153 |     // Verificar que aparecen los productos del seed
      154 |     await expect(page.locator('text=Notebook Gamer Pro')).toBeVisible();

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:151:133

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Product-catalog-loads-with-seed-data-webkit/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(received).toBeGreaterThan(expected)

    Expected: > 0
    Received:   0

    Call Log:
    - Timeout 20000ms exceeded while waiting on the predicate

      149 |     
      150 |     // Verificar que hay productos del seed (tolerante)
    > 151 |     await expect.poll(async () => await page.locator('[data-testid="product-card"]').count(), { timeout: 20000, intervals: [500] }).toBeGreaterThan(0);
          |                                                                                                                                     ^
      152 |     
      153 |     // Verificar que aparecen los productos del seed
      154 |     await expect(page.locator('text=Notebook Gamer Pro')).toBeVisible();

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:151:133

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Product-catalog-loads-with-seed-data-webkit-retry1/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Product-catalog-loads-with-seed-data-webkit-retry1/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/checkout-E2E-Checkout-Flow-Product-catalog-loads-with-seed-data-webkit-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #2 ───────────────────────────────────────────────────────────────────────────────────────

    Error: expect(received).toBeGreaterThan(expected)

    Expected: > 0
    Received:   0

    Call Log:
    - Timeout 20000ms exceeded while waiting on the predicate

      149 |     
      150 |     // Verificar que hay productos del seed (tolerante)
    > 151 |     await expect.poll(async () => await page.locator('[data-testid="product-card"]').count(), { timeout: 20000, intervals: [500] }).toBeGreaterThan(0);
          |                                                                                                                                     ^
      152 |     
      153 |     // Verificar que aparecen los productos del seed
      154 |     await expect(page.locator('text=Notebook Gamer Pro')).toBeVisible();

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:151:133

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Product-catalog-loads-with-seed-data-webkit-retry2/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

  16) [webkit] › checkout.spec.ts:159:3 › E2E Checkout Flow › Product detail page shows correct seed information 

    Test timeout of 30000ms exceeded.

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
      - waiting for locator('[data-testid="product-card"]').first()


      160 |     // Ir a productos y seleccionar el notebook del seed
      161 |     await page.goto('/productos');
    > 162 |     await page.locator('[data-testid="product-card"]').first().click();
          |                                                                ^
      163 |     
      164 |     // Verificar elementos de la página de producto
      165 |     await expect(page.locator('[data-testid="product-title"]')).toBeVisible();

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:162:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Product-detail-page-shows-correct-seed-information-webkit/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Test timeout of 30000ms exceeded.

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
      - waiting for locator('[data-testid="product-card"]').first()


      160 |     // Ir a productos y seleccionar el notebook del seed
      161 |     await page.goto('/productos');
    > 162 |     await page.locator('[data-testid="product-card"]').first().click();
          |                                                                ^
      163 |     
      164 |     // Verificar elementos de la página de producto
      165 |     await expect(page.locator('[data-testid="product-title"]')).toBeVisible();

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:162:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Product-detail-page-shows-correct-seed-information-webkit-retry1/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Product-detail-page-shows-correct-seed-information-webkit-retry1/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/checkout-E2E-Checkout-Flow-Product-detail-page-shows-correct-seed-information-webkit-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #2 ───────────────────────────────────────────────────────────────────────────────────────

    Test timeout of 30000ms exceeded.

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
      - waiting for locator('[data-testid="product-card"]').first()


      160 |     // Ir a productos y seleccionar el notebook del seed
      161 |     await page.goto('/productos');
    > 162 |     await page.locator('[data-testid="product-card"]').first().click();
          |                                                                ^
      163 |     
      164 |     // Verificar elementos de la página de producto
      165 |     await expect(page.locator('[data-testid="product-title"]')).toBeVisible();

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:162:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Product-detail-page-shows-correct-seed-information-webkit-retry2/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

  17) [webkit] › checkout.spec.ts:173:3 › E2E Checkout Flow › Cart functionality works with seed products 

    Test timeout of 30000ms exceeded.

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
      - waiting for locator('[data-testid="product-card"]').first()


      174 |     // Agregar producto del seed al carrito
      175 |     await page.goto('/productos');
    > 176 |     await page.locator('[data-testid="product-card"]').first().click();
          |                                                                ^
      177 |     await page.locator('[data-testid="add-to-cart-button"]').click();
      178 |     
      179 |     // Verificar que aparece en el carrito

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:176:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Cart-functionality-works-with-seed-products-webkit/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Test timeout of 30000ms exceeded.

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
      - waiting for locator('[data-testid="product-card"]').first()


      174 |     // Agregar producto del seed al carrito
      175 |     await page.goto('/productos');
    > 176 |     await page.locator('[data-testid="product-card"]').first().click();
          |                                                                ^
      177 |     await page.locator('[data-testid="add-to-cart-button"]').click();
      178 |     
      179 |     // Verificar que aparece en el carrito

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:176:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Cart-functionality-works-with-seed-products-webkit-retry1/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Cart-functionality-works-with-seed-products-webkit-retry1/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/checkout-E2E-Checkout-Flow-Cart-functionality-works-with-seed-products-webkit-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #2 ───────────────────────────────────────────────────────────────────────────────────────

    Test timeout of 30000ms exceeded.

    Error: locator.click: Test timeout of 30000ms exceeded.
    Call log:
      - waiting for locator('[data-testid="product-card"]').first()


      174 |     // Agregar producto del seed al carrito
      175 |     await page.goto('/productos');
    > 176 |     await page.locator('[data-testid="product-card"]').first().click();
          |                                                                ^
      177 |     await page.locator('[data-testid="add-to-cart-button"]').click();
      178 |     
      179 |     // Verificar que aparece en el carrito

        at /home/runner/work/web/web/apps/frontend/tests-e2e/checkout.spec.ts:176:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/checkout-E2E-Checkout-Flow-Cart-functionality-works-with-seed-products-webkit-retry2/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

  18) [webkit] › example.spec.ts:13:3 › Example E2E Tests › get started link ───────────────────────

    Error: Timed out 15000ms waiting for expect(locator).toHaveCount(expected)

    Locator: locator('[data-testid="product-card"]')
    Expected: 1
    Received: 0
    Call log:
      - expect.toHaveCount with timeout 15000ms
      - waiting for locator('[data-testid="product-card"]')
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"


      21 |     
      22 |     // Verificar que se renderiza al menos 1 product-card
    > 23 |     await expect(page.locator('[data-testid="product-card"]')).toHaveCount(1, { timeout: 15000 });
         |                                                                ^
      24 |   });
      25 | });
      26 |

        at /home/runner/work/web/web/apps/frontend/tests-e2e/example.spec.ts:23:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/example-Example-E2E-Tests-get-started-link-webkit/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: Timed out 15000ms waiting for expect(locator).toHaveCount(expected)

    Locator: locator('[data-testid="product-card"]')
    Expected: 1
    Received: 0
    Call log:
      - expect.toHaveCount with timeout 15000ms
      - waiting for locator('[data-testid="product-card"]')
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"


      21 |     
      22 |     // Verificar que se renderiza al menos 1 product-card
    > 23 |     await expect(page.locator('[data-testid="product-card"]')).toHaveCount(1, { timeout: 15000 });
         |                                                                ^
      24 |   });
      25 | });
      26 |

        at /home/runner/work/web/web/apps/frontend/tests-e2e/example.spec.ts:23:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/example-Example-E2E-Tests-get-started-link-webkit-retry1/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/example-Example-E2E-Tests-get-started-link-webkit-retry1/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/example-Example-E2E-Tests-get-started-link-webkit-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #2 ───────────────────────────────────────────────────────────────────────────────────────

    Error: Timed out 15000ms waiting for expect(locator).toHaveCount(expected)

    Locator: locator('[data-testid="product-card"]')
    Expected: 1
    Received: 0
    Call log:
      - expect.toHaveCount with timeout 15000ms
      - waiting for locator('[data-testid="product-card"]')
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"
      -   locator resolved to 0 elements
      -   unexpected value "0"


      21 |     
      22 |     // Verificar que se renderiza al menos 1 product-card
    > 23 |     await expect(page.locator('[data-testid="product-card"]')).toHaveCount(1, { timeout: 15000 });
         |                                                                ^
      24 |   });
      25 | });
      26 |

        at /home/runner/work/web/web/apps/frontend/tests-e2e/example.spec.ts:23:64

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/example-Example-E2E-Tests-get-started-link-webkit-retry2/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

  18 failed
    [chromium] › basic.spec.ts:16:3 › Basic E2E Tests › should navigate to products page ───────────
    [chromium] › checkout.spec.ts:8:3 › E2E Checkout Flow › Complete checkout flow from catalog to order confirmation 
    [chromium] › checkout.spec.ts:144:3 › E2E Checkout Flow › Product catalog loads with seed data ─
    [chromium] › checkout.spec.ts:159:3 › E2E Checkout Flow › Product detail page shows correct seed information 
    [chromium] › checkout.spec.ts:173:3 › E2E Checkout Flow › Cart functionality works with seed products 
    [chromium] › example.spec.ts:13:3 › Example E2E Tests › get started link ───────────────────────
    [firefox] › basic.spec.ts:16:3 › Basic E2E Tests › should navigate to products page ────────────
    [firefox] › checkout.spec.ts:8:3 › E2E Checkout Flow › Complete checkout flow from catalog to order confirmation 
    [firefox] › checkout.spec.ts:144:3 › E2E Checkout Flow › Product catalog loads with seed data ──
    [firefox] › checkout.spec.ts:159:3 › E2E Checkout Flow › Product detail page shows correct seed information 
    [firefox] › checkout.spec.ts:173:3 › E2E Checkout Flow › Cart functionality works with seed products 
    [firefox] › example.spec.ts:13:3 › Example E2E Tests › get started link ────────────────────────
    [webkit] › basic.spec.ts:16:3 › Basic E2E Tests › should navigate to products page ─────────────
    [webkit] › checkout.spec.ts:8:3 › E2E Checkout Flow › Complete checkout flow from catalog to order confirmation 
    [webkit] › checkout.spec.ts:144:3 › E2E Checkout Flow › Product catalog loads with seed data ───
    [webkit] › checkout.spec.ts:159:3 › E2E Checkout Flow › Product detail page shows correct seed information 
    [webkit] › checkout.spec.ts:173:3 › E2E Checkout Flow › Cart functionality works with seed products 
    [webkit] › example.spec.ts:13:3 › Example E2E Tests › get started link ─────────────────────────
  9 passed (22.3m)
/home/runner/work/web/web/apps/frontend:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  @ecommerce/frontend@1.0.0 test:e2e: `playwright test`
Exit status 1
Error: Process completed with exit code 1.