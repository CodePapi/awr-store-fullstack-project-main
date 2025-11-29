import { Mocked, TestBed } from '@suites/unit';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateProductDto } from './products.schema';
import { ProductsService } from './products.service';
import type { Product } from 'src/common/generated/prisma-client';

describe('Product Service Unit Tests', () => {
  let productService: ProductsService;
  let prismaService: Mocked<PrismaService>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(ProductsService).compile();

    productService = unit;
    prismaService = unitRef.get(PrismaService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockProduct1: Product = {
    id: 1,
    name: 'Mesmerizer 3000',
    description: 'An antique mesmerizer designed to captivate audiences.',
    price: 199.99,
    availableCount: 12,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProduct2: Product = {
    id: 2,
    name: 'Invisibility Cloak V2',
    description: 'Improved fabric for perfect stealth.',
    price: 999.99,
    availableCount: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('create', () => {
    it('should create a product with provided data', async () => {
      const createdProductData: CreateProductDto = {
        name: 'Mesmerizer 3000',
        description: 'An antique mesmerizer designed to captivate audiences.',
        price: 199.99,
        availableCount: 12,
      };

      prismaService.product.create.mockResolvedValueOnce(mockProduct1);

      const result = await productService.create(createdProductData);
      expect(prismaService.product.create).toHaveBeenCalledWith({
        data: createdProductData,
      });
      expect(result).toEqual(mockProduct1);
    });
  });

  describe('findAll', () => {
    it('should return an array of all products', async () => {
      const mockProducts = [mockProduct1, mockProduct2];
      prismaService.product.findMany.mockResolvedValueOnce(mockProducts);

      const result = await productService.findAll();
      expect(prismaService.product.findMany).toHaveBeenCalledWith();
      expect(result).toEqual(mockProducts);
      expect(result.length).toBe(2);
    });

    it('should return an empty array if no products are found', async () => {
      prismaService.product.findMany.mockResolvedValueOnce([]);

      const result = await productService.findAll();

      expect(prismaService.product.findMany).toHaveBeenCalledWith();
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe('findManyByIds', () => {
    it('should return a list of products matching the provided IDs', async () => {
      const targetIds = [1, 2];
      const mockProducts = [mockProduct1, mockProduct2];
      prismaService.product.findMany.mockResolvedValueOnce(mockProducts);

      const result = await productService.findManyByIds(targetIds);
      expect(prismaService.product.findMany).toHaveBeenCalledWith({
        where: {
          id: {
            in: targetIds,
          },
        },
      });
      expect(result).toEqual(mockProducts);
      expect(result.length).toBe(2);
    });

    it('should return an empty array if none of the provided IDs are found', async () => {
      const targetIds = [99, 100];
      prismaService.product.findMany.mockResolvedValueOnce([]);

      const result = await productService.findManyByIds(targetIds);
      expect(prismaService.product.findMany).toHaveBeenCalledWith({
        where: {
          id: {
            in: targetIds,
          },
        },
      });
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should return a partial list of products if only some IDs are found', async () => {
      const targetIds = [1, 99];
      const mockProducts = [mockProduct1];

      prismaService.product.findMany.mockResolvedValueOnce(mockProducts);

      const result = await productService.findManyByIds(targetIds);
      expect(prismaService.product.findMany).toHaveBeenCalledWith({
        where: {
          id: {
            in: targetIds,
          },
        },
      });
      expect(result).toEqual(mockProducts);
      expect(result.length).toBe(1);
    });
  });
});
