import { Mocked, TestBed } from '@suites/unit';
import { ProductsController } from './products.controller';
import { CreateProductDto, ProductResponse } from './products.schema';
import { ProductsService } from './products.service';

// Mock data matching the ProductResponse shape
const mockProduct: ProductResponse = {
  id: 1,
  name: 'Test Product',
  description: 'A description',
  price: 10.99,
  availableCount: 50,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Products Controller Unit Tests (Create & FindAll)', () => {
  let productsController: ProductsController;
  let productsService: Mocked<ProductsService>;

  beforeAll(async () => {
    // Setup the testing module
    const { unit, unitRef } =
      await TestBed.solitary(ProductsController).compile();

    productsController = unit;
    productsService = unitRef.get(ProductsService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- 1. POST /products Test ---
  describe('create', () => {
    it('should call productsService.create with the DTO and return the created product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Foo Bar',
        description: 'The fooest of bars',
        price: 1.23,
        availableCount: 123,
      };

      // Mock the service implementation to return the created product
      productsService.create.mockResolvedValue(mockProduct);

      const result = await productsController.create(createProductDto);

      // Assert service interaction
      expect(productsService.create).toHaveBeenCalledWith(createProductDto);

      // Assert controller output
      expect(result).toEqual(mockProduct);
    });
  });

  // --- 2. GET /products Test ---
  describe('findAll', () => {
    it('should call productsService.findAll and return an array of products', async () => {
      const mockProductList: ProductResponse[] = [
        mockProduct,
        { ...mockProduct, id: 2, name: 'Product 2', price: 20.0 },
      ];

      // Mock the service call to return a list of products
      productsService.findAll.mockResolvedValue(mockProductList);

      const result = await productsController.findAll();

      // Assert service interaction
      expect(productsService.findAll).toHaveBeenCalledTimes(1);

      // Assert controller output
      expect(result).toEqual(mockProductList);
    });
  });
});
