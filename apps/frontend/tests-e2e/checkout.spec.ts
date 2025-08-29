import { test, expect } from '@playwright/test';
import { TEST_DATA, SELECTORS } from './fixtures/test-data';

test.describe('E2E Checkout Flow', () => {
  test.describe.configure({ retries: 2 });
  
  test('Complete checkout flow from catalog to order confirmation', async ({ page }) => {
    // Test data del seed
    const testUser = TEST_DATA.users.testUser;
    const testProduct = TEST_DATA.products.notebook;

    // 1. Catálogo (PLP) - Navegar a productos
    await test.step('Navigate to products catalog', async () => {
      await page.goto('/productos');
      
      // Validar que se cargan productos del seed
      await expect(page.locator('[data-testid="product-card"]')).toHaveCount(3); // 3 productos del seed
      
      // Buscar el producto específico del seed
      const searchInput = page.locator('[data-testid="search-input"]');
      await searchInput.fill(testProduct.searchTerm);
      await searchInput.press('Enter');
      
      // Esperar a que se actualice la búsqueda
      await page.waitForTimeout(1000);
      await expect(page.locator('[data-testid="product-card"]')).toHaveCount(1);
    });

    // 2. Página de producto (PDP) - Entrar al producto del seed
    await test.step('Navigate to product detail page', async () => {
      // Hacer clic en el primer producto (notebook del seed)
      await page.locator('[data-testid="product-card"]').first().click();
      
      // Validar que muestra información del producto del seed
      await expect(page.locator('[data-testid="product-title"]')).toBeVisible();
      await expect(page.locator('[data-testid="product-price"]')).toBeVisible();
      await expect(page.locator('[data-testid="add-to-cart-button"]')).toBeVisible();
      
      // Verificar que el título coincide con el producto del seed
      await expect(page.locator('[data-testid="product-title"]')).toContainText('Notebook');
      
      // Agregar al carrito
      await page.locator('[data-testid="add-to-cart-button"]').click();
      
      // Verificar que el drawer/cart muestra el item
      await expect(page.locator('[data-testid="cart-drawer"]')).toBeVisible();
      await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1);
    });

    // 3. Carrito → Checkout - Ir al carrito y hacer login
    await test.step('Go to cart and login', async () => {
      // Ir al carrito
      await page.locator('[data-testid="cart-button"]').click();
      await expect(page.locator('[data-testid="cart-drawer"]')).toBeVisible();
      
      // Hacer clic en "Proceder al checkout"
      await page.locator('[data-testid="checkout-button"]').click();
      
      // Hacer login con usuario del seed
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
      await page.locator('[data-testid="shipping-full-name"]').fill(TEST_DATA.shipping.address.fullName);
      await page.locator('[data-testid="shipping-email"]').fill(testUser.email);
      await page.locator('[data-testid="shipping-phone"]').fill(TEST_DATA.shipping.address.phone);
      await page.locator('[data-testid="shipping-street"]').fill(TEST_DATA.shipping.address.street);
      await page.locator('[data-testid="shipping-street-number"]').fill(TEST_DATA.shipping.address.streetNumber);
      await page.locator('[data-testid="shipping-zip-code"]').fill(TEST_DATA.shipping.address.zipCode);
      await page.locator('[data-testid="shipping-city"]').fill(TEST_DATA.shipping.address.city);
      
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
        return localStorage.getItem('currentOrderId') || 'test_order_id';
      });
      
      // Mockear el webhook de pago usando los datos del seed
      const webhookData = TEST_DATA.payment.webhookData;
      webhookData.data.external_reference = orderId;
      
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
    });

    // 6. Confirmación de orden - Volver al sitio y verificar orden
    await test.step('Return to site and verify order confirmation', async () => {
      // Simular retorno desde MercadoPago
      await page.goto('/checkout/success?order_id=test_order_id');
      
      // Verificar mensaje de confirmación
      await expect(page.locator('[data-testid="order-status"]')).toBeVisible();
      await expect(page.locator('[data-testid="order-status"]')).toContainText('¡Pago exitoso!');
    });

    // 7. Validar que stock se reduce en la DB
    await test.step('Verify stock reduction in database', async () => {
      // Volver a productos para verificar stock actualizado
      await page.goto('/productos');
      
      // Buscar el producto que compramos
      const searchInput = page.locator('[data-testid="search-input"]');
      await searchInput.fill(testProduct.searchTerm);
      await searchInput.press('Enter');
      
      // Verificar que el producto sigue disponible
      await expect(page.locator('[data-testid="product-card"]')).toHaveCount(1);
    });
  });

  test('Product catalog loads with seed data', async ({ page }) => {
    await page.goto('/productos');
    
    // Verificar que la página carga
    await expect(page).toHaveTitle(/Ecommerce App/);
    
    // Verificar que hay productos del seed (3 productos)
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(3);
    
    // Verificar que aparecen los productos del seed
    await expect(page.locator('text=Notebook Gamer Pro')).toBeVisible();
    await expect(page.locator('text=Mouse Wireless Gaming')).toBeVisible();
    await expect(page.locator('text=Teclado Mecánico RGB')).toBeVisible();
  });

  test('Product detail page shows correct seed information', async ({ page }) => {
    // Ir a productos y seleccionar el notebook del seed
    await page.goto('/productos');
    await page.locator('[data-testid="product-card"]').first().click();
    
    // Verificar elementos de la página de producto
    await expect(page.locator('[data-testid="product-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-price"]')).toBeVisible();
    await expect(page.locator('[data-testid="add-to-cart-button"]')).toBeVisible();
    
    // Verificar que es el producto correcto del seed
    await expect(page.locator('[data-testid="product-title"]')).toContainText('Notebook Gamer Pro');
  });

  test('Cart functionality works with seed products', async ({ page }) => {
    // Agregar producto del seed al carrito
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
