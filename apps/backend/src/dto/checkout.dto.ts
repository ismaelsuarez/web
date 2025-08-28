import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { CartItem, ShippingAddress } from '../types';

export const CreatePaymentSchema = z.object({
  cartItems: z.array(z.object({
    product: z.object({
      id: z.string(),
      name: z.string(),
      images: z.array(z.string()).optional(),
    }),
    variant: z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
    }),
    quantity: z.number().positive(),
  })),
  shippingAddress: z.object({
    fullName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    street: z.string(),
    streetNumber: z.string(),
    zipCode: z.string(),
    city: z.string(),
    province: z.string(),
    shippingCost: z.number().min(0),
  }),
});

export const MercadoPagoWebhookSchema = z.object({
  type: z.string(),
  data: z.object({
    id: z.string(),
  }),
});

export const ConfirmCheckoutSchema = z.object({
  orderId: z.string(),
  paymentMethod: z.enum(['online', 'offline']),
});

export type CreatePaymentDto = z.infer<typeof CreatePaymentSchema>;
export type MercadoPagoWebhookDto = z.infer<typeof MercadoPagoWebhookSchema>;
export type ConfirmCheckoutDto = z.infer<typeof ConfirmCheckoutSchema>;

// Swagger DTOs
export class CreatePaymentDtoSwagger {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        product: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            images: { type: 'array', items: { type: 'string' } },
          },
        },
        variant: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            price: { type: 'number' },
          },
        },
        quantity: { type: 'number' },
      },
    },
  })
  cartItems!: CartItem[];

  @ApiProperty({
    type: 'object',
    properties: {
      fullName: { type: 'string' },
      email: { type: 'string' },
      phone: { type: 'string' },
      street: { type: 'string' },
      streetNumber: { type: 'string' },
      zipCode: { type: 'string' },
      city: { type: 'string' },
      province: { type: 'string' },
      shippingCost: { type: 'number' },
    },
  })
  shippingAddress!: ShippingAddress;
}

export class ConfirmCheckoutDtoSwagger {
  @ApiProperty({ example: 'order-id-here' })
  orderId!: string;

  @ApiProperty({ enum: ['online', 'offline'], example: 'online' })
  paymentMethod!: string;
}
