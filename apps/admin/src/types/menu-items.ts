import z from "zod";

export enum Metrics {
	Piece = "Piece",
	Kg = "Kg",
	Litre = "Litre",
}

const menuBaseSchema = z.object({
	name: z
		.string()
		.nonempty({ error: "Name is required" })
		.max(100, { error: "Name must be at most 100 characters long" }),
	description: z
		.string()
		.nonempty({ error: "Description is required" })
		.max(500, {
			error: "Description must be at most 500 characters long",
		}),
	price: z.number().positive({ error: "Price must be positive" }),
	image: z.string().default("/unknown.png"),
	category: z.string().nonempty({ error: "Category is required" }),
	isVeg: z.boolean(),
	qtyPerUnit: z
		.number()
		.positive({ error: "Quantity Per Unit must be positive" }),
	metrics: z.nativeEnum(Metrics, { error: "Metrics is required" }),
	order: z.number().int().default(0),
});

export const menuItem = menuBaseSchema.extend({
	id: z.string(),
});

export const menuItemFormSchema = menuBaseSchema.extend({
	id: z.string().optional(),
});

export type MenuItem = z.infer<typeof menuItem>;
