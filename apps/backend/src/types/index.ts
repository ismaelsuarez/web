import { Request } from 'express';

// Request types
export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  headers: {
    [key: string]: string | string[] | undefined;
  };
}

export interface JwtPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

// Cart types
export interface CartItem {
  product: {
    id: string;
    name: string;
    images?: string[];
  };
  variant: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

export interface AddToCartDto {
  variantId: number;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export interface CartItemParams {
  id: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  streetNumber: string;
  zipCode: string;
  city: string;
  province: string;
  shippingCost: number;
}

// MercadoPago types
export interface MercadoPagoWebhookData {
  type: string;
  data: {
    id: string;
  };
}

export interface CreatePaymentDto {
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
}

export interface ConfirmCheckoutDto {
  orderId: string;
  paymentMethod: 'online' | 'offline';
}

export interface GetProductsQuery {
  q?: string;
  category?: string;
  page: number;
  limit: number;
}

export interface GetProductParams {
  id: number;
}

export interface MercadoPagoPaymentData {
  id: string;
  status: string;
  status_detail: string;
  external_reference: string;
  transaction_amount: number;
  payment_method: {
    type: string;
    id: string;
  };
  payer: {
    email: string;
    identification: {
      type: string;
      number: string;
    };
  };
}

export interface MercadoPagoPreferenceItem {
  title: string;
  unit_price: number;
  quantity: number;
  currency_id: string;
  picture_url?: string;
}

export interface MercadoPagoPreference {
  items: MercadoPagoPreferenceItem[];
  payer: {
    name: string;
    email: string;
    phone: {
      number: string;
    };
    address: {
      street_name: string;
      street_number: string;
      zip_code: string;
      city: string;
      state: string;
      country: string;
    };
  };
  shipments: {
    cost: number;
    mode: string;
    free_shipping: boolean;
  };
  back_urls: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return: string;
  external_reference: string;
  notification_url: string;
  expires: boolean;
  expiration_date_to: string;
}

// Order types
export interface OrderItem {
  id: number;
  orderId: number;
  variantId: number;
  priceAtPurchase: number;
  quantity: number;
  variant: {
    id: number;
    sku: string;
    price: number;
    stock: number;
    images: string[];
    specs: Record<string, unknown>;
  };
}

// Express Request types
export interface ExpressRequest extends Request {
  ips: string[];
  ip: string;
}

// Throttler types
export interface ThrottlerRequest extends ExpressRequest {
  user?: {
    id: string;
  };
}
