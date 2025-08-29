import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto, UpdateCartItemDto } from '../dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId?: number) {
    if (!userId) {
      return { items: [], total: 0, itemCount: 0 };
    }

    const cart = await this.prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return { items: [], total: 0, itemCount: 0 };
    }

    const total = cart.items.reduce(
      (sum, item) => sum + item.variant.price * item.quantity,
      0
    );

    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items: cart.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        variant: item.variant,
        product: item.variant.product,
      })),
      total,
      itemCount,
    };
  }

  async addToCart(userId: number, dto: AddToCartDto) {
    const { variantId, quantity } = dto;

    // Verificar que la variante existe y tiene stock disponible
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!variant) {
      throw new NotFoundException('Variante no encontrada');
    }

    if (variant.stock < quantity) {
      throw new BadRequestException(
        `Stock insuficiente. Disponible: ${variant.stock}`
      );
    }

    // Obtener o crear carrito del usuario
    let cart = await this.prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      });
    }

    // Verificar si el item ya existe en el carrito
    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        variantId,
      },
    });

    if (existingItem) {
      // Actualizar cantidad existente
      const newQuantity = existingItem.quantity + quantity;

      if (variant.stock < newQuantity) {
        throw new BadRequestException(
          `Stock insuficiente para la cantidad total. Disponible: ${variant.stock}`
        );
      }

      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      // Crear nuevo item
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId,
          quantity,
        },
      });
    }

    // Actualizar timestamp del carrito
    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { updatedAt: new Date() },
    });

    return this.getCart(userId);
  }

  async updateCartItem(userId: number, itemId: number, dto: UpdateCartItemDto) {
    const { quantity } = dto;

    // Verificar que el item pertenece al usuario
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: { userId },
      },
      include: {
        variant: true,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Item del carrito no encontrado');
    }

    // Verificar stock disponible
    if (cartItem.variant.stock < quantity) {
      throw new BadRequestException(
        `Stock insuficiente. Disponible: ${cartItem.variant.stock}`
      );
    }

    if (quantity === 0) {
      // Eliminar item si cantidad es 0
      await this.prisma.cartItem.delete({
        where: { id: itemId },
      });
    } else {
      // Actualizar cantidad
      await this.prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    // Actualizar timestamp del carrito
    await this.prisma.cart.update({
      where: { id: cartItem.cartId },
      data: { updatedAt: new Date() },
    });

    return this.getCart(userId);
  }

  async removeCartItem(userId: number, itemId: number) {
    // Verificar que el item pertenece al usuario
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: { userId },
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Item del carrito no encontrado');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    // Actualizar timestamp del carrito
    await this.prisma.cart.update({
      where: { id: cartItem.cartId },
      data: { updatedAt: new Date() },
    });

    return this.getCart(userId);
  }

  async clearCart(userId: number) {
    const cart = await this.prisma.cart.findFirst({
      where: { userId },
    });

    if (cart) {
      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      await this.prisma.cart.update({
        where: { id: cart.id },
        data: { updatedAt: new Date() },
      });
    }

    return this.getCart(userId);
  }

  // Método para verificar disponibilidad de stock sin reservar
  async checkStockAvailability(userId: number) {
    const cart = await this.getCart(userId);

    for (const item of cart.items) {
      if (item.variant.stock < item.quantity) {
        throw new BadRequestException(
          `Stock insuficiente para ${item.product.title}. Disponible: ${item.variant.stock}, Solicitado: ${item.quantity}`
        );
      }
    }

    return true;
  }
}
