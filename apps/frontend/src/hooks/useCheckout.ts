import { useMutation, useQueryClient } from '@tanstack/react-query';
import { checkoutApi } from '../lib/api';
import { useCartStore } from '../stores/cartStore';
import type { ConfirmCheckoutRequest } from '../types/api';

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shippingAddress: any) => checkoutApi.createPayment(shippingAddress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useConfirmCheckout = () => {
  const queryClient = useQueryClient();
  const clearCart = useCartStore((state) => state.clearCart);

  return useMutation({
    mutationFn: (data: ConfirmCheckoutRequest) => checkoutApi.confirmCheckout(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      clearCart();
    },
  });
};
