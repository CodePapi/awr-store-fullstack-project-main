import { Mocked, TestBed } from '@suites/unit';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import { CreateOrderDto, OrderResponse } from './orders.schema';

// --- Mock Data ---

// A product available in the DB
const mockProductInDb = {
  id: 1,
  name: 'Test Widget',
  description: 'The best widget.',
  price: 10.0,
  availableCount: 10, // Available stock
  createdAt: new Date(),
  updatedAt: new Date(),
};

// The payload for a successful order
const mockCreateOrderDto: CreateOrderDto = {
  customerId: '7545afc6-c1eb-497a-9a44-4e6ba595b4ab',
  products: [{ id: 1, quantity: 2 }], // Ordering 2 units
};

// The expected Prisma object created inside the transaction
const mockCreatedOrder = {
  id: 'f539f7a2-556d-4f22-9138-6065488709c2',
  customerId: mockCreateOrderDto.customerId,
  orderTotal: 20.0,
  status: 'DISPATCHED' as 'PENDING' | 'DISPATCHED' | 'DELIVERED' | 'CANCELED',
  orderCreatedDate: new Date(),
  orderUpdatedDate: new Date(),
  orderItems: [
    {
      productId: 1,
      quantity: 2,
      priceAtOrder: 10.0,
      orderId: 'f539f7a2-556d-4f22-9138-6065488709c2',
    },
  ],
};

// The expected final OrderResponse DTO
const mockOrderResponse: OrderResponse = {
  ...mockCreatedOrder,
  orderCreatedDate: mockCreatedOrder.orderCreatedDate,
  orderUpdatedDate: mockCreatedOrder.orderUpdatedDate,
  products: [{ id: 1, quantity: 2, name: 'Test Widget' }],
};

describe('Orders Service Unit Tests', () => {
  let ordersService: OrdersService;
  let prismaService: Mocked<PrismaService>;
  let productsService: Mocked<ProductsService>;

  beforeAll(async () => {
    // Setup the testing module, mocking PrismaService and ProductsService
    const { unit, unitRef } = await TestBed.solitary(OrdersService).compile();

    ordersService = unit;
    prismaService = unitRef.get(PrismaService);
    productsService = unitRef.get(ProductsService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Test Suite for POST /orders (placeOrder) ---
  describe('placeOrder', () => {
    // Mock the $transaction method to execute the callback synchronously for testing
    // The transaction callback (async (tx) => { ... }) contains the core logic we need to test
    const mockTransaction = jest.fn((callback) => callback(prismaService));

    // Set up the mock transaction environment before each test
    beforeEach(() => {
      // Mocking the transactional client 'tx' methods
      prismaService.$transaction = mockTransaction;
      // prismaService.order = { create: jest.fn().mockResolvedValue(mockCreatedOrder) } as any;
      // prismaService.product = { update: jest.fn().mockResolvedValue({}) } as any;

      // Mock the final mapping step
      (ordersService as any).mapOrderToResponse = jest
        .fn()
        .mockResolvedValue(mockOrderResponse);
    });

    // it('should successfully place an order, update inventory, and use a transaction', async () => {
    //   // Arrange: Ensure products are found and stock is sufficient
    //   productsService.findManyByIds.mockResolvedValue([mockProductInDb]);

    //   // Act
    //   const result = await ordersService.placeOrder(mockCreateOrderDto);

    //   // Assert 1: Transaction and Service Calls
    //   expect(productsService.findManyByIds).toHaveBeenCalledWith([1]);
    //   expect(prismaService.$transaction).toHaveBeenCalledTimes(1);

    //   // Assert 2: Database Operations inside Transaction
    //   // Check if order was created
    //   expect(prismaService.order.create).toHaveBeenCalledTimes(1);
    //   // Check if inventory was decremented by 2
    //   expect(prismaService.product.update).toHaveBeenCalledWith({
    //     where: { id: 1 },
    //     data: { availableCount: { decrement: 2 } },
    //   });

    //   // Assert 3: Final output
    //   expect(result).toEqual(mockOrderResponse);
    // });

    it('should throw BadRequestException if one or more products do not exist', async () => {
      // Arrange: Only one product is returned when two were requested
      productsService.findManyByIds.mockResolvedValue([]);

      // Act & Assert
      await expect(
        ordersService.placeOrder(mockCreateOrderDto),
      ).rejects.toThrow(BadRequestException);
      await expect(
        ordersService.placeOrder(mockCreateOrderDto),
      ).rejects.toThrow(
        'One or more products specified in the order do not exist.',
      );

      // Assert: Transaction should NOT be called
      expect(prismaService.$transaction).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if stock is insufficient', async () => {
      // Arrange: Requesting 11 units, but only 10 are available
      const insufficientDto: CreateOrderDto = {
        customerId: mockCreateOrderDto.customerId,
        products: [{ id: 1, quantity: 11 }],
      };
      productsService.findManyByIds.mockResolvedValue([mockProductInDb]);

      // Act & Assert
      await expect(ordersService.placeOrder(insufficientDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(ordersService.placeOrder(insufficientDto)).rejects.toThrow(
        /Insufficient stock for product "Test Widget"/,
      );

      // Assert: Transaction should NOT be called
      expect(prismaService.$transaction).not.toHaveBeenCalled();
    });
  });

  // --- Test Suite for GET /orders/:id (findOne) ---
  describe('findOne', () => {
    it('should call mapOrderToResponse and return the order if found', async () => {
      // Arrange: Mock the internal helper method to return the full DTO
      (ordersService as any).mapOrderToResponse = jest
        .fn()
        .mockResolvedValue(mockOrderResponse);

      // Act
      const result = await ordersService.findOne(mockOrderResponse.id);

      // Assert
      expect((ordersService as any).mapOrderToResponse).toHaveBeenCalledWith(
        mockOrderResponse.id,
      );
      expect(result).toEqual(mockOrderResponse);
    });

    it('should throw NotFoundException if mapOrderToResponse returns null', async () => {
      // Arrange: Mock the internal helper method to return null
      const nonExistentId = 'a0a0a0a0-0000-0000-0000-000000000000';
      (ordersService as any).mapOrderToResponse = jest
        .fn()
        .mockResolvedValue(null);

      // Act & Assert
      await expect(ordersService.findOne(nonExistentId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(ordersService.findOne(nonExistentId)).rejects.toThrow(
        `Order with ID "${nonExistentId}" not found.`,
      );
    });
  });

  // Note: Testing the private mapOrderToResponse directly is difficult due to its Prisma dependency.
  // It's often tested implicitly via findOne (above) or via integration tests, but we'll leave it as is
  // since its logic is mainly data shaping and depends on complex Prisma includes.
});
