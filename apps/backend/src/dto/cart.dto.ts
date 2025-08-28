import { z } from 'zod';

export const AddToCartSchema = z.object({
  variantId: z.coerce.number().positive(),
  quantity: z.coerce.number().min(1).max(100),
});

export const UpdateCartItemSchema = z.object({
  quantity: z.coerce.number().min(1).max(100),
});

export const CartItemParamsSchema = z.object({
  id: z.coerce.number().positive(),
});

export type AddToCartDto = z.infer<typeof AddToCartSchema>;
export type UpdateCartItemDto = z.infer<typeof UpdateCartItemSchema>;
export type CartItemParams = z.infer<typeof CartItemParamsSchema>;
