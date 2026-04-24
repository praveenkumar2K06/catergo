import CartItem from "../models/CartItem.js";
import Event from "../models/Event.js";
import User from "../models/User.js";
import { toPlain } from "../lib/serialize.js";

const attachRelations = async (users) => {
    return Promise.all(
        users.map(async (userDoc) => {
            const user = toPlain(userDoc);
            const eventDoc = await Event.findOne({ userId: user.id });
            const cartItemDocs = await CartItem.find({ userId: user.id }).populate("menuItemId");

            user.event = toPlain(eventDoc);
            user.cartItems = cartItemDocs.map((cartItemDoc) => ({
                ...toPlain(cartItemDoc),
                menuItem: cartItemDoc.menuItemId ? toPlain(cartItemDoc.menuItemId) : null,
            }));

            return user;
        }),
    );
};

export const getUsersV2 = async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const { search, page = 0, pageSize = 10 } = req.query;
        const where = { adminId: req.admin.id };

        if (search && typeof search === "string") {
            where.$or = [{ name: { $regex: search, $options: "i" } }];
        }

        const pageNumber = Number.parseInt(page, 10);
        const limit = Number.parseInt(pageSize, 10);
        const skip = pageNumber * limit;

        const users = await User.find(where)
            .sort({ selectedDate: -1 })
            .skip(skip)
            .limit(limit);

        const totalItems = await User.countDocuments(where);

        res.status(200).json({
            success: true,
            data: await attachRelations(users),
            pagination: {
                page: pageNumber,
                pageSize: limit,
                totalPages: Math.ceil(totalItems / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

export const getUsers = async (_req, res) => {
    try {
        const users = await User.find().sort({ selectedDate: -1 });
        res.status(200).json({
            success: true,
            data: users.map(toPlain),
            count: users.length,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

export const createUser = async (req, res) => {
    try {
        const {
            name,
            phone,
            address,
            pincode,
            numberOfPeople,
            selectedDate,
            adminId,
        } = req.body;

        if (
            !name ||
            !phone ||
            !address ||
            !pincode ||
            !numberOfPeople ||
            !selectedDate ||
            !adminId
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const newUser = await User.create({
            name,
            phone,
            address,
            pincode,
            numberOfPeople,
            selectedDate,
            adminId,
        });

        res.status(201).json(toPlain(newUser));
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Failed to create user" });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, address, pincode, numberOfPeople, selectedDate } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                name,
                phone,
                address,
                pincode,
                numberOfPeople,
                selectedDate,
            },
            { new: true, runValidators: true },
        );

        res.status(200).json(toPlain(updatedUser));
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Failed to update user" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        await User.deleteOne({ _id: id });

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Failed to delete user" });
    }
};
