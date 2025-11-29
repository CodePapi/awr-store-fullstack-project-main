import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Mocked, TestBed } from '@suites/unit';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import { CreateOrderDto, OrderResponse } from './orders.schema';
import { OrdersService } from './orders.service';

const mockProductInDb = {
  id: 1,
  name: 'Test Widget',
  description: 'The best widget.',
  price: 10.0,
  availableCount: 10,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockCreateOrderDto: CreateOrderDto = {
  customerId: '7545afc6-c1eb-497a-9a44-4e6ba595b4ab',
  products: [{ id: 1, quantity: 2 }],
};

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
    const { unit, unitRef } = await TestBed.solitary(OrdersService).compile();

    ordersService = unit;
    prismaService = unitRef.get(PrismaService);
    productsService = unitRef.get(ProductsService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('placeOrder', () => {
    const mockTransaction = jest.fn((callback) => callback(prismaService));

    beforeEach(() => {
      prismaService.$transaction = mockTransaction;
      (ordersService as any).mapOrderToResponse = jest
        .fn()
        .mockResolvedValue(mockOrderResponse);
    });

    it('should throw BadRequestException if one or more products do not exist', async () => {
      productsService.findManyByIds.mockResolvedValue([]);

      await expect(
        ordersService.placeOrder(mockCreateOrderDto),
      ).rejects.toThrow(BadRequestException);
      await expect(
        ordersService.placeOrder(mockCreateOrderDto),
      ).rejects.toThrow(
        'One or more products specified in the order do not exist.',
      );

      expect(prismaService.$transaction).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if stock is insufficient', async () => {
      const insufficientDto: CreateOrderDto = {
        customerId: mockCreateOrderDto.customerId,
        products: [{ id: 1, quantity: 11 }],
      };
      productsService.findManyByIds.mockResolvedValue([mockProductInDb]);

      await expect(ordersService.placeOrder(insufficientDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(ordersService.placeOrder(insufficientDto)).rejects.toThrow(
        /Insufficient stock for product "Test Widget"/,
      );

      expect(prismaService.$transaction).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call mapOrderToResponse and return the order if found', async () => {
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
      const nonExistentId = 'a0a0a0a0-0000-0000-0000-000000000000';
      (ordersService as any).mapOrderToResponse = jest
        .fn()
        .mockResolvedValue(null);

      await expect(ordersService.findOne(nonExistentId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(ordersService.findOne(nonExistentId)).rejects.toThrow(
        `Order with ID "${nonExistentId}" not found.`,
      );
    });
  });
});
