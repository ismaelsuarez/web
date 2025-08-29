import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { PaymentsModule } from './payments/payments.module';
import { ShippingModule } from './shipping/shipping.module';
import { securityConfig } from './config/security.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // 🔒 SECURITY: Rate Limiting configuration
    ThrottlerModule.forRoot([
      {
        ttl: securityConfig.rateLimit.ttl,
        limit: securityConfig.rateLimit.limit,
      },
    ]),
    // 📝 LOGGING: Structured logging with Pino
    LoggerModule.forRoot({
      pinoHttp: {
        level: securityConfig.logging.level,
        transport: process.env.NODE_ENV === 'production' 
          ? undefined // En producción, usar formato JSON estándar
          : {
              target: 'pino-pretty',
              options: {
                colorize: true,
                levelFirst: true,
                translateTime: 'yyyy-mm-dd HH:MM:ss',
              },
            },
        serializers: {
          req: req => ({
            method: req.method,
            url: req.url,
            headers: req.headers,
          }),
          res: res => ({
            statusCode: res.statusCode,
          }),
        },
      },
    }),
    PrismaModule,
    ProductsModule,
    CartModule,
    AuthModule,
    PaymentsModule,
    ShippingModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
