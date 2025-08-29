import {
  Controller,
  Get,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import {
  GetProductsQuerySchema,
  GetProductParamsSchema,
} from '../dto/product.dto';
import { GetProductsQuery, GetProductParams } from '../types';

@ApiTags('products')
@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products with pagination and filters' })
  @ApiQuery({ name: 'q', required: false, description: 'Search query' })
  @ApiQuery({ name: 'category', required: false, description: 'Category slug' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async findAll(@Query() query: GetProductsQuery) {
    try {
      const validatedQuery = GetProductsQuerySchema.parse(query);
      return await this.productsService.findAll(validatedQuery);
    } catch (error) {
      throw new HttpException(
        'Invalid query parameters',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param() params: GetProductParams) {
    try {
      const { id } = GetProductParamsSchema.parse(params);
      const product = await this.productsService.findOne(id);

      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      return product;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Invalid product ID', HttpStatus.BAD_REQUEST);
    }
  }
}
