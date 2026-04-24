import CartItem from "../models/CartItem.js";
import { toPlain } from "../lib/serialize.js";

export const createCartItem = async (req, res) => {
    try {
        const { userId, menuId, quantity } = req.body;

        if (!userId || !menuId || !quantity) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newCartItem = await CartItem.create({
            userId,
            menuItemId: menuId,
            quantity,
        });

        res.status(201).json(toPlain(newCartItem));
    } catch (error) {
        console.error("Error creating cart item:", error);
        res.status(500).json({ error: "Failed to create cart item" });
    }
};

export const updateCartQuantity = async (req, res) => {
    try {
        const { id, quantity } = req.body;

        if (!id || !quantity) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const existingCartItem = await CartItem.findById(id);

        if (!existingCartItem) {
            return res.status(404).json({ error: "Cart item not found" });
        }

        const updatedCartItem = await CartItem.findOneAndUpdate(
            { _id: id, userId: existingCartItem.userId },
            { quantity },
            { new: true },
        );

        res.status(200).json(toPlain(updatedCartItem));
    } catch (error) {
        console.error("Error updating cart item:", error);
        res.status(500).json({ error: "Failed to update cart item" });
    }
};

export const deleteCartItem = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const existingCartItem = await CartItem.findById(id);

        if (!existingCartItem) {
            return res.status(404).json({ error: "Cart item not found" });
        }

        await CartItem.deleteOne({ _id: id, userId: existingCartItem.userId });

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting cart item:", error);
        res.status(500).json({ error: "Failed to delete cart item" });
    }
};
