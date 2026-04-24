import MenuItem from "../models/MenuItem.js";
import { toPlain } from "../lib/serialize.js";

export const getAllMenuItems = async (req, res) => {
    const adminId = req.params.id;

    try {
        const { category, isVeg, search, page = 0, pageSize = 10 } = req.query;
        const where = { adminId };

        if (category && typeof category === "string") {
            where.category = { $regex: `^${category}$`, $options: "i" };
        }

        if (isVeg !== undefined) {
            where.isVeg = isVeg === "true";
        }

        if (search && typeof search === "string") {
            where.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        const pageNumber = Number.parseInt(page, 10);
        const limit = Number.parseInt(pageSize, 10);
        const skip = pageNumber * limit;

        const menuItems = await MenuItem.find(where)
            .sort({ order: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalItems = await MenuItem.countDocuments(where);

        res.status(200).json({
            success: true,
            data: menuItems.map(toPlain),
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

export const createMenuItem = async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const newMenuItem = await MenuItem.create({
            ...req.body,
            adminId: req.admin.id,
        });

        res.status(201).json({
            success: true,
            data: toPlain(newMenuItem),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating menu item",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

export const updateMenuItem = async (req, res) => {
    const menuItemId = req.params.id;

    try {
        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const updatedMenuItem = await MenuItem.findByIdAndUpdate(menuItemId, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: toPlain(updatedMenuItem),
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

export const deleteMenuItem = async (req, res) => {
    const menuItemId = req.params.id;

    try {
        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        await MenuItem.deleteOne({ _id: menuItemId });

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
