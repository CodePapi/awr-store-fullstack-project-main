import { Mocked, TestBed } from '@suites/unit';
import { OrdersController } from './orders.controller';
import { CreateOrderDto, OrderResponse } from './orders.schema';
import { OrdersService } from './orders.service';
import { NotFoundException } from '@nestjs/common';

// --- Mock Data ---
const mockOrderId = 'f539f7a2-556d-4f22-9138-6065488709c2';
const mockCreateOrderDto: CreateOrderDto = {
  customerId: '7545afc6-c1eb-497a-9a44-4e6ba595b4ab',
  products: [
    { id: 1, quantity: 2 },
    { id: 4, quantity: 1 },
  ],
};

const mockOrderResponse: OrderResponse = {
  id: mockOrderId,
  customerId: mockCreateOrderDto.customerId,
  orderCreatedDate: new Date(),
  orderUpdatedDate: new Date(),
  status: 'PENDING',
  orderTotal: 35.5,
  products: [
    { id: 1, quantity: 2, name: 'Widget A' },
    { id: 4, quantity: 1, name: 'Gizmo B' },
  ],
};

describe('Orders Controller Unit Tests', () => {
  let ordersController: OrdersController;
  let ordersService: Mocked<OrdersService>;

  beforeAll(async () => {
    // Setup the testing module
    const { unit, unitRef } =
      await TestBed.solitary(OrdersController).compile();

    ordersController = unit;
    ordersService = unitRef.get(OrdersService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- 1. POST /orders Test: create ---
  describe('create', () => {
    it('should call ordersService.placeOrder and return the created order', async () => {
      // Arrange
      ordersService.placeOrder.mockResolvedValue(mockOrderResponse);

      // Act
      const result = await ordersController.create(mockCreateOrderDto);

      // Assert
      expect(ordersService.placeOrder).toHaveBeenCalledWith(mockCreateOrderDto);
      expect(result).toEqual(mockOrderResponse);
    });
  });

  // --- 2. GET /orders/:id Test: findOne ---
  describe('findOne', () => {
    it('should call ordersService.findOne and return the order if found', async () => {
      // Arrange
      ordersService.findOne.mockResolvedValue(mockOrderResponse);

      // Act
      const result = await ordersController.findOne(mockOrderId);

      // Assert
      expect(ordersService.findOne).toHaveBeenCalledWith(mockOrderId);
      expect(result).toEqual(mockOrderResponse);
    });

    // it('should throw NotFoundException if the order is not found', async () => {
    //   // Arrange
    //   const nonExistentId = 'a0a0a0a0-0000-0000-0000-000000000000';
    //   // Mock the service to return null (or undefined)
    //   ordersService.findOne.mockResolvedValue(null);

    //   // Assert
    //   // We expect the call to the controller method to throw the specific NestJS exception
    //   await expect(ordersController.findOne(nonExistentId)).rejects.toThrow(
    //     NotFoundException,
    //   );
    //   await expect(ordersController.findOne(nonExistentId)).rejects.toThrow(
    //     `Order with ID "${nonExistentId}" not found.`,
    //   );

    //   // Ensure the service was called
    //   expect(ordersService.findOne).toHaveBeenCalledWith(nonExistentId);
    // });

    // Note: The ParseUUIDPipe validation is handled by NestJS/Express/Fastify integration,
    // but we can ensure the controller handles the string parameter correctly.
    it('should handle the string ID parameter passed by ParseUUIDPipe', async () => {
      // Arrange
      ordersService.findOne.mockResolvedValue(mockOrderResponse);

      // Act
      await ordersController.findOne(mockOrderId);

      // Assert the service was called with the string ID
      expect(ordersService.findOne).toHaveBeenCalledWith(mockOrderId);
    });
  });
});
