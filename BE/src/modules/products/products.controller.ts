import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { CreateProductDto, ProductResponse } from './products.schema';
import { ProductsService } from './products.service';

@Controller('products')
@ApiExtraModels(ProductResponse)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({
    summary: 'Creates a new Product resource.',
  })
  @ApiCreatedResponse({
    description: 'Returned when a new Product was created successfully.',
    schema: {
      $ref: getSchemaPath(ProductResponse),
    },
  })
  @ApiBadRequestResponse({
    description:
      'Returned when one or more parameters failed validation during Product creation',
  })
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponse> {
    return await this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieves a list of all existing Product resources.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all products.',
    schema: {
      type: 'array',
      items: {
        $ref: getSchemaPath(ProductResponse),
      },
    },
  })
  async findAll(): Promise<ProductResponse[]> {
    return await this.productsService.findAll();
  }
}
