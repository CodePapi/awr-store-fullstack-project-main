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

  async findAll(): Promise<Product[]> {
    return await this.prisma.product.findMany();
  }

  async findManyByIds(ids: number[]): Promise<Product[]> {
    return await this.prisma.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
