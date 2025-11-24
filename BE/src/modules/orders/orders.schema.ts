import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// --- 1. Order Item Schemas (For Request Payload) ---

/**
 * Defines the shape of a single product item in the POST /orders request body.
 */
export const OrderRequestItemSchema = z.object({
  id: z.number().int().positive().describe('The ID of the product being ordered.'),
  quantity: z.number().int().positive().min(1).describe('The quantity of the product to order.'),
});

/**
 * Defines the shape of the entire POST /orders request body.
 */
export const CreateOrderSchema = z.object({
  customerId: z.string().uuid().describe('The UUID of the customer placing the order.'),
  products: z.array(OrderRequestItemSchema)
    .min(1, 'An order must contain at least one product.')
    .describe('An array of products and quantities being ordered.'),
});

export class CreateOrderDto extends createZodDto(CreateOrderSchema) {}


// --- 2. Order Response Schemas (For GET /orders/{id} Response) ---

/**
 * Defines the shape of a single product item returned in the order response.
 * Note: This includes the product name, which needs to be fetched during retrieval.
 */
export const OrderResponseItemSchema = z.object({
  id: z.number().int().positive().describe('The ID of the product.'),
  quantity: z.number().int().positive().describe('The quantity ordered.'),
  name: z.string().nonempty().describe('The name of the product.'),
});

/**
 * Defines the shape of the final GET /orders/{id} response.
 */
export const OrderResponseSchema = z.object({
  id: z.string().uuid().describe('The unique identifier of the order.'),
  customerId: z.string().uuid().describe('The UUID of the customer who placed the order.'),
  orderCreatedDate: z
    .string()
    .pipe(z.coerce.date())
    .describe('The timestamp when the order was created.'),
  orderUpdatedDate: z
    .string()
    .pipe(z.coerce.date())
    .describe('The timestamp when the order was last updated.'),
  status: z.enum(['PENDING', 'DISPATCHED', 'DELIVERED', 'CANCELED']).describe('The current status of the order.'),
  orderTotal: z.number().min(0).describe('The total computed price of the order.'),
  products: z.array(OrderResponseItemSchema).describe('The list of items included in the order.'),
});

export class OrderResponse extends createZodDto(OrderResponseSchema) {}