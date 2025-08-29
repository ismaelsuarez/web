import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { securityConfig } from './config/security.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // 🔒 SECURITY: Helmet.js configuration
  app.use(
    helmet.default({
      contentSecurityPolicy: securityConfig.csp.enabled
        ? {
            directives: securityConfig.csp.directives,
          }
        : false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // 🔒 SECURITY: Disable X-Powered-By header
  app.getHttpAdapter().getInstance().disable('x-powered-by');

  app.enableCors(securityConfig.cors);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Ecommerce API')
    .setDescription('API para aplicación de ecommerce')
    .setVersion('1.0')
    .addTag('products')
    .addTag('cart')
    .addTag('auth')
    .addTag('payments')
    .addTag('shipping')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);


  const port = process.env.PORT || 3001;
  await app.listen(port);

  // eslint-disable-next-line no-console
  console.log(`🚀 Backend corriendo en http://localhost:${port}`);
  // eslint-disable-next-line no-console
  console.log(
    `📚 API Documentation disponible en http://localhost:${port}/api/docs`
  );
  // eslint-disable-next-line no-console
  console.log(
    `🔒 Security: Helmet.js ${process.env.CSP_ENABLED === 'true' ? 'con CSP activado' : 'sin CSP'}`
  );
}

bootstrap();
