import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { MercadoPagoService } from './mercadopago.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ThrottlePaymentsGuard } from '../common/guards/throttle-payments.guard';
import { CreatePaymentSchema, MercadoPagoWebhookSchema, ConfirmCheckoutSchema } from '../dto/checkout.dto';

@ApiTags('payments')
@Controller('api')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly mercadopagoService: MercadoPagoService) {}

  @Post('checkout/confirm')
  @UseGuards(JwtAuthGuard, ThrottlePaymentsGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirm checkout and process order' })
  @ApiBody({ schema: ConfirmCheckoutSchema })
  @ApiResponse({ status: 201, description: 'Order confirmed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data or insufficient stock' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async confirmCheckout(@Request() req: any, @Body() body: any) {
    try {
      const validatedData = ConfirmCheckoutSchema.parse(body);
      const userId = req.user.id;

      const result = await this.mercadopagoService.confirmCheckout(
        userId,
        validatedData,
      );

      return {
        success: true,
        data: result,
        message: 'Orden confirmada exitosamente',
      };
    } catch (error) {
      this.logger.error('Error confirming checkout:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        error.message || 'Error al confirmar la orden',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('checkout/create-payment')
  @UseGuards(JwtAuthGuard, ThrottlePaymentsGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create payment and redirect to MercadoPago' })
  @ApiBody({ schema: CreatePaymentSchema })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data or empty cart' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async createPayment(@Request() req: any, @Body() body: any) {
    try {
      const validatedData = CreatePaymentSchema.parse(body);
      const userId = req.user.id;

      const result = await this.mercadopagoService.createPayment(
        userId,
        validatedData.shippingAddress,
      );

      return {
        success: true,
        data: result,
        message: 'Pago creado exitosamente',
      };
    } catch (error) {
      this.logger.error('Error creating payment:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        error.message || 'Error al crear el pago',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('payments/mercadopago/webhook')
  @ApiOperation({ summary: 'MercadoPago webhook handler' })
  @ApiBody({ schema: MercadoPagoWebhookSchema })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  async handleWebhook(@Body() body: any) {
    try {
      // Validar webhook data
      const validatedData = MercadoPagoWebhookSchema.parse(body);
      
      // Procesar webhook
      await this.mercadopagoService.handleWebhook(validatedData);
      
      this.logger.log('Webhook processed successfully');
      
      return {
        success: true,
        message: 'Webhook processed successfully',
      };
    } catch (error) {
      this.logger.error('Error processing webhook:', error);
      
      // Siempre retornar 200 para que MercadoPago no reenvíe el webhook
      return {
        success: false,
        message: 'Error processing webhook',
      };
    }
  }
}
