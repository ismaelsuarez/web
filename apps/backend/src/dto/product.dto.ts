import { z } from 'zod';

export const GetProductsQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const GetProductParamsSchema = z.object({
  id: z.coerce.number().positive(),
});

export type GetProductsQuery = z.infer<typeof GetProductsQuerySchema>;
export type GetProductParams = z.infer<typeof GetProductParamsSchema>;
