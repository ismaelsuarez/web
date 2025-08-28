import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { MercadoPagoService } from './mercadopago.service';

@Module({
  controllers: [PaymentsController],
  providers: [MercadoPagoService],
  exports: [MercadoPagoService],
})
export class PaymentsModule {}
