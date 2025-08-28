import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 Backend corriendo en http://localhost:${port}`);
  console.log(`📚 API Documentation disponible en http://localhost:${port}/api`);
}

bootstrap();
