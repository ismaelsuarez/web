import { Page } from '@playwright/test';

export interface TestUser {
  email: string;
  password: string;
}

export const TEST_USER: TestUser = {
  email: 'testuser@example.com',
  password: 'Test1234'
};

export async function loginUser(page: Page, user: TestUser = TEST_USER) {
  await page.goto('/login');
  await page.locator('[data-testid="login-email"]').fill(user.email);
  await page.locator('[data-testid="login-password"]').fill(user.password);
  await page.locator('[data-testid="login-submit"]').click();
  await page.waitForTimeout(2000);
}

export async function addProductToCart(page: Page, productIndex: number = 0) {
  await page.goto('/productos');
  await page.locator('[data-testid="product-card"]').nth(productIndex).click();
  await page.locator('[data-testid="add-to-cart-button"]').click();
  await expect(page.locator('[data-testid="cart-drawer"]')).toBeVisible();
}

export async function mockPaymentWebhook(page: Page, orderId: string) {
  const webhookData = {
    type: 'payment',
    data: {
      id: 'test_payment_id',
      status: 'approved',
      external_reference: orderId
    }
  };

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

export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
}

export async function fillShippingInfo(page: Page, user: TestUser = TEST_USER) {
  await page.locator('[data-testid="shipping-province"]').selectOption('Buenos Aires');
  await page.locator('[data-testid="shipping-weight"]').fill('2.5');
  await page.locator('[data-testid="calculate-shipping"]').click();
  await page.waitForTimeout(1000);
  
  await page.locator('[data-testid="shipping-full-name"]').fill('Juan Pérez');
  await page.locator('[data-testid="shipping-email"]').fill(user.email);
  await page.locator('[data-testid="shipping-phone"]').fill('+5491112345678');
  await page.locator('[data-testid="shipping-street"]').fill('Av. Corrientes 123');
  await page.locator('[data-testid="shipping-street-number"]').fill('456');
  await page.locator('[data-testid="shipping-zip-code"]').fill('1043');
  await page.locator('[data-testid="shipping-city"]').fill('Buenos Aires');
}
