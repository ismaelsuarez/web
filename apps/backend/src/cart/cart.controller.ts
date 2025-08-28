import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartSchema, UpdateCartItemSchema, CartItemParamsSchema } from '../dto/cart.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddToCartDto, UpdateCartItemDto, CartItemParams, AuthenticatedRequest } from '../types';

@ApiTags('cart')
@Controller('api/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user cart' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  async getCart(@Request() req: AuthenticatedRequest) {
    try {
      const userId = parseInt(req.user.id, 10);
      return await this.cartService.getCart(userId);
    } catch (error) {
      throw new HttpException(
        'Error al obtener el carrito',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiBody({ type: 'object', schema: { $ref: '#/components/schemas/AddToCartDto' } })
  @ApiResponse({ status: 200, description: 'Item added to cart successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data or insufficient stock' })
  @ApiResponse({ status: 404, description: 'Variant not found' })
  async addToCart(@Request() req: AuthenticatedRequest, @Body() body: AddToCartDto) {
    try {
      const validatedData = AddToCartSchema.parse(body);
      const userId = parseInt(req.user.id, 10);
      return await this.cartService.addToCart(userId, validatedData);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al agregar item al carrito',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('item/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiParam({ name: 'id', description: 'Cart item ID' })
  @ApiBody({ type: 'object', schema: { $ref: '#/components/schemas/UpdateCartItemDto' } })
  @ApiResponse({ status: 200, description: 'Cart item updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data or insufficient stock' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  async updateCartItem(
    @Request() req: AuthenticatedRequest,
    @Param() params: CartItemParams,
    @Body() body: UpdateCartItemDto,
  ) {
    try {
      const { id } = CartItemParamsSchema.parse(params);
      const validatedData = UpdateCartItemSchema.parse(body);
      const userId = parseInt(req.user.id, 10);
      return await this.cartService.updateCartItem(userId, id, validatedData);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al actualizar item del carrito',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('item/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiParam({ name: 'id', description: 'Cart item ID' })
  @ApiResponse({ status: 200, description: 'Cart item removed successfully' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  async removeCartItem(@Request() req: AuthenticatedRequest, @Param() params: CartItemParams) {
    try {
      const { id } = CartItemParamsSchema.parse(params);
      const userId = parseInt(req.user.id, 10);
      return await this.cartService.removeCartItem(userId, id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al eliminar item del carrito',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Clear entire cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
  async clearCart(@Request() req: AuthenticatedRequest) {
    try {
      const userId = parseInt(req.user.id, 10);
      return await this.cartService.clearCart(userId);
    } catch (error) {
      throw new HttpException(
        'Error al vaciar el carrito',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
