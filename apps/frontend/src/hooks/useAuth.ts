import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';
import type { RegisterRequest, LoginRequest } from '../types/api';

export const useRegister = () => {
  const queryClient = useQueryClient();
  const { login, setLoading } = useAuthStore();
  // const { syncWithBackend } = useCartStore();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      login(data.user, data.accessToken, data.refreshToken);
      // Sincronizar carrito después del registro
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Error en registro:', error);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { login, setLoading } = useAuthStore();
  // const { syncWithBackend } = useCartStore();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      login(data.user, data.accessToken, data.refreshToken);
      // Sincronizar carrito después del login
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Error en login:', error);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();
  const { clearCart } = useCartStore();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logout();
      clearCart();
      queryClient.clear();
    },
    onError: (error) => {
      console.error('Error en logout:', error);
      // Aún así limpiar el estado local
      logout();
      clearCart();
      queryClient.clear();
    },
  });
};
