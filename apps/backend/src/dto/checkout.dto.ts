import { z } from 'zod';

export const CreatePaymentSchema = z.object({
  shippingAddress: z.object({
    firstName: z.string().min(1, 'Nombre es requerido'),
    lastName: z.string().min(1, 'Apellido es requerido'),
    address: z.string().min(1, 'Dirección es requerida'),
    city: z.string().min(1, 'Ciudad es requerida'),
    postalCode: z.string().min(1, 'Código postal es requerido'),
    phone: z.string().min(1, 'Teléfono es requerido'),
  }),
});

export const MercadoPagoWebhookSchema = z.object({
  data: z.object({
    id: z.string(),
  }),
  type: z.string(),
});

export type CreatePaymentDto = z.infer<typeof CreatePaymentSchema>;
export type MercadoPagoWebhookDto = z.infer<typeof MercadoPagoWebhookSchema>;
