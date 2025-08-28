import api from './authInterceptor';
import type { ProductsResponse, Product, Cart, AddToCartRequest, UpdateCartItemRequest, RegisterRequest, LoginRequest, RefreshTokenRequest, AuthResponse } from '../types/api';

// API_URL ya está configurado en authInterceptor

export const productsApi = {
  getProducts: async (params?: {
    q?: string;
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<ProductsResponse> => {
    const response = await api.get('/api/products', { params });
    return response.data;
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },
};

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const response = await api.get('/api/cart');
    return response.data;
  },

  addToCart: async (data: AddToCartRequest): Promise<Cart> => {
    const response = await api.post('/api/cart', data);
    return response.data;
  },

  updateCartItem: async (itemId: number, data: UpdateCartItemRequest): Promise<Cart> => {
    const response = await api.put(`/api/cart/item/${itemId}`, data);
    return response.data;
  },

  removeCartItem: async (itemId: number): Promise<Cart> => {
    const response = await api.delete(`/api/cart/item/${itemId}`);
    return response.data;
  },

  clearCart: async (): Promise<Cart> => {
    const response = await api.delete('/api/cart');
    return response.data;
  },
};

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login', data);
    return response.data;
  },

  refreshToken: async (data: RefreshTokenRequest): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/refresh', data);
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },

  getProfile: async (): Promise<{ user: any }> => {
    const response = await api.post('/api/auth/me');
    return response.data;
  },
};

export default api;
