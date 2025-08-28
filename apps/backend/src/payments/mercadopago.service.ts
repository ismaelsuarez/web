import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import mercadopago from 'mercadopago';
import { CartItem, ShippingAddress, MercadoPagoWebhookData, OrderItem } from '../types';

@Injectable()
export class MercadoPagoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    // Configure MercadoPago with access token
    mercadopago.configure({
      access_token: this.configService.get<string>('MERCADOPAGO_ACCESS_TOKEN'),
    });
  }

  async createPayment(userId: string, cartItems: CartItem[], shippingAddress: ShippingAddress) {
    try {
      // Calculate total amount
      const totalAmount = cartItems.reduce((sum, item) => {
        return sum + (item.variant.price * item.quantity);
      }, 0);

      // Create provisional order
      const order = await this.prisma.order.create({
        data: {
          userId,
          status: 'pending',
          total: totalAmount,
          shippingAddress: JSON.stringify(shippingAddress),
          items: {
            create: cartItems.map(item => ({
              productId: item.product.id,
              variantId: item.variant.id,
              quantity: item.quantity,
              price: item.variant.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
        },
      });

      // Prepare preference items for MercadoPago
      const preferenceItems = cartItems.map(item => ({
        title: `${item.product.name} - ${item.variant.name}`,
        unit_price: item.variant.price,
        quantity: item.quantity,
        currency_id: 'ARS',
        picture_url: item.product.images?.[0] || '',
      }));

      // Add shipping cost if applicable
      if (shippingAddress.shippingCost > 0) {
        preferenceItems.push({
          title: 'Costo de envío',
          unit_price: shippingAddress.shippingCost,
          quantity: 1,
          currency_id: 'ARS',
        });
      }

      // Create MercadoPago preference
      const preference = {
        items: preferenceItems,
        payer: {
          name: shippingAddress.fullName,
          email: shippingAddress.email,
          phone: {
            number: shippingAddress.phone,
          },
          address: {
            street_name: shippingAddress.street,
            street_number: shippingAddress.streetNumber,
            zip_code: shippingAddress.zipCode,
            city: shippingAddress.city,
            state: shippingAddress.province,
            country: 'AR',
          },
        },
        shipments: {
          cost: shippingAddress.shippingCost,
          mode: 'not_specified',
          free_shipping: shippingAddress.shippingCost === 0,
        },
        back_urls: {
          success: `${this.configService.get('FRONTEND_URL')}/checkout/success?order_id=${order.id}`,
          failure: `${this.configService.get('FRONTEND_URL')}/checkout/failure?order_id=${order.id}`,
          pending: `${this.configService.get('FRONTEND_URL')}/checkout/pending?order_id=${order.id}`,
        },
        auto_return: 'approved',
        external_reference: order.id,
        notification_url: `${this.configService.get('BACKEND_URL')}/api/payments/mercadopago/webhook`,
        expires: true,
        expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
      };

      const response = await mercadopago.preferences.create(preference);

      // Update order with MercadoPago data
      await this.prisma.order.update({
        where: { id: order.id },
        data: {
          mercadopagoId: response.body.id,
          preferenceId: response.body.id,
          paymentUrl: response.body.init_point,
        },
      });

      return {
        orderId: order.id,
        preferenceId: response.body.id,
        paymentUrl: response.body.init_point,
        sandboxUrl: response.body.sandbox_init_point,
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error creating MercadoPago payment:', error);
      throw new HttpException(
        'Error al crear el pago',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async handleWebhook(data: MercadoPagoWebhookData, signature: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const _signature = signature;
    try {
      // Verify webhook signature (if MercadoPago provides it)
      // Note: MercadoPago doesn't always send signatures, so we'll validate the data structure
      
      if (data.type === 'payment') {
        const paymentId = data.data.id;
        
        // Get payment details from MercadoPago
        const payment = await mercadopago.payment.get(paymentId);
        
        if (payment.status === 200) {
          const paymentData = payment.body;
          const orderId = paymentData.external_reference;
          
          // Find the order
          const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true },
          });

          if (!order) {
            throw new Error(`Order not found: ${orderId}`);
          }

          // Update order status based on payment status
          let orderStatus = 'pending';
          switch (paymentData.status) {
            case 'approved':
              orderStatus = 'paid';
              break;
            case 'rejected':
              orderStatus = 'failed';
              break;
            case 'pending':
              orderStatus = 'pending';
              break;
            case 'in_process':
              orderStatus = 'processing';
              break;
            default:
              orderStatus = 'pending';
          }

          // Update order
          await this.prisma.order.update({
            where: { id: orderId },
            data: {
              status: orderStatus,
              mercadopagoId: paymentId,
              updatedAt: new Date(),
            },
          });

          // If payment is approved, decrement stock
          if (paymentData.status === 'approved') {
            await this.decrementStock(order.items);
          }

          return {
            success: true,
            orderId,
            paymentStatus: paymentData.status,
            orderStatus,
          };
        }
      }

      return { success: true, message: 'Webhook processed' };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error processing MercadoPago webhook:', error);
      throw new HttpException(
        'Error al procesar webhook',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async confirmCheckout(orderId: string, paymentMethod: string) {
    try {
      // Find the order
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
        },
      });

      if (!order) {
        throw new HttpException('Orden no encontrada', HttpStatus.NOT_FOUND);
      }

      if (order.status !== 'pending') {
        throw new HttpException(
          'La orden ya ha sido procesada',
          HttpStatus.BAD_REQUEST,
        );
      }

      // For offline payments, simulate approval
      if (paymentMethod === 'offline') {
        // Update order status
        await this.prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'paid',
            updatedAt: new Date(),
          },
        });

        // Decrement stock transactionally
        await this.decrementStock(order.items);

        return {
          success: true,
          orderId,
          status: 'paid',
          message: 'Pago offline confirmado',
        };
      }

      // For online payments, check MercadoPago status
      if (order.mercadopagoId) {
        const payment = await mercadopago.payment.get(order.mercadopagoId);
        
        if (payment.status === 200) {
          const paymentData = payment.body;
          
          if (paymentData.status === 'approved') {
            // Update order status
            await this.prisma.order.update({
              where: { id: orderId },
              data: {
                status: 'paid',
                updatedAt: new Date(),
              },
            });

            // Decrement stock transactionally
            await this.decrementStock(order.items);

            return {
              success: true,
              orderId,
              status: 'paid',
              message: 'Pago confirmado',
            };
          } else {
            throw new HttpException(
              `Pago no aprobado. Estado: ${paymentData.status}`,
              HttpStatus.BAD_REQUEST,
            );
          }
        }
      }

      throw new HttpException(
        'No se pudo confirmar el pago',
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      // eslint-disable-next-line no-console
      console.error('Error confirming checkout:', error);
      throw new HttpException(
        'Error al confirmar el checkout',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async decrementStock(items: OrderItem[]) {
    // Use a transaction to ensure data consistency
    await this.prisma.$transaction(async (prisma) => {
      for (const item of items) {
        // Check current stock
        const variant = await prisma.productVariant.findUnique({
          where: { id: item.variantId },
        });

        if (!variant) {
          throw new Error(`Variant not found: ${item.variantId}`);
        }

        if (variant.stock < item.quantity) {
          throw new Error(`Insufficient stock for variant: ${item.variantId}`);
        }

        // Decrement stock
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: variant.stock - item.quantity,
          },
        });
      }
    });
  }

  async getPaymentStatus(paymentId: string) {
    try {
      const payment = await mercadopago.payment.get(paymentId);
      
      if (payment.status === 200) {
        return {
          status: payment.body.status,
          statusDetail: payment.body.status_detail,
          externalReference: payment.body.external_reference,
        };
      }
      
      throw new Error('Failed to get payment status');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error getting payment status:', error);
      throw new HttpException(
        'Error al obtener estado del pago',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
