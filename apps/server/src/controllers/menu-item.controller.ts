import type { Request, Response } from "express";
import type { Prisma } from "prisma/generated/client";
import prisma from "../client";

export const getAllMenuItems = async (req: Request, res: Response) => {
	try {
		const { category, isVeg, search, page = 0, pageSize = 10 } = req.query;

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

		// Pagination
		const pageNumber = Number.parseInt(page as string, 10);
		const limit = Number.parseInt(pageSize as string, 10);
		const skip = pageNumber * limit;
		const take = limit;

		const menuItems = await prisma.menuItem.findMany({
			where,
			orderBy: {
				createdAt: "desc",
			},
			skip,
			take,
		});

		const totalItems = await prisma.menuItem.count({ where });

		res.status(200).json({
			success: true,
			data: menuItems,
			total: totalItems,
			pagination: {
				page: pageNumber,
				pageSize: limit,
				totalPages: Math.ceil(totalItems / limit),
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching menu items",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

export const createMenuItem = async (req: Request, res: Response) => {
	try {
		const menuItemData: Prisma.MenuItemCreateInput = req.body;

		const newMenuItem = await prisma.menuItem.create({
			data: menuItemData,
		});

		res.status(201).json({
			success: true,
			data: newMenuItem,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error creating menu item",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

export const updateMenuItem = async (req: Request, res: Response) => {
	const menuItemId = req.params.id;
	const menuItemData: Prisma.MenuItemUpdateInput = req.body;

	try {
		const updatedMenuItem = await prisma.menuItem.update({
			where: { id: menuItemId },
			data: menuItemData,
		});

		res.status(200).json({
			success: true,
			data: updatedMenuItem,
		});
	} catch (error) {
		console.error("Error updating menu item:", error);
		res.status(500).json({
			success: false,
			message: "Error updating menu item",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

export const deleteMenuItem = async (req: Request, res: Response) => {
	const menuItemId = req.params.id;

	try {
		await prisma.menuItem.delete({
			where: { id: menuItemId },
		});

		res.status(204).json({
			success: true,
		});
	} catch (error) {
		console.error("Error deleting menu item:", error);
		res.status(500).json({
			success: false,
			message: "Error deleting menu item",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};
