import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CartService', () => {
  let service: CartService;

  const mockPrismaService = {
    cart: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    cartItem: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    productVariant: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCart', () => {
    it('should return existing cart with items', async () => {
      const mockCart = {
        id: 1,
        userId: 1,
        items: [
          {
            id: 1,
            quantity: 2,
            variant: {
              id: 1,
              sku: 'TEST-001',
              price: 1000,
              stock: 10,
              images: ['image1.jpg'],
              specs: { color: 'red' },
              product: {
                id: 1,
                title: 'Test Product',
                slug: 'test-product',
                description: 'Test description',
                brand: 'Test Brand',
                category: { id: 1, name: 'Electronics', slug: 'electronics' },
              },
            },
          },
        ],
      };

      mockPrismaService.cart.findFirst.mockResolvedValue(mockCart);

      const result = await service.getCart(1);

      expect(result).toEqual({
        items: mockCart.items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          variant: item.variant,
          product: item.variant.product,
        })),
        total: 2000, // 2 * 1000
        itemCount: 2,
      });

      expect(mockPrismaService.cart.findFirst).toHaveBeenCalledWith({
        where: { userId: 1 },
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
    });

    it('should return empty cart when no cart exists', async () => {
      mockPrismaService.cart.findFirst.mockResolvedValue(null);

      const result = await service.getCart(1);

      expect(result).toEqual({
        items: [],
        total: 0,
        itemCount: 0,
      });
    });
  });

  describe('addToCart', () => {
    it('should add new item to cart', async () => {
      const mockVariant = {
        id: 1,
        sku: 'TEST-001',
        price: 1000,
        stock: 10,
        images: ['image1.jpg'],
        specs: { color: 'red' },
        product: {
          id: 1,
          title: 'Test Product',
          slug: 'test-product',
          description: 'Test description',
          brand: 'Test Brand',
          category: { id: 1, name: 'Electronics', slug: 'electronics' },
        },
      };

      const mockCart = {
        id: 1,
        userId: 1,
        items: [
          {
            id: 1,
            quantity: 2,
            variant: mockVariant,
          },
        ],
      };

      mockPrismaService.productVariant.findUnique.mockResolvedValue(mockVariant);
      mockPrismaService.cart.findFirst.mockResolvedValue(mockCart);
      mockPrismaService.cartItem.findFirst.mockResolvedValue(null);
      mockPrismaService.cartItem.create.mockResolvedValue({
        id: 1,
        quantity: 2,
        variant: mockVariant,
      });

      const result = await service.addToCart(1, { variantId: 1, quantity: 2 });

      expect(result).toEqual({
        items: mockCart.items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          variant: item.variant,
          product: item.variant.product,
        })),
        total: 2000,
        itemCount: 2,
      });

      expect(mockPrismaService.productVariant.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      });
    });

    it('should update existing item quantity', async () => {
      const mockVariant = {
        id: 1,
        sku: 'TEST-001',
        price: 1000,
        stock: 10,
        images: ['image1.jpg'],
        specs: { color: 'red' },
        product: {
          id: 1,
          title: 'Test Product',
          slug: 'test-product',
          description: 'Test description',
          brand: 'Test Brand',
          category: { id: 1, name: 'Electronics', slug: 'electronics' },
        },
      };

      const mockCartItem = {
        id: 1,
        quantity: 1,
        variant: mockVariant,
      };

      const mockCart = {
        id: 1,
        userId: 1,
        items: [mockCartItem],
      };

      mockPrismaService.productVariant.findUnique.mockResolvedValue(mockVariant);
      mockPrismaService.cart.findFirst.mockResolvedValue(mockCart);
      mockPrismaService.cartItem.findFirst.mockResolvedValue(mockCartItem);
      mockPrismaService.cartItem.update.mockResolvedValue({
        ...mockCartItem,
        quantity: 3,
      });

      // Mock the getCart method to return the expected result
      const expectedResult = {
        items: [{
          id: mockCartItem.id,
          quantity: 3,
          variant: mockCartItem.variant,
          product: mockCartItem.variant.product,
        }],
        total: 3000,
        itemCount: 3,
      };

      // Mock the getCart call that happens at the end of addToCart
      mockPrismaService.cart.findFirst.mockResolvedValueOnce(mockCart);
      mockPrismaService.cart.findFirst.mockResolvedValueOnce({
        id: 1,
        userId: 1,
        items: [{
          id: 1,
          quantity: 3,
          variant: mockVariant,
        }],
      });

      const result = await service.addToCart(1, { variantId: 1, quantity: 2 });

      expect(result).toEqual(expectedResult);

      expect(mockPrismaService.cartItem.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { quantity: 3 },
      });
    });

    it('should throw error for insufficient stock', async () => {
      const mockVariant = {
        id: 1,
        sku: 'TEST-001',
        price: 1000,
        stock: 5,
        images: ['image1.jpg'],
        specs: { color: 'red' },
        product: {
          id: 1,
          title: 'Test Product',
          slug: 'test-product',
          description: 'Test description',
          brand: 'Test Brand',
          category: { id: 1, name: 'Electronics', slug: 'electronics' },
        },
      };

      mockPrismaService.productVariant.findUnique.mockResolvedValue(mockVariant);

      await expect(service.addToCart(1, { variantId: 1, quantity: 10 })).rejects.toThrow(
        'Stock insuficiente. Disponible: 5'
      );
    });

    it('should throw error for non-existent variant', async () => {
      mockPrismaService.productVariant.findUnique.mockResolvedValue(null);

      await expect(service.addToCart(1, { variantId: 999, quantity: 1 })).rejects.toThrow(
        'Variante no encontrada'
      );
    });
  });

  describe('updateCartItem', () => {
    it('should update cart item quantity', async () => {
      const mockVariant = {
        id: 1,
        sku: 'TEST-001',
        price: 1000,
        stock: 10,
        images: ['image1.jpg'],
        specs: { color: 'red' },
        product: {
          id: 1,
          title: 'Test Product',
          slug: 'test-product',
          description: 'Test description',
          brand: 'Test Brand',
          category: { id: 1, name: 'Electronics', slug: 'electronics' },
        },
      };

      const mockCartItem = {
        id: 1,
        quantity: 1,
        variant: mockVariant,
      };

      const mockCart = {
        id: 1,
        userId: 1,
        items: [mockCartItem],
      };

      mockPrismaService.cartItem.findFirst.mockResolvedValue(mockCartItem);
      mockPrismaService.cart.findFirst.mockResolvedValue(mockCart);
      mockPrismaService.cartItem.update.mockResolvedValue({
        ...mockCartItem,
        quantity: 3,
      });

      // Mock the getCart method to return the expected result
      const expectedResult = {
        items: [{
          id: mockCartItem.id,
          quantity: 3,
          variant: mockCartItem.variant,
          product: mockCartItem.variant.product,
        }],
        total: 3000,
        itemCount: 3,
      };

      // Mock the getCart call that happens at the end of updateCartItem
      mockPrismaService.cart.findFirst.mockResolvedValueOnce({
        id: 1,
        userId: 1,
        items: [{
          id: 1,
          quantity: 3,
          variant: mockVariant,
        }],
      });

      const result = await service.updateCartItem(1, 1, { quantity: 3 });

      expect(result).toEqual(expectedResult);
    });

    it('should throw error for non-existent cart item', async () => {
      mockPrismaService.cartItem.findFirst.mockResolvedValue(null);

      await expect(service.updateCartItem(1, 999, { quantity: 1 })).rejects.toThrow(
        'Item del carrito no encontrado'
      );
    });
  });

  describe('removeCartItem', () => {
    it('should remove cart item', async () => {
      const mockCart = {
        id: 1,
        userId: 1,
        items: [],
      };

      mockPrismaService.cartItem.findFirst.mockResolvedValue({ id: 1 });
      mockPrismaService.cartItem.delete.mockResolvedValue({ id: 1 });
      mockPrismaService.cart.findFirst.mockResolvedValue(mockCart);

      const result = await service.removeCartItem(1, 1);

      expect(result).toEqual({
        items: [],
        total: 0,
        itemCount: 0,
      });

      expect(mockPrismaService.cartItem.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw error for non-existent cart item', async () => {
      mockPrismaService.cartItem.findFirst.mockResolvedValue(null);

      await expect(service.removeCartItem(1, 999)).rejects.toThrow(
        'Item del carrito no encontrado'
      );
    });
  });

  describe('clearCart', () => {
    it('should clear all cart items', async () => {
      const mockCart = {
        id: 1,
        userId: 1,
        items: [],
      };

      mockPrismaService.cart.findFirst.mockResolvedValue(mockCart);
      mockPrismaService.cartItem.deleteMany.mockResolvedValue({ count: 0 });

      const result = await service.clearCart(1);

      expect(result).toEqual({
        items: [],
        total: 0,
        itemCount: 0,
      });

      expect(mockPrismaService.cartItem.deleteMany).toHaveBeenCalledWith({
        where: { cartId: 1 },
      });
    });
  });
});
