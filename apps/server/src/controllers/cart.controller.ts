import type { Request, Response } from "express";
import prisma from "../client";

export const createCartItem = async (req: Request, res: Response) => {
	try {
		const { userId, menuId, quantity } = req.body;

		if (!userId || !menuId || !quantity) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		const newCartItem = await prisma.cartItem.create({
			data: {
				userId,
				menuItemId: menuId,
				quantity,
			},
		});

		res.status(201).json(newCartItem);
	} catch (error) {
		console.error("Error creating cart item:", error);
		res.status(500).json({ error: "Failed to create cart item" });
	}
};

export const updateCartQuantity = async (req: Request, res: Response) => {
	try {
		const { id, quantity } = req.body;

		if (!id || !quantity) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		const existingCartItem = await prisma.cartItem.findUnique({
			where: { id },
		});

		if (!existingCartItem) {
			return res.status(404).json({ error: "Cart item not found" });
		}

		const updatedCartItem = await prisma.cartItem.update({
			where: { id, userId: existingCartItem.userId },
			data: { quantity },
		});

		res.status(200).json(updatedCartItem);
	} catch (error) {
		console.error("Error updating cart item:", error);
		res.status(500).json({ error: "Failed to update cart item" });
	}
};

export const deleteCartItem = async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	try {
		const existingCartItem = await prisma.cartItem.findUnique({
			where: { id },
		});

		if (!existingCartItem) {
			return res.status(404).json({ error: "Cart item not found" });
		}

		await prisma.cartItem.delete({
			where: { id, userId: existingCartItem.userId },
		});

		res.status(204).send();
	} catch (error) {
		console.error("Error deleting cart item:", error);
		res.status(500).json({ error: "Failed to delete cart item" });
	}
};
