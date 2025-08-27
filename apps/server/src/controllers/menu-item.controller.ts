import type { Request, Response } from "express";
import type { Prisma } from "prisma/generated/client";
import prisma from "../client";

export const getAllMenuItems = async (req: Request, res: Response) => {
	try {
		const { category, isVeg, search } = req.query;

		const where: Prisma.MenuItemWhereInput = {};

		// Filter by category
		if (category && typeof category === "string") {
			where.category = {
				equals: category,
				mode: "insensitive",
			};
		}

		// Filter by vegetarian
		if (isVeg !== undefined) {
			where.isVeg = isVeg === "true";
		}

		// Search by name or description
		if (search && typeof search === "string") {
			where.OR = [
				{
					name: {
						contains: search,
						mode: "insensitive",
					},
				},
				{
					description: {
						contains: search,
						mode: "insensitive",
					},
				},
			];
		}

		const menuItems = await prisma.menuItem.findMany({
			where,
			orderBy: {
				createdAt: "desc",
			},
		});

		res.status(200).json({
			success: true,
			data: menuItems,
			count: menuItems.length,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching menu items",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};
