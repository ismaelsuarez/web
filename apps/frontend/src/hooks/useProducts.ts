import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../lib/api';

export const useProducts = (params?: {
  q?: string;
  category?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProduct = (slugOrId: string | number) => {
  return useQuery({
    queryKey: ['product', slugOrId],
    queryFn: () => productsApi.getProduct(slugOrId),
    enabled: !!slugOrId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
