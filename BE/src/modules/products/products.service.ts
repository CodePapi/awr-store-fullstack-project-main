import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

import type { Product } from 'src/common/generated/prisma-client';
import { CreateProductDto } from './products.schema';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const created = await this.prisma.product.create({
      data: createProductDto,
    });

    return created;
  }

  // Implementation for GET /products
  async findAll(): Promise<Product[]> {
    return await this.prisma.product.findMany();
  }

  // --- NEW METHOD REQUIRED FOR ORDERS SERVICE ---
  /**
   * Retrieves multiple products by their IDs.
   * Crucial for validating inventory and getting prices during order creation.
   */
  async findManyByIds(ids: number[]): Promise<Product[]> {
    return await this.prisma.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  // May be implemented (kept for completeness, renamed to match controller convention)
  // @ts-ignore
  async findOne(): Promise<Product> {}

  // May be implemented
  // @ts-ignore
  async updateOne(): Promise<Product> {}

  // May be implemented.
  //@ts-ignore
  async deleteOne(): Promise<GenericOperationResponse> {}
}
