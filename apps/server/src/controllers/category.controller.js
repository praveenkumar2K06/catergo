import Category from "../models/Category.js";
import MenuItem from "../models/MenuItem.js";
import { toPlain } from "../lib/serialize.js";

export const getAllCategories = async (req, res) => {
    const adminId = req.params.id;

    try {
        const categories = await Category.find({ adminId }).sort({ order: 1 });

        res.status(200).json({
            success: true,
            data: categories.map(toPlain),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching categories",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

export const createCategory = async (req, res) => {
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

        const existingCategory = await Category.findOne({
            adminId: req.admin.id,
            name: { $regex: `^${name}$`, $options: "i" },
        });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "Category with this name already exists",
            });
        }

        const highestOrder = await Category.findOne({ adminId: req.admin.id })
            .sort({ order: -1 })
            .select("order");

        const newCategory = await Category.create({
            name,
            icon: icon || "🍽️",
            order: order ?? (highestOrder?.order ?? -1) + 1,
            adminId: req.admin.id,
        });

        res.status(201).json({
            success: true,
            data: toPlain(newCategory),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating category",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const { id } = req.params;
        const { name, icon, order } = req.body;

        const existingCategory = await Category.findOne({
            _id: id,
            adminId: req.admin.id,
        });

        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        if (name && name !== existingCategory.name) {
            const duplicateCategory = await Category.findOne({
                adminId: req.admin.id,
                name: { $regex: `^${name}$`, $options: "i" },
                _id: { $ne: id },
            });

            if (duplicateCategory) {
                return res.status(400).json({
                    success: false,
                    message: "Category with this name already exists",
                });
            }
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            {
                ...(name && { name }),
                ...(icon && { icon }),
                ...(order !== undefined && { order }),
            },
            { new: true },
        );

        res.status(200).json({
            success: true,
            data: toPlain(updatedCategory),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating category",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const { id } = req.params;

        const existingCategory = await Category.findOne({
            _id: id,
            adminId: req.admin.id,
        });

        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        const menuItemsCount = await MenuItem.countDocuments({
            adminId: req.admin.id,
            category: existingCategory.name,
        });

        if (menuItemsCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category. ${menuItemsCount} menu item(s) are using this category.`,
            });
        }

        await Category.deleteOne({ _id: id });

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
