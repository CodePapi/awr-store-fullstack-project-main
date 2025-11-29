import { Mocked, TestBed } from '@suites/unit';
import { ProductsController } from './products.controller';
import { CreateProductDto, ProductResponse } from './products.schema';
import { ProductsService } from './products.service';

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
    const { unit, unitRef } =
      await TestBed.solitary(ProductsController).compile();

    productsController = unit;
    productsService = unitRef.get(ProductsService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call productsService.create with the DTO and return the created product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Foo Bar',
        description: 'The fooest of bars',
        price: 1.23,
        availableCount: 123,
      };

      productsService.create.mockResolvedValue(mockProduct);

      const result = await productsController.create(createProductDto);

      expect(productsService.create).toHaveBeenCalledWith(createProductDto);

      expect(result).toEqual(mockProduct);
    });
  });

  describe('findAll', () => {
    it('should call productsService.findAll and return an array of products', async () => {
      const mockProductList: ProductResponse[] = [
        mockProduct,
        { ...mockProduct, id: 2, name: 'Product 2', price: 20.0 },
      ];
      productsService.findAll.mockResolvedValue(mockProductList);

      const result = await productsController.findAll();
      expect(productsService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProductList);
    });
  });
});
