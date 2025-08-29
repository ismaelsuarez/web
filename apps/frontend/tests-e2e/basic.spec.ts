import { test, expect } from '@playwright/test';

test.describe('Basic E2E Tests', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    
    // Verificar título
    await expect(page).toHaveTitle(/Ecommerce App/);
    
    // Verificar que la página carga
    await expect(page).toBeVisible();
  });

  test('should navigate to products page', async ({ page }) => {
    await page.goto('/');
    
    // Hacer clic en el link de productos (usar selector específico)
    await page.getByRole('link', { name: 'Productos', exact: true }).click();
    
    // Verificar que navegamos a productos
    await expect(page).toHaveURL(/.*productos/);
    
    // Verificar que la página carga
    await expect(page).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    
    // Verificar que los links de navegación están presentes
    await expect(page.getByRole('link', { name: 'Productos' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Inicio' })).toBeVisible();
  });
});
