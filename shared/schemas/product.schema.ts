import { z } from "zod";


export const BaseProductSchema = z.object({
	id: z.number().positive().describe("Unique product ID"),
	name: z.string().nonempty().trim().describe("Product name"),
	description: z.string().trim().describe("Product description"),
	price: z.number().min(0).describe("Product price"),
	availableCount: z
		.number()
		.min(0)
		.describe("Quantity available for purchase or fulfillment"),
	createdAt: z
		.string()
		.pipe(z.coerce.date())
		.describe("Product creation timestamp"),
	updatedAt: z
		.string()
		.pipe(z.coerce.date())
		.describe("Product last updated timestamp"),
});


export const CreateProductSchema = BaseProductSchema.pick({
	name: true,
	description: true,
	price: true,
	availableCount: true,
});


export const UpdateProductSchema = CreateProductSchema.partial();
export type Product = z.infer<typeof BaseProductSchema>;
export type CreateProduct = z.infer<typeof CreateProductSchema>;
export type UpdateProduct = z.infer<typeof UpdateProductSchema>;
