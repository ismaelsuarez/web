import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../lib/authInterceptor';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';

// Types
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

export interface CreatePaymentRequest {
  cartItems: any[];
  shippingAddress: ShippingAddress;
}

export interface ConfirmCheckoutRequest {
  orderId: string;
  paymentMethod: 'online' | 'offline';
}

export interface PaymentResponse {
  orderId: string;
  preferenceId: string;
  paymentUrl: string;
  sandboxUrl: string;
}

// API functions
const createPayment = async (data: CreatePaymentRequest): Promise<PaymentResponse> => {
  const response = await api.post('/api/checkout/create-payment', data);
  return response.data.data;
};

const confirmCheckout = async (data: ConfirmCheckoutRequest) => {
  const response = await api.post('/api/checkout/confirm', data);
  return response.data;
};

const getShippingCost = async (province: string, weight: number) => {
  const response = await api.get(`/api/shipping/cost?province=${province}&weight=${weight}`);
  return response.data.data;
};

const getProvinces = async () => {
  const response = await api.get('/api/shipping/provinces');
  return response.data.data;
};

// Hooks
export const useCreatePayment = () => {
  const { isAuthenticated } = useAuthStore();
  const { items, clearCart } = useCartStore();

  return useMutation({
    mutationFn: async (shippingAddress: ShippingAddress) => {
      if (!isAuthenticated) {
        throw new Error('Debes estar autenticado para realizar el pago');
      }

      if (!items || items.length === 0) {
        throw new Error('El carrito está vacío');
      }

             const cartItems = items.map((item: any) => ({
         product: {
           id: item.product.id,
           name: item.product.title,
           images: item.product.images,
         },
         variant: {
           id: item.variant.id,
           name: item.variant.sku,
           price: item.variant.price,
         },
         quantity: item.quantity,
       }));

      return createPayment({ cartItems, shippingAddress });
    },
    onSuccess: () => {
      // Clear cart after successful payment creation
      clearCart();
    },
  });
};

export const useConfirmCheckout = () => {
  return useMutation({
    mutationFn: confirmCheckout,
  });
};

export const useShippingCost = (province: string, weight: number) => {
  return useQuery({
    queryKey: ['shipping-cost', province, weight],
    queryFn: () => getShippingCost(province, weight),
    enabled: !!province && weight > 0,
  });
};

export const useProvinces = () => {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: getProvinces,
  });
};

// MercadoPago integration
export const useMercadoPago = () => {
  const redirectToPayment = async (paymentUrl: string) => {
    try {
      // Use the payment URL directly (MercadoPago handles sandbox/production)
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Error redirecting to MercadoPago:', error);
      throw new Error('Error al redirigir al pago');
    }
  };

  const processPaymentReturn = async (orderId: string, status: string) => {
    try {
      // Handle payment return from MercadoPago
      if (status === 'success') {
        // Payment was successful, confirm checkout
        const response = await confirmCheckout({
          orderId,
          paymentMethod: 'online',
        });
        return response;
      } else {
        throw new Error(`Pago ${status}`);
      }
    } catch (error) {
      console.error('Error processing payment return:', error);
      throw error;
    }
  };

  return {
    redirectToPayment,
    processPaymentReturn,
  };
};
