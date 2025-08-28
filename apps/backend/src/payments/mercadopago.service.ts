import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mercadopago from 'mercadopago';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { ConfirmCheckoutDto } from '../dto/checkout.dto';

@Injectable()
export class MercadoPagoService {
  private readonly logger = new Logger(MercadoPagoService.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private cartService: CartService,
  ) {
    // Configurar MercadoPago
    mercadopago.configure({
      access_token: this.configService.get<string>('MERCADOPAGO_ACCESS_TOKEN'),
    });
  }

  async createPayment(userId: number, shippingAddress: any) {
    try {
      // Obtener carrito del usuario
      const cart = await this.cartService.getCart(userId);
      
      if (!cart.items || cart.items.length === 0) {
        throw new Error('El carrito está vacío');
      }

      // Crear orden en la base de datos
      const order = await this.prisma.order.create({
        data: {
          userId,
          total: cart.total,
          status: 'pending',
          shippingAddress,
          items: {
            create: cart.items.map(item => ({
              variantId: item.variant.id,
              priceAtPurchase: item.variant.price,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      });

      // Crear preferencia en MercadoPago
      const preference = {
        items: cart.items.map(item => ({
          id: item.variant.id.toString(),
          title: item.product.title,
          description: `${item.product.title} - ${Object.entries(item.variant.specs)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ')}`,
          quantity: item.quantity,
          unit_price: item.variant.price,
          currency_id: 'ARS',
        })),
        external_reference: order.id.toString(),
        back_urls: {
          success: `${this.configService.get<string>('FRONTEND_URL')}/payment/success`,
          failure: `${this.configService.get<string>('FRONTEND_URL')}/payment/failure`,
          pending: `${this.configService.get<string>('FRONTEND_URL')}/payment/pending`,
        },
        auto_return: 'approved',
        notification_url: `${this.configService.get<string>('BACKEND_URL')}/api/payments/mercadopago/webhook`,
        expires: true,
        expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutos
      };

      const response = await mercadopago.preferences.create(preference);

      // Actualizar orden con información de MercadoPago
      await this.prisma.order.update({
        where: { id: order.id },
        data: {
          preferenceId: response.body.id,
          paymentUrl: response.body.init_point,
        },
      });

      // Limpiar carrito después de crear la orden
      await this.cartService.clearCart(userId);

      return {
        orderId: order.id,
        preferenceId: response.body.id,
        paymentUrl: response.body.init_point,
        sandboxUrl: response.body.sandbox_init_point,
      };
    } catch (error) {
      this.logger.error('Error creating payment:', error);
      throw error;
    }
  }

  async handleWebhook(data: any) {
    try {
      const { data: webhookData, type } = data;

      if (type === 'payment') {
        const paymentId = webhookData.id;
        
        // Obtener información del pago desde MercadoPago
        const payment = await mercadopago.payment.findById(paymentId);
        const paymentData = payment.body;

        // Buscar orden por external_reference
        const orderId = parseInt(paymentData.external_reference);
        const order = await this.prisma.order.findUnique({
          where: { id: orderId },
        });

        if (!order) {
          this.logger.error(`Order not found for payment ${paymentId}`);
          return;
        }

        // Actualizar estado de la orden según el estado del pago
        let orderStatus = 'pending';
        
        switch (paymentData.status) {
          case 'approved':
            orderStatus = 'paid';
            break;
          case 'rejected':
          case 'cancelled':
            orderStatus = 'failed';
            break;
          case 'pending':
            orderStatus = 'pending';
            break;
          default:
            orderStatus = 'pending';
        }

        // Actualizar orden
        await this.prisma.order.update({
          where: { id: orderId },
          data: {
            status: orderStatus,
            mercadopagoId: paymentId,
          },
        });

        this.logger.log(`Order ${orderId} updated to status: ${orderStatus}`);
      }
    } catch (error) {
      this.logger.error('Error handling webhook:', error);
      throw error;
    }
  }

  async getPaymentStatus(paymentId: string) {
    try {
      const payment = await mercadopago.payment.findById(paymentId);
      return payment.body;
    } catch (error) {
      this.logger.error('Error getting payment status:', error);
      throw error;
    }
  }

  async confirmCheckout(userId: number, checkoutData: ConfirmCheckoutDto) {
    try {
      // Verificar que la orden existe y pertenece al usuario
      const order = await this.prisma.order.findFirst({
        where: {
          id: checkoutData.orderId,
          userId: userId,
        },
        include: {
          items: {
            include: {
              variant: true,
            },
          },
        },
      });

      if (!order) {
        throw new Error('Orden no encontrada o no autorizada');
      }

      // Verificar stock disponible para todos los items
      for (const item of order.items) {
        const variant = await this.prisma.productVariant.findUnique({
          where: { id: item.variantId },
        });

        if (!variant) {
          throw new Error(`Variante ${item.variantId} no encontrada`);
        }

        if (variant.stock < item.quantity) {
          throw new Error(`Stock insuficiente para ${variant.sku}. Disponible: ${variant.stock}, Solicitado: ${item.quantity}`);
        }
      }

      // Procesar en transacción para asegurar consistencia
      const result = await this.prisma.$transaction(async (prisma) => {
        // Decrementar stock de todas las variantes
        for (const item of order.items) {
          await prisma.productVariant.update({
            where: { id: item.variantId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }

        // Actualizar orden con información de envío y método de pago
        const updatedOrder = await prisma.order.update({
          where: { id: order.id },
          data: {
            status: checkoutData.paymentMethod === 'offline' ? 'pending' : 'paid',
            shippingAddress: checkoutData.shippingAddress,
            total: order.total + checkoutData.shippingCost,
          },
          include: {
            items: {
              include: {
                variant: {
                  include: {
                    product: true,
                  },
                },
              },
            },
          },
        });

        // Limpiar carrito del usuario
        await this.cartService.clearCart(userId);

        return updatedOrder;
      });

      this.logger.log(`Order ${order.id} confirmed successfully`);

      return {
        orderId: result.id,
        status: result.status,
        total: result.total,
        items: result.items,
        shippingAddress: result.shippingAddress,
        message: 'Orden confirmada y stock actualizado exitosamente',
      };
    } catch (error) {
      this.logger.error('Error confirming checkout:', error);
      throw error;
    }
  }
}
