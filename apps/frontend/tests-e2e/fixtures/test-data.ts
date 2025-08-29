export const TEST_DATA = {
  users: {
    testUser: {
      email: 'testuser@example.com',
      password: 'Test1234',
      name: 'Test User'
    }
  },
  products: {
    laptop: {
      name: 'Laptop Gaming',
      searchTerm: 'laptop',
      category: 'Electronics'
    },
    phone: {
      name: 'Smartphone',
      searchTerm: 'phone',
      category: 'Electronics'
    }
  },
  shipping: {
    buenosAires: {
      province: 'Buenos Aires',
      weight: '2.5',
      expectedCost: 800
    },
    cordoba: {
      province: 'Córdoba',
      weight: '1.0',
      expectedCost: 800
    }
  },
  addresses: {
    buenosAires: {
      fullName: 'Juan Pérez',
      email: 'testuser@example.com',
      phone: '+5491112345678',
      street: 'Av. Corrientes 123',
      streetNumber: '456',
      zipCode: '1043',
      city: 'Buenos Aires',
      province: 'Buenos Aires'
    }
  }
};

export const API_ENDPOINTS = {
  health: '/health',
  products: '/api/products',
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register'
  },
  cart: {
    get: '/api/cart',
    add: '/api/cart/add',
    update: '/api/cart/update',
    remove: '/api/cart/remove'
  },
  checkout: {
    createPayment: '/api/checkout/create-payment',
    confirm: '/api/checkout/confirm'
  },
  payments: {
    webhook: '/api/payments/mercadopago/webhook'
  }
};

export const SELECTORS = {
  // Product catalog
  productCard: '[data-testid="product-card"]',
  searchInput: '[data-testid="search-input"]',
  searchResults: '[data-testid="search-results"]',
  
  // Product detail
  productName: '[data-testid="product-name"]',
  productPrice: '[data-testid="product-price"]',
  productDescription: '[data-testid="product-description"]',
  productStock: '[data-testid="product-stock"]',
  addToCartButton: '[data-testid="add-to-cart-button"]',
  
  // Cart
  cartButton: '[data-testid="cart-button"]',
  cartDrawer: '[data-testid="cart-drawer"]',
  cartItem: '[data-testid="cart-item"]',
  cartItemQuantity: '[data-testid="cart-item-quantity"]',
  cartQuantityIncrease: '[data-testid="cart-quantity-increase"]',
  cartItemRemove: '[data-testid="cart-item-remove"]',
  checkoutButton: '[data-testid="checkout-button"]',
  
  // Auth
  loginEmail: '[data-testid="login-email"]',
  loginPassword: '[data-testid="login-password"]',
  loginSubmit: '[data-testid="login-submit"]',
  
  // Shipping
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
  
  // Order
  orderSuccessMessage: '[data-testid="order-success-message"]',
  orderItem: '[data-testid="order-item"]',
  orderStatus: '[data-testid="order-status"]'
};
