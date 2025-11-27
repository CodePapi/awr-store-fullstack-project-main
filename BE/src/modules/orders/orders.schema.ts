import { createZodDto } from 'nestjs-zod';
import { CreateOrderSchema, OrderResponseSchema } from 'project-shared';

export class CreateOrderDto extends createZodDto(CreateOrderSchema) {}
export class OrderResponse extends createZodDto(OrderResponseSchema) {}
