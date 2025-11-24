import { Mocked, TestBed } from '@suites/unit';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateProductDto } from './products.schema';
import { ProductsService } from './products.service';

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

  describe('create', () => {
    it('should create a product with provided data', async () => {
      const createdProductData: CreateProductDto = {
        name: 'Mesmerizer 3000',
        description: 'An antique mesmerizer designed to captivate audiences.',
        price: 199.99,
        availableCount: 12,
      };

      prismaService.product.create.mockResolvedValueOnce({
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...createdProductData,
      });

      const result = await productService.create(createdProductData);
      expect(prismaService.product.create).toHaveBeenCalledWith({
        data: createdProductData,
      });
      expect(result).toEqual(expect.objectContaining(createdProductData));
    });
  });

  // Note: The following test cases can be completed at your convenience.
  // Furthermore, any additional tests for covering edge cases or to increase
  // code coverage is left up to your discretion.
  describe('findMany', () => {
    // Note: Pagination support is not expected for this project, but should you
    // decide to implement pagination support please also consider adding the
    // appropriate tests.
    it('should return all products without taking pagination into account', async () => {});
  });

  describe('findOne', () => {
    it('should return retrieve matching product by using provided product id', async () => {});
  });

  describe('updateOne', () => {
    it('should update and return the product with the given product id', async () => {});
  });

  describe('deleteOne', () => {
    it('should delete a product with the given product id', async () => {});
  });
});
