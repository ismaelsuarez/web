import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should return products with pagination', async () => {
      const mockProducts = [
        {
          id: 1,
          title: 'Test Product',
          slug: 'test-product',
          description: 'Test description',
          brand: 'Test Brand',
          createdAt: new Date(),
          category: { id: 1, name: 'Electronics', slug: 'electronics' },
          variants: [
            {
              id: 1,
              sku: 'TEST-001',
              price: 1000,
              stock: 10,
              images: ['image1.jpg'],
              specs: { color: 'red' },
            },
          ],
        },
      ];

      const mockCount = 1;

      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
      mockPrismaService.product.count.mockResolvedValue(mockCount);

      const result = await service.findAll({
        page: 1,
        limit: 10,
        q: 'test',
        category: 'electronics',
      });

      expect(result).toEqual({
        products: mockProducts,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          pages: 1,
        },
      });

      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: 'test', mode: 'insensitive' } },
            { description: { contains: 'test', mode: 'insensitive' } },
            { brand: { contains: 'test', mode: 'insensitive' } },
          ],
          category: { slug: 'electronics' },
        },
        include: {
          category: true,
          variants: {
            select: {
              id: true,
              sku: true,
              price: true,
              stock: true,
              images: true,
            },
          },
        },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });

      expect(mockPrismaService.product.count).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: 'test', mode: 'insensitive' } },
            { description: { contains: 'test', mode: 'insensitive' } },
            { brand: { contains: 'test', mode: 'insensitive' } },
          ],
          category: { slug: 'electronics' },
        },
      });
    });

    it('should handle empty search query', async () => {
      const mockProducts = [];
      const mockCount = 0;

      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
      mockPrismaService.product.count.mockResolvedValue(mockCount);

      const result = await service.findAll({
        page: 1,
        limit: 10,
      });

      expect(result).toEqual({
        products: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0,
        },
      });

      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          category: true,
          variants: {
            select: {
              id: true,
              sku: true,
              price: true,
              stock: true,
              images: true,
            },
          },
        },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('getProduct', () => {
    it('should return a product by id', async () => {
      const mockProduct = {
        id: 1,
        title: 'Test Product',
        slug: 'test-product',
        description: 'Test description',
        brand: 'Test Brand',
        createdAt: new Date(),
        category: { id: 1, name: 'Electronics', slug: 'electronics' },
        variants: [
          {
            id: 1,
            sku: 'TEST-001',
            price: 1000,
            stock: 10,
            images: ['image1.jpg'],
            specs: { color: 'red' },
          },
        ],
      };

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

      const result = await service.findOne(1);

      expect(result).toEqual(mockProduct);
      expect(mockPrismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          category: true,
          variants: {
            select: {
              id: true,
              sku: true,
              price: true,
              stock: true,
              images: true,
              specs: true,
            },
          },
        },
      });
    });

    it('should return null for non-existent product', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
      expect(mockPrismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
        include: {
          category: true,
          variants: {
            select: {
              id: true,
              sku: true,
              price: true,
              stock: true,
              images: true,
              specs: true,
            },
          },
        },
      });
    });
  });
});
