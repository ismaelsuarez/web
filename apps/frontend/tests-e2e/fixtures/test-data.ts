export const TEST_DATA = {
  users: {
    testUser: {
      email: 'testuser@example.com',
      password: 'Test1234',
      name: 'Usuario Test',
    },
  },
  products: {
    notebook: {
      title: 'Notebook Gamer Pro',
      slug: 'notebook-gamer',
      searchTerm: 'notebook',
      price: 250000,
      stock: 8,
    },
    mouse: {
      title: 'Mouse Wireless Gaming',
      slug: 'mouse-wireless',
      searchTerm: 'mouse',
      price: 15000,
      stock: 25,
    },
    keyboard: {
      title: 'Teclado Mecánico RGB',
      slug: 'keyboard-mechanical',
      searchTerm: 'teclado',
      price: 45000,
      stock: 15,
    },
  },
  shipping: {
    address: {
      fullName: 'Juan Pérez',
      email: 'testuser@example.com',
      phone: '+5491112345678',
      street: 'Av. Corrientes 123',
      streetNumber: '456',
      zipCode: '1043',
      city: 'Buenos Aires',
      province: 'Buenos Aires',
    },
    weight: 2.5,
  },
  payment: {
    webhookData: {
      type: 'payment',
      data: {
        id: 'test_payment_id',
        status: 'approved',
        external_reference: 'test_order_id',
      },
    },
  },
};

export const API_ENDPOINTS = {
  products: '/api/products',
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    refresh: '/api/auth/refresh',
  },
  cart: {
    add: '/api/cart/add',
    update: '/api/cart/update',
    remove: '/api/cart/remove',
    clear: '/api/cart/clear',
  },
  checkout: {
    createPayment: '/api/checkout/create-payment',
    confirm: '/api/checkout/confirm',
  },
  payments: {
    webhook: '/api/payments/mercadopago/webhook',
  },
  shipping: {
    provinces: '/api/shipping/provinces',
    cost: '/api/shipping/cost',
  },
};

export const SELECTORS = {
  // Productos
  productCard: '[data-testid="product-card"]',
  productTitle: '[data-testid="product-title"]',
  productPrice: '[data-testid="product-price"]',
  productName: '[data-testid="product-name"]',
  productDescription: '[data-testid="product-description"]',
  productStock: '[data-testid="product-stock"]',
  addToCartButton: '[data-testid="add-to-cart-button"]',
  
  // Carrito
  cartDrawer: '[data-testid="cart-drawer"]',
  cartButton: '[data-testid="cart-button"]',
  cartItem: '[data-testid="cart-item"]',
  cartQuantityIncrease: '[data-testid="cart-quantity-increase"]',
  cartQuantityDecrease: '[data-testid="cart-quantity-decrease"]',
  cartItemQuantity: '[data-testid="cart-item-quantity"]',
  cartItemRemove: '[data-testid="cart-item-remove"]',
  checkoutButton: '[data-testid="checkout-button"]',
  
  // Búsqueda
  searchInput: '[data-testid="search-input"]',
  searchResults: '[data-testid="search-results"]',
  
  // Login
  loginEmail: '[data-testid="login-email"]',
  loginPassword: '[data-testid="login-password"]',
  loginSubmit: '[data-testid="login-submit"]',
  
  // Checkout
  shippingProvince: '[data-testid="shipping-province"]',
  shippingWeight: '[data-testid="shipping-weight"]',
  calculateShipping: '[data-testid="calculate-shipping"]',
  shippingCost: '[data-testid="shipping-cost"]',
  shippingFullName: '[data-testid="shipping-full-name"]',
  shippingEmail: '[data-testid="shipping-email"]',
  shippingPhone: '[data-testid="shipping-phone"]',
  shippingStreet: '[data-testid="shipping-street"]',
  shippingStreetNumber: '[data-testid="shipping-street-number"]',
  shippingZipCode: '[data-testid="shipping-zip-code"]',
  shippingCity: '[data-testid="shipping-city"]',
  createPaymentButton: '[data-testid="create-payment-button"]',
  
  // Orden
  orderSuccessMessage: '[data-testid="order-success-message"]',
  orderItem: '[data-testid="order-item"]',
  orderStatus: '[data-testid="order-status"]',
};
