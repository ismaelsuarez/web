import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ShippingService } from './shipping.service';

@ApiTags('shipping')
@Controller('api/shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Get('cost')
  @ApiOperation({ summary: 'Calculate shipping cost by province and weight' })
  @ApiQuery({ name: 'province', description: 'Province name', example: 'Buenos Aires' })
  @ApiQuery({ name: 'weight', description: 'Weight in kg', example: '2.5' })
  @ApiResponse({ status: 200, description: 'Shipping cost calculated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid province or weight' })
  async calculateShippingCost(
    @Query('province') province: string,
    @Query('weight') weight: string,
  ) {
    try {
      if (!province || !weight) {
        throw new HttpException(
          'Province and weight are required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const weightNum = parseFloat(weight);
      if (isNaN(weightNum)) {
        throw new HttpException(
          'Weight must be a valid number',
          HttpStatus.BAD_REQUEST,
        );
      }

      const cost = this.shippingService.calculateShippingCost(province, weightNum);

      return {
        success: true,
        data: {
          province,
          weight: weightNum,
          cost,
        },
        message: 'Costo de envío calculado exitosamente',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        error.message || 'Error al calcular el costo de envío',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('provinces')
  @ApiOperation({ summary: 'Get all available provinces' })
  @ApiResponse({ status: 200, description: 'Provinces retrieved successfully' })
  async getProvinces() {
    try {
      const provinces = this.shippingService.getProvinces();

      return {
        success: true,
        data: provinces,
        message: 'Provincias obtenidas exitosamente',
      };
    } catch (error) {
      throw new HttpException(
        'Error al obtener las provincias',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('rates')
  @ApiOperation({ summary: 'Get all shipping rates' })
  @ApiResponse({ status: 200, description: 'Shipping rates retrieved successfully' })
  async getShippingRates() {
    try {
      const rates = this.shippingService.getShippingRates();

      return {
        success: true,
        data: rates,
        message: 'Tarifas de envío obtenidas exitosamente',
      };
    } catch (error) {
      throw new HttpException(
        'Error al obtener las tarifas de envío',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
