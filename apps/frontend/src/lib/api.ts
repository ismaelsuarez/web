import axios from 'axios';
import type { ProductsResponse, Product } from '../types/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export default api;
