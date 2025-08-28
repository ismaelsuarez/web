import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '🚀 Ecommerce Backend API - NestJS + TypeScript';
  }
}
