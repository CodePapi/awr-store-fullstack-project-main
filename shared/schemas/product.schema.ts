import { z } from "zod";

/**
 * Base product schema used across FE & BE.
 * Includes all fields a product can have in the system.
 */
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

/**
 * Schema for creating a product.
 * Only includes fields required on creation.
 */
export const CreateProductSchema = BaseProductSchema.pick({
	name: true,
	description: true,
	price: true,
	availableCount: true,
});

/**
 * Schema for updating a product.
 * Partial because all fields are optional on update.
 */
export const UpdateProductSchema = CreateProductSchema.partial();

/**
 * Types generated automatically from schemas.
 * These are what FE & BE will use.
 */
export type Product = z.infer<typeof BaseProductSchema>;
export type CreateProduct = z.infer<typeof CreateProductSchema>;
export type UpdateProduct = z.infer<typeof UpdateProductSchema>;
