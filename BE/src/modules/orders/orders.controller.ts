import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
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

  @Post()
  @ApiOperation({
    summary:
      'Places a new order, validating inventory and executing the transactions.',
  })
  @ApiCreatedResponse({
    description: 'Returned when a new Order was created successfully.',
    schema: { $ref: getSchemaPath(OrderResponse) },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Returned when validation fails or inventory is insufficient.',
  })
  async create(@Body() createOrderDto: CreateOrderDto): Promise<OrderResponse> {
    return await this.ordersService.placeOrder(createOrderDto);
  }

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
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<OrderResponse> {
    const order = await this.ordersService.findOne(id);

    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found.`);
    }

    return order;
  }
}
