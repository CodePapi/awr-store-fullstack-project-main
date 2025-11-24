import { Body, Controller, Post, Get, Param, ParseUUIDPipe, NotFoundException, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { CreateOrderDto, OrderResponse } from './orders.schema';
import { OrdersService } from './orders.service';

@Controller('orders')
@ApiExtraModels(OrderResponse)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // --- POST /orders: Place a new order (Transactional Logic) ---
  @Post()
  @ApiOperation({
    summary: 'Places a new order, validating inventory and executing the transaction.',
  })
  @ApiCreatedResponse({
    description: 'Returned when a new Order was created successfully.',
    schema: { $ref: getSchemaPath(OrderResponse) },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Returned when validation fails or inventory is insufficient.',
  })
  async create(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderResponse> {
    // The service handles validation, transaction, and inventory update
    return await this.ordersService.placeOrder(createOrderDto);
  }

  // --- GET /orders/{id}: Retrieve order details ---
  @Get(':id')
  @ApiOperation({
    summary: 'Retrieves the details of a specific order by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the details of the specified order.',
    schema: { $ref: getSchemaPath(OrderResponse) },
  })
  @ApiResponse({
    status: 404,
    description: 'Returned when an order with the given ID does not exist.',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<OrderResponse> {
    const order = await this.ordersService.findOne(id);

    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found.`);
    }

    return order;
  }
}