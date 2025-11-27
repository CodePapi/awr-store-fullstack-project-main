import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// Import all necessary models and types from the generated client
import {
  Prisma,
  PrismaClient,
  Product,
} from 'src/common/generated/prisma-client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import { CreateOrderDto, OrderResponse } from './orders.schema';

// Define a type for the transactional client, which is the most reliable way
// to ensure the compiler knows about the 'order' and 'product' models inside $transaction.
type TransactionClient = Prisma.TransactionClient;

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productsService: ProductsService,
  ) {}

  /**
   * Core implementation for POST /orders.
   * Executes a transaction to ensure data integrity: check inventory,
   * create Order, create OrderItems, and update Product counts.
   * @param dto The incoming CreateOrderDto payload.
   */
  async placeOrder(dto: CreateOrderDto): Promise<OrderResponse> {
    // 1. Get product data and calculate total
    const productIds = dto.products.map((p) => p.id);

    // Use the correctly defined method from ProductsService
    const productsInDb: Product[] =
      await this.productsService.findManyByIds(productIds);

    if (productsInDb.length !== productIds.length) {
      // Check if all requested products actually exist
      throw new BadRequestException(
        'One or more products specified in the order do not exist.',
      );
    }

    const productMap: Map<number, Product> = new Map(
      productsInDb.map((p) => [p.id, p]),
    );

    let orderTotal = 0;
    // FIX: Use the correct type for the simple array of items destined for 'createMany'
    const orderItemsToCreate: Prisma.OrderItemCreateManyOrderInput[] = [];

    // 2. Validate inventory and prepare items
    for (const item of dto.products) {
      const product = productMap.get(item.id);

      if (!product) {
        // Should be caught by the length check above, but safer to include
        throw new BadRequestException(`Product ID ${item.id} not found.`);
      }

      // CRITICAL: Check for insufficient inventory
      if (product.availableCount < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product "${product.name}". Available: ${product.availableCount}, Requested: ${item.quantity}.`,
        );
      }

      // Calculate item total using the current price
      orderTotal += product.price * item.quantity;

      // Prepare data for the OrderItem creation
      // FIX: Correct data structure for the OrderItemCreateManyOrderInput type
      orderItemsToCreate.push({
        productId: item.id,
        quantity: item.quantity,
        priceAtOrder: product.price, // Storing price for historical integrity
      });
    }

    // 3. Execute the Transaction
    // All database operations below must succeed or fail together
    const newOrder = await this.prisma.$transaction(
      async (tx: TransactionClient) => {
        // 3a. Create the Order
        const createdOrder = await tx.order.create({
          data: {
            customerId: dto.customerId,
            orderTotal: orderTotal,
            status: 'DISPATCHED',
            orderItems: {
              createMany: {
                // The data array is correctly structured
                data: orderItemsToCreate,
              },
            },
          },
          include: { orderItems: true },
        });

        // 3b. Update Product Inventory (Decrement availableCount)
        for (const item of dto.products) {
          await tx.product.update({
            where: { id: item.id },
            data: {
              availableCount: {
                decrement: item.quantity,
              },
            },
          });
        }

        return createdOrder;
      },
    );

    // 4. Return the structured response
    // The order was created successfully, so we are guaranteed to get a response object
    // We assert the type here to satisfy the promise return type.
    return this.mapOrderToResponse(newOrder.id) as Promise<OrderResponse>;
  }

  /**
   * Retrieves an Order by ID and formats it for the OrderResponse DTO.
   * @param id The UUID of the order.
   */
  async findOne(id: string): Promise<OrderResponse> {
    const order = await this.mapOrderToResponse(id);

    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found.`);
    }

    return order;
  }

  /**
   * Helper function to fetch and structure order data for the response DTO.
   */
  private async mapOrderToResponse(
    orderId: string,
  ): Promise<OrderResponse | null> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            product: {
              select: { name: true, id: true },
            },
          },
        },
      },
    });

    if (!order) {
      return null;
    }

    // Map to the required OrderResponse shape
    return {
      id: order.id,
      customerId: order.customerId,
      // FIX: Pass the raw Date object, as the Zod DTO (OrderResponse) expects a Date object here.
      orderCreatedDate: order.orderCreatedDate,
      orderUpdatedDate: order.orderUpdatedDate,
      status: order.status,
      orderTotal: order.orderTotal,
      products: order.orderItems.map((item) => ({
        id: item.productId,
        quantity: item.quantity,
        name: item.product.name,
      })),
    };
  }
}
