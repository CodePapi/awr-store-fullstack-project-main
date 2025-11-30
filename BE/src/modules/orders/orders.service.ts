import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Product } from '../../common/generated/prisma-client';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import { CreateOrderDto, OrderResponse } from './orders.schema';

type TransactionClient = Prisma.TransactionClient & {
  order: Prisma.OrderDelegate;
  product: Prisma.ProductDelegate;
};

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productsService: ProductsService,
  ) {}

  async placeOrder(dto: CreateOrderDto): Promise<OrderResponse> {
    const productIds = dto.products.map((p) => p.id);
    const productsInDb: Product[] =
      await this.productsService.findManyByIds(productIds);

    if (productsInDb.length !== productIds.length) {
      throw new BadRequestException(
        'One or more products specified in the order do not exist.',
      );
    }

    const productMap: Map<number, Product> = new Map(
      productsInDb.map((p) => [p.id, p]),
    );

    let orderTotal = 0;
    const orderItemsToCreate: Prisma.OrderItemCreateManyOrderInput[] = [];

    for (const item of dto.products) {
      const product = productMap.get(item.id);

      if (!product) {
        throw new BadRequestException(`Product ID ${item.id} not found.`);
      }

      if (product.availableCount < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product "${product.name}". Available: ${product.availableCount}, Requested: ${item.quantity}.`,
        );
      }

      orderTotal += product.price * item.quantity;
      orderItemsToCreate.push({
        productId: item.id,
        quantity: item.quantity,
        priceAtOrder: product.price,
      });
    }

    const newOrder = await this.prisma.$transaction(
      async (tx: TransactionClient) => {
        const createdOrder = await tx.order.create({
          data: {
            customerId: dto.customerId,
            orderTotal: orderTotal,
            status: 'DISPATCHED',
            orderItems: {
              createMany: {
                data: orderItemsToCreate,
              },
            },
          },
          include: { orderItems: true },
        });

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

    return this.mapOrderToResponse(newOrder.id) as Promise<OrderResponse>;
  }

  async findOne(id: string): Promise<OrderResponse> {
    const order = await this.mapOrderToResponse(id);

    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found.`);
    }

    return order;
  }

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

    return {
      id: order.id,
      customerId: order.customerId,
      orderCreatedDate: order.orderCreatedDate,
      orderUpdatedDate: order.orderUpdatedDate,
      status: order.status,
      orderTotal: order.orderTotal,
      products: order.orderItems.map(
        (item: {
          productId: number;
          quantity: number;
          product: { name: string };
        }) => ({
          id: item.productId,
          quantity: item.quantity,
          name: item.product.name,
        }),
      ),
    };
  }
}
