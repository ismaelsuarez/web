import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { MercadoPagoService } from './mercadopago.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ThrottlePaymentsGuard } from '../common/guards/throttle-payments.guard';
import { CreatePaymentDtoSwagger, ConfirmCheckoutDtoSwagger } from '../dto/checkout.dto';
import { AuthenticatedRequest, CreatePaymentDto, ConfirmCheckoutDto, MercadoPagoWebhookData } from '../types';

@ApiTags('payments')
@Controller('api')
export class PaymentsController {
  constructor(private readonly mercadopagoService: MercadoPagoService) {}

  @Post('checkout/create-payment')
  @UseGuards(JwtAuthGuard, ThrottlePaymentsGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create MercadoPago payment preference' })
  @ApiBody({ type: CreatePaymentDtoSwagger })
  @ApiResponse({ status: 201, description: 'Payment preference created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async createPayment(@Request() req: AuthenticatedRequest, @Body() body: CreatePaymentDto) {
    try {
      const { cartItems, shippingAddress } = body;
      
      if (!cartItems || cartItems.length === 0) {
        throw new HttpException('El carrito está vacío', HttpStatus.BAD_REQUEST);
      }

      if (!shippingAddress) {
        throw new HttpException('Dirección de envío requerida', HttpStatus.BAD_REQUEST);
      }

      const result = await this.mercadopagoService.createPayment(
        req.user.id,
        cartItems,
        shippingAddress,
      );

      return {
        success: true,
        data: result,
        message: 'Preferencia de pago creada exitosamente',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      // eslint-disable-next-line no-console
      console.error('Error creating payment:', error);
      throw new HttpException(
        'Error al crear el pago',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('payments/mercadopago/webhook')
  @ApiOperation({ summary: 'MercadoPago webhook handler' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  async handleWebhook(@Body() body: MercadoPagoWebhookData, @Request() req: AuthenticatedRequest) {
    try {
      // Get signature from headers if available
      const signature = (req.headers['x-signature'] as string) || (req.headers['x-mercadopago-signature'] as string) || '';
      
      const result = await this.mercadopagoService.handleWebhook(body, signature);
      
      return result;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error handling webhook:', error);
      // Return 200 to MercadoPago even on error to prevent retries
      return { success: false, error: 'Webhook processing failed' };
    }
  }

  @Post('checkout/confirm')
  @UseGuards(JwtAuthGuard, ThrottlePaymentsGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirm checkout and process payment' })
  @ApiBody({ type: ConfirmCheckoutDtoSwagger })
  @ApiResponse({ status: 200, description: 'Checkout confirmed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request or payment not approved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async confirmCheckout(@Request() _req: AuthenticatedRequest, @Body() body: ConfirmCheckoutDto) {
    try {
      const { orderId, paymentMethod } = body;
      
      if (!orderId) {
        throw new HttpException('ID de orden requerido', HttpStatus.BAD_REQUEST);
      }

      if (!paymentMethod) {
        throw new HttpException('Método de pago requerido', HttpStatus.BAD_REQUEST);
      }

      const result = await this.mercadopagoService.confirmCheckout(orderId, paymentMethod);
      
      return {
        success: true,
        data: result,
        message: 'Checkout confirmado exitosamente',
      };
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

  @Post('payments/:paymentId/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment status from MercadoPago' })
  @ApiResponse({ status: 200, description: 'Payment status retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async getPaymentStatus(@Param('paymentId') paymentId: string) {
    try {
      const result = await this.mercadopagoService.getPaymentStatus(paymentId);
      
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      // eslint-disable-next-line no-console
      console.error('Error getting payment status:', error);
      throw new HttpException(
        'Error al obtener estado del pago',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
