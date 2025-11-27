import { z } from "zod";

// Request
export const OrderRequestItemSchema = z.object({
  id: z.number().int().positive(),
  quantity: z.number().int().positive().min(1),
});

export const CreateOrderSchema = z.object({
  customerId: z.string().uuid(),
  products: z.array(OrderRequestItemSchema).min(1),
});

// Response
export const OrderResponseItemSchema = z.object({
  id: z.number().int().positive(),
  quantity: z.number().int().positive(),
  name: z.string().nonempty(),
});

export const OrderResponseSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid(),
  orderCreatedDate: z.string().pipe(z.coerce.date()),
  orderUpdatedDate: z.string().pipe(z.coerce.date()),
  status: z.enum(["PENDING", "DISPATCHED", "DELIVERED", "CANCELED"]),
  orderTotal: z.number().min(0),
  products: z.array(OrderResponseItemSchema),
});

// Types for FE usage
export type CreateOrder = z.infer<typeof CreateOrderSchema>;
export type OrderResponse = z.infer<typeof OrderResponseSchema>;
