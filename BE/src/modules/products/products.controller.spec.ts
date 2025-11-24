import { Mocked, TestBed } from '@suites/unit';
import { ProductsController } from './products.controller';
import { CreateProductDto } from './products.schema';
import { ProductsService } from './products.service';

describe('Products Controller Unit Tests', () => {
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
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Foo Bar',
        description: 'The fooest of bars',
        price: 1.23,
        availableCount: 123,
      };
      productsService.create = jest.fn();

      await productsController.create(createProductDto);
      expect(productsService.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  // Note: The following test cases can be completed at your convenience.
  // Furthermore, any additional tests for covering edge cases or to increase
  // code coverage is left up to your discretion.
  describe('findAll', async () => {});
  describe('findOne', async () => {});
  describe('update', async () => {});
  describe('delete', async () => {});
});
