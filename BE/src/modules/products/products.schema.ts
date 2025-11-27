import { createZodDto } from 'nestjs-zod';
import { BaseProductSchema, CreateProductSchema } from 'project-shared';

export class ProductResponse extends createZodDto(BaseProductSchema) {}
export class CreateProductDto extends createZodDto(CreateProductSchema) {}
