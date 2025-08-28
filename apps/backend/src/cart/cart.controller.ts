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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartSchema, UpdateCartItemSchema, CartItemParamsSchema } from '../dto/cart.dto';

@ApiTags('cart')
@Controller('api/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  async getCart(@Request() req: any) {
    try {
      // TODO: Implementar autenticación real
      // Por ahora simulamos un userId = 1 para testing
      const userId = req.user?.id || 1;
      return await this.cartService.getCart(userId);
    } catch (error) {
      throw new HttpException(
        'Error al obtener el carrito',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiBody({ schema: AddToCartSchema })
  @ApiResponse({ status: 200, description: 'Item added to cart successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data or insufficient stock' })
  @ApiResponse({ status: 404, description: 'Variant not found' })
  async addToCart(@Request() req: any, @Body() body: any) {
    try {
      const validatedData = AddToCartSchema.parse(body);
      // TODO: Implementar autenticación real
      const userId = req.user?.id || 1;
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
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiParam({ name: 'id', description: 'Cart item ID' })
  @ApiBody({ schema: UpdateCartItemSchema })
  @ApiResponse({ status: 200, description: 'Cart item updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data or insufficient stock' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  async updateCartItem(
    @Request() req: any,
    @Param() params: any,
    @Body() body: any,
  ) {
    try {
      const { id } = CartItemParamsSchema.parse(params);
      const validatedData = UpdateCartItemSchema.parse(body);
      // TODO: Implementar autenticación real
      const userId = req.user?.id || 1;
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
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiParam({ name: 'id', description: 'Cart item ID' })
  @ApiResponse({ status: 200, description: 'Cart item removed successfully' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  async removeCartItem(@Request() req: any, @Param() params: any) {
    try {
      const { id } = CartItemParamsSchema.parse(params);
      // TODO: Implementar autenticación real
      const userId = req.user?.id || 1;
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
  @ApiOperation({ summary: 'Clear entire cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
  async clearCart(@Request() req: any) {
    try {
      // TODO: Implementar autenticación real
      const userId = req.user?.id || 1;
      return await this.cartService.clearCart(userId);
    } catch (error) {
      throw new HttpException(
        'Error al vaciar el carrito',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
