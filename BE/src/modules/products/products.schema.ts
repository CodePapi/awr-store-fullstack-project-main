import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const BaseProductSchema = z.object({
  id: z.number().positive().describe('Unique product id'),
  name: z.string().nonempty().trim().describe('Product name'),
  description: z.string().trim().describe('Product description'),
  price: z.number().min(0).describe('Product price'),
  availableCount: z
    .number()
    .min(0)
    .describe('Product quantity available for fulfillment'),
  createdAt: z
    .string()
    .pipe(z.coerce.date())
    .describe('Product creation timestamp'),
  updatedAt: z
    .string()
    .pipe(z.coerce.date())
    .describe('Product last updated timestamp'),
});

export class ProductResponse extends createZodDto(BaseProductSchema) {}

export const CreateProductSchema = BaseProductSchema.pick({
  name: true,
  description: true,
  price: true,
  availableCount: true,
});
export class CreateProductDto extends createZodDto(CreateProductSchema) {}
