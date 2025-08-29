import { test, expect } from '@playwright/test';

test.describe('Example E2E Tests', () => {
  test.describe.configure({ retries: 2 });

  test('has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Ecommerce App/);
  });

  test('get started link', async ({ page }) => {
    await page.goto('/');

    // Click the get started link.
    await page.getByRole('link', { name: 'Productos', exact: true }).click();

    // Verificar que navegamos a productos
    await expect(page).toHaveURL(/\/productos/);
    
    // Verificar que se renderiza al menos 1 product-card
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(1, { timeout: 15000 });
  });
});
