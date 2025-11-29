import { NotFoundException } from '@nestjs/common';
import { Mocked, TestBed } from '@suites/unit';
import { OrdersController } from './orders.controller';
import { CreateOrderDto, OrderResponse } from './orders.schema';
import { OrdersService } from './orders.service';

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
    const { unit, unitRef } =
      await TestBed.solitary(OrdersController).compile();

    ordersController = unit;
    ordersService = unitRef.get(OrdersService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call ordersService.placeOrder and return the created order', async () => {
      ordersService.placeOrder.mockResolvedValue(mockOrderResponse);

      const result = await ordersController.create(mockCreateOrderDto);

      expect(ordersService.placeOrder).toHaveBeenCalledWith(mockCreateOrderDto);
      expect(result).toEqual(mockOrderResponse);
    });
  });

  describe('findOne', () => {
    it('should call ordersService.findOne and return the order if found', async () => {
      ordersService.findOne.mockResolvedValue(mockOrderResponse);

      const result = await ordersController.findOne(mockOrderId);
      expect(ordersService.findOne).toHaveBeenCalledWith(mockOrderId);
      expect(result).toEqual(mockOrderResponse);
    });

    it('should handle the string ID parameter passed by ParseUUIDPipe', async () => {
      ordersService.findOne.mockResolvedValue(mockOrderResponse);

      await ordersController.findOne(mockOrderId);
      expect(ordersService.findOne).toHaveBeenCalledWith(mockOrderId);
    });
  });
});
