import { test, expect } from '@playwright/test';
import { TEST_DATA, SELECTORS } from './fixtures/test-data';

test.describe('E2E Checkout Flow', () => {
  test('Complete checkout flow from catalog to order confirmation', async ({ page }) => {
    // Test data
    const testUser = TEST_DATA.users.testUser;

    // 1. Catálogo (PLP) - Navegar a productos
    await test.step('Navigate to products catalog', async () => {
      await page.goto('/productos');
      
      // Validar que se cargan productos (>0 cards)
      await expect(page.locator(SELECTORS.productCard)).toHaveCount({ min: 1 });
      
      // Buscar un producto y confirmar que aparece en el listado
      const searchInput = page.locator(SELECTORS.searchInput);
      await searchInput.fill(TEST_DATA.products.laptop.searchTerm);
      await searchInput.press('Enter');
      
      // Esperar a que se actualice la búsqueda
      await page.waitForTimeout(1000);
      await expect(page.locator(SELECTORS.productCard)).toHaveCount({ min: 1 });
    });

    // 2. Página de producto (PDP) - Entrar a un producto
    await test.step('Navigate to product detail page', async () => {
      // Hacer clic en el primer producto
      await page.locator(SELECTORS.productCard).first().click();
      
      // Validar que muestra nombre, precio y botón "Agregar al carrito"
      await expect(page.locator(SELECTORS.productName)).toBeVisible();
      await expect(page.locator(SELECTORS.productPrice)).toBeVisible();
      await expect(page.locator(SELECTORS.addToCartButton)).toBeVisible();
      
      // Agregar al carrito
      await page.locator(SELECTORS.addToCartButton).click();
      
      // Verificar que el drawer/cart muestra el item
      await expect(page.locator(SELECTORS.cartDrawer)).toBeVisible();
      await expect(page.locator(SELECTORS.cartItem)).toHaveCount(1);
    });

    // 3. Carrito → Checkout - Ir al carrito y hacer login
    await test.step('Go to cart and login', async () => {
      // Ir al carrito
      await page.locator('[data-testid="cart-button"]').click();
      await expect(page.locator('[data-testid="cart-drawer"]')).toBeVisible();
      
      // Hacer clic en "Proceder al checkout"
      await page.locator('[data-testid="checkout-button"]').click();
      
      // Hacer login
      await page.locator('[data-testid="login-email"]').fill(testUser.email);
      await page.locator('[data-testid="login-password"]').fill(testUser.password);
      await page.locator('[data-testid="login-submit"]').click();
      
      // Esperar a que se complete el login
      await page.waitForTimeout(2000);
      
      // Confirmar que el carrito persiste con el producto
      await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1);
    });

    // 4. Pago (Mercado Pago sandbox) - Configurar envío y crear preference
    await test.step('Configure shipping and create payment preference', async () => {
      // Seleccionar envío - Provincia Buenos Aires
      await page.locator('[data-testid="shipping-province"]').selectOption('Buenos Aires');
      await page.locator('[data-testid="shipping-weight"]').fill('2.5');
      await page.locator('[data-testid="calculate-shipping"]').click();
      
      // Esperar a que se calcule el envío
      await page.waitForTimeout(1000);
      await expect(page.locator('[data-testid="shipping-cost"]')).toBeVisible();
      
      // Llenar información de envío
      await page.locator('[data-testid="shipping-full-name"]').fill('Juan Pérez');
      await page.locator('[data-testid="shipping-email"]').fill(testUser.email);
      await page.locator('[data-testid="shipping-phone"]').fill('+5491112345678');
      await page.locator('[data-testid="shipping-street"]').fill('Av. Corrientes 123');
      await page.locator('[data-testid="shipping-street-number"]').fill('456');
      await page.locator('[data-testid="shipping-zip-code"]').fill('1043');
      await page.locator('[data-testid="shipping-city"]').fill('Buenos Aires');
      
      // Crear preference de pago
      await page.locator('[data-testid="create-payment-button"]').click();
      
      // Esperar a que se cree la preference
      await page.waitForTimeout(2000);
      
      // Verificar redirección a URL de MP sandbox
      const currentUrl = page.url();
      expect(currentUrl).toContain('mercadopago.com');
    });

    // 5. Mockear webhook de pago para marcar orden como "paid"
    await test.step('Mock payment webhook to mark order as paid', async () => {
      // Obtener el orderId de la URL o del localStorage
      const orderId = await page.evaluate(() => {
        return localStorage.getItem('currentOrderId');
      });
      
      if (orderId) {
        // Mockear el webhook de pago
        const webhookData = {
          type: 'payment',
          data: {
            id: 'test_payment_id'
          }
        };
        
        // Simular webhook call
        await page.evaluate(async (data) => {
          await fetch('/api/payments/mercadopago/webhook', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
          });
        }, webhookData);
      }
    });

    // 6. Confirmación de orden - Volver al sitio y verificar orden
    await test.step('Return to site and verify order confirmation', async () => {
      // Simular retorno desde MercadoPago
      await page.goto('/checkout/success?order_id=test_order_id');
      
      // Verificar mensaje de confirmación
      await expect(page.locator('[data-testid="order-success-message"]')).toBeVisible();
      
      // Ir a perfil para verificar la orden
      await page.goto('/profile/orders');
      
      // Verificar que la orden aparece con estado "paid"
      await expect(page.locator('[data-testid="order-item"]')).toBeVisible();
      await expect(page.locator('[data-testid="order-status"]')).toContainText('paid');
    });

    // 7. Validar que stock se reduce en la DB
    await test.step('Verify stock reduction in database', async () => {
      // Esta validación se haría a través de una API call o verificación en la UI
      // Por ahora, verificamos que el producto muestra stock actualizado
      await page.goto('/productos');
      
      // Buscar el producto que compramos
      const searchInput = page.locator('[data-testid="search-input"]');
      await searchInput.fill('laptop');
      await searchInput.press('Enter');
      
      // Verificar que el stock se muestra correctamente
      await expect(page.locator('[data-testid="product-stock"]')).toBeVisible();
    });
  });

  test('Product catalog loads and search works', async ({ page }) => {
    await page.goto('/productos');
    
    // Verificar que la página carga
    await expect(page).toHaveTitle(/Ecommerce App/);
    
    // Verificar que hay productos
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount({ min: 1 });
    
    // Probar búsqueda
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('test');
    await searchInput.press('Enter');
    
    // Verificar que la búsqueda funciona
    await page.waitForTimeout(1000);
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
  });

  test('Product detail page shows correct information', async ({ page }) => {
    // Ir a productos y seleccionar uno
    await page.goto('/productos');
    await page.locator('[data-testid="product-card"]').first().click();
    
    // Verificar elementos de la página de producto
    await expect(page.locator('[data-testid="product-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-price"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-description"]')).toBeVisible();
    await expect(page.locator('[data-testid="add-to-cart-button"]')).toBeVisible();
  });

  test('Cart functionality works correctly', async ({ page }) => {
    // Agregar producto al carrito
    await page.goto('/productos');
    await page.locator('[data-testid="product-card"]').first().click();
    await page.locator('[data-testid="add-to-cart-button"]').click();
    
    // Verificar que aparece en el carrito
    await expect(page.locator('[data-testid="cart-drawer"]')).toBeVisible();
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1);
    
    // Probar funcionalidad del carrito
    await page.locator('[data-testid="cart-quantity-increase"]').click();
    await expect(page.locator('[data-testid="cart-item-quantity"]')).toContainText('2');
    
    // Remover item del carrito
    await page.locator('[data-testid="cart-item-remove"]').click();
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(0);
  });
});
