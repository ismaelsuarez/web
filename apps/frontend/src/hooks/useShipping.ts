import { useQuery } from '@tanstack/react-query';
import { shippingApi } from '../lib/api';

export const useShippingCost = (province: string, weight: number) => {
  return useQuery({
    queryKey: ['shipping-cost', province, weight],
    queryFn: () => shippingApi.getShippingCost(province, weight),
    enabled: !!province && weight > 0,
  });
};

export const useProvinces = () => {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: () => shippingApi.getProvinces(),
  });
};
