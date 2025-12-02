import type { Request, Response } from "express";
import type { AuthRequest } from "@/types/auth-request";
import prisma from "../client";

export const getAllCategories = async (req: Request, res: Response) => {
	const adminId = req.params.id;

	try {
		const categories = await prisma.category.findMany({
			where: { adminId },
			orderBy: { order: "asc" },
		});

		res.status(200).json({
			success: true,
			data: categories,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching categories",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

export const createCategory = async (req: AuthRequest, res: Response) => {
	try {
		if (!req.admin) {
			return res.status(401).json({
				success: false,
				message: "Authentication required",
			});
		}

		const { name, icon, order } = req.body;

		if (!name) {
			return res.status(400).json({
				success: false,
				message: "Category name is required",
			});
		}

		const existingCategory = await prisma.category.findFirst({
			where: {
				adminId: req.admin.id,
				name: {
					equals: name,
					mode: "insensitive",
				},
			},
		});

		if (existingCategory) {
			return res.status(400).json({
				success: false,
				message: "Category with this name already exists",
			});
		}

		// Get the highest order number for the admin's categories
		const highestOrder = await prisma.category.findFirst({
			where: { adminId: req.admin.id },
			orderBy: { order: "desc" },
			select: { order: true },
		});

		const newCategory = await prisma.category.create({
			data: {
				name,
				icon: icon || "🍽️",
				order: order ?? (highestOrder?.order ?? -1) + 1,
				admin: { connect: { id: req.admin.id } },
			},
		});

		res.status(201).json({
			success: true,
			data: newCategory,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error creating category",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
	try {
		if (!req.admin) {
			return res.status(401).json({
				success: false,
				message: "Authentication required",
			});
		}

		const { id } = req.params;
		const { name, icon, order } = req.body;

		// Check if category exists and belongs to this admin
		const existingCategory = await prisma.category.findFirst({
			where: {
				id,
				adminId: req.admin.id,
			},
		});

		if (!existingCategory) {
			return res.status(404).json({
				success: false,
				message: "Category not found",
			});
		}

		// If name is being changed, check for duplicates
		if (name && name !== existingCategory.name) {
			const duplicateCategory = await prisma.category.findFirst({
				where: {
					adminId: req.admin.id,
					name: {
						equals: name,
						mode: "insensitive",
					},
					id: { not: id },
				},
			});

			if (duplicateCategory) {
				return res.status(400).json({
					success: false,
					message: "Category with this name already exists",
				});
			}
		}

		const updatedCategory = await prisma.category.update({
			where: { id },
			data: {
				...(name && { name }),
				...(icon && { icon }),
				...(order !== undefined && { order }),
			},
		});

		res.status(200).json({
			success: true,
			data: updatedCategory,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error updating category",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
	try {
		if (!req.admin) {
			return res.status(401).json({
				success: false,
				message: "Authentication required",
			});
		}

		const { id } = req.params;

		// Check if category exists and belongs to this admin
		const existingCategory = await prisma.category.findFirst({
			where: {
				id,
				adminId: req.admin.id,
			},
		});

		if (!existingCategory) {
			return res.status(404).json({
				success: false,
				message: "Category not found",
			});
		}

		// Check if there are menu items using this category
		const menuItemsCount = await prisma.menuItem.count({
			where: {
				adminId: req.admin.id,
				category: existingCategory.name,
			},
		});

		if (menuItemsCount > 0) {
			return res.status(400).json({
				success: false,
				message: `Cannot delete category. ${menuItemsCount} menu item(s) are using this category.`,
			});
		}

		await prisma.category.delete({
			where: { id },
		});

		res.status(200).json({
			success: true,
			message: "Category deleted successfully",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error deleting category",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};
