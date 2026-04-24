import { endOfDay, endOfMonth, startOfDay, startOfMonth } from "date-fns";
import CartItem from "../models/CartItem.js";
import Event from "../models/Event.js";
import Settings from "../models/Settings.js";
import User from "../models/User.js";
import { toPlain } from "../lib/serialize.js";

const buildDateFilter = (month) => {
    const parsedMonth = Number(month);
    const currentDate = Number.isFinite(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12
        ? new Date(new Date().getFullYear(), parsedMonth - 1)
        : new Date();

    return {
        $gte: startOfMonth(currentDate),
        $lte: endOfMonth(currentDate),
    };
};

export const getEvents = async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const { month } = req.query;
        const events = await Event.find({
            adminId: req.admin.id,
            date: buildDateFilter(month),
        }).sort({ date: 1 });

        res.status(200).json({
            success: true,
            data: events.map(toPlain),
        });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Failed to fetch events" });
    }
};

export const getTodaysEvents = async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const today = new Date();
        const start = startOfDay(today);
        const end = endOfDay(today);

        const events = await Event.find({
            adminId: req.admin.id,
            date: { $gte: start, $lte: end },
        }).sort({ date: 1 });

        res.status(200).json({
            success: true,
            data: events.map(toPlain),
        });
    } catch (error) {
        console.error("Error fetching today's events:", error);
        res.status(500).json({ error: "Failed to fetch today's events" });
    }
};

export const createEvent = async (req, res) => {
    try {
        const { userId, name, date, adminId, description } = req.body;

        if (!adminId) {
            return res.status(403).json({
                success: false,
                message: "Admin ID is required",
            });
        }

        const settings = await Settings.findOne({ adminId });

        if (settings?.enableDailyOrderLimit && settings.maxOrdersPerDay) {
            const eventDate = new Date(date);
            const dayStart = startOfDay(eventDate);
            const dayEnd = endOfDay(eventDate);

            const ordersForDay = await Event.countDocuments({
                adminId,
                date: {
                    $gte: dayStart,
                    $lte: dayEnd,
                },
            });

            if (ordersForDay >= settings.maxOrdersPerDay) {
                return res.status(400).json({
                    success: false,
                    error: "Order limit reached",
                    message: `Maximum ${settings.maxOrdersPerDay} orders per day allowed. Please select a different date.`,
                });
            }
        }

        const newEvent = await Event.findOneAndUpdate(
            { userId },
            {
                name,
                date,
                ...(description && { description }),
                $setOnInsert: { userId, adminId },
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true,
            },
        );

        res.status(201).json(toPlain(newEvent));
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ error: "Failed to create event" });
    }
};

export const getEventById = async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const { id } = req.params;

        const eventDoc = await Event.findOne({ _id: id, adminId: req.admin.id });

        if (!eventDoc) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        const userDoc = await User.findById(eventDoc.userId);
        const cartItemDocs = userDoc
            ? await CartItem.find({ userId: userDoc._id }).populate("menuItemId")
            : [];

        const event = toPlain(eventDoc);
        const user = toPlain(userDoc);

        if (user) {
            user.cartItems = cartItemDocs.map((cartItemDoc) => {
                const cartItem = toPlain(cartItemDoc);
                const menuItem = cartItemDoc.menuItemId ? toPlain(cartItemDoc.menuItemId) : null;

                return {
                    ...cartItem,
                    menuItem,
                };
            });
        }

        event.user = user;

        res.status(200).json({
            success: true,
            data: event,
        });
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ error: "Failed to fetch event" });
    }
};
