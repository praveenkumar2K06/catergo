import { endOfDay, startOfDay } from "date-fns";
import Event from "../models/Event.js";
import Settings from "../models/Settings.js";
import { toPlain } from "../lib/serialize.js";

const defaultSettings = (adminId) => ({
    maxOrdersPerDay: 50,
    enableDailyOrderLimit: true,
    bulkOrderDiscount: 10,
    bulkOrderMinPersons: 5,
    hidePrices: false,
    blockedDates: [],
    tax: 0,
    adminId,
});

export const getSettings = async (req, res) => {
    try {
        const adminId = req.query.adminId;
        if (!adminId) {
            return res.status(400).json({
                success: false,
                message: "Admin ID is required",
            });
        }

        let settings = await Settings.findOne({ adminId });

        if (!settings) {
            settings = await Settings.create(defaultSettings(adminId));
        }

        return res.status(200).json({
            success: true,
            data: toPlain(settings),
        });
    } catch (error) {
        console.error("Error fetching settings:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch settings",
        });
    }
};

export const updateSettings = async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const {
            maxOrdersPerDay,
            enableDailyOrderLimit,
            blockedDates,
            hidePrices,
            bulkOrderDiscount,
            bulkOrderMinPersons,
            tax,
        } = req.body;

        let settings = await Settings.findOne({ adminId: req.admin.id });

        if (!settings) {
            settings = await Settings.create({
                ...defaultSettings(req.admin.id),
                maxOrdersPerDay: maxOrdersPerDay || 50,
                enableDailyOrderLimit: enableDailyOrderLimit ?? true,
                bulkOrderDiscount: bulkOrderDiscount || 10,
                bulkOrderMinPersons: bulkOrderMinPersons || 5,
                hidePrices: hidePrices ?? false,
                blockedDates: blockedDates ? blockedDates.map((date) => new Date(date)) : [],
                tax: tax || 0,
            });
        } else {
            settings = await Settings.findOneAndUpdate(
                { adminId: req.admin.id },
                {
                    ...(maxOrdersPerDay !== undefined && { maxOrdersPerDay }),
                    ...(enableDailyOrderLimit !== undefined && { enableDailyOrderLimit }),
                    ...(bulkOrderDiscount !== undefined && { bulkOrderDiscount }),
                    ...(bulkOrderMinPersons !== undefined && { bulkOrderMinPersons }),
                    ...(hidePrices !== undefined && { hidePrices }),
                    ...(blockedDates !== undefined && {
                        blockedDates: blockedDates.map((date) => new Date(date)),
                    }),
                    ...(tax !== undefined && { tax }),
                },
                { new: true, runValidators: true },
            );
        }

        return res.status(200).json({
            success: true,
            data: toPlain(settings),
            message: "Settings updated successfully",
        });
    } catch (error) {
        console.error("Error updating settings:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update settings",
        });
    }
};

export const getBlockedDates = async (req, res) => {
    try {
        const adminId = req.query.adminId;
        if (!adminId) {
            return res.status(400).json({
                success: false,
                message: "Admin ID is required",
            });
        }

        const settings = await Settings.findOne({ adminId });
        let unavailableDates = [];
        const blockedDates = settings?.blockedDates || [];

        if (settings?.enableDailyOrderLimit && settings.maxOrdersPerDay > 0) {
            const today = new Date();
            const oneYearFromNow = new Date();
            oneYearFromNow.setFullYear(today.getFullYear() + 1);

            const events = await Event.find({
                adminId,
                date: {
                    $gte: today,
                    $lte: oneYearFromNow,
                },
            }).select("date");

            const eventCountsByDate = new Map();
            events.forEach((event) => {
                const dateKey = startOfDay(event.date).toDateString();
                eventCountsByDate.set(dateKey, (eventCountsByDate.get(dateKey) || 0) + 1);
            });

            const limitReachedDates = [];
            eventCountsByDate.forEach((count, dateString) => {
                if (count >= settings.maxOrdersPerDay) {
                    limitReachedDates.push(startOfDay(new Date(dateString)));
                }
            });

            unavailableDates = [...blockedDates, ...limitReachedDates];
        } else {
            unavailableDates = [...blockedDates];
        }

        return res.status(200).json({
            success: true,
            data: {
                blockedDates,
                limitReachedDates: unavailableDates.filter(
                    (date) =>
                        !blockedDates.some(
                            (blocked) => blocked.toDateString() === date.toDateString(),
                        ),
                ),
                unavailableDates,
            },
        });
    } catch (error) {
        console.error("Error fetching blocked dates:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch blocked dates",
        });
    }
};

export const addBlockedDate = async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const { date } = req.body;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: "Date is required",
            });
        }

        const blockedDate = startOfDay(new Date(date));

        let settings = await Settings.findOne({ adminId: req.admin.id });

        if (!settings) {
            settings = await Settings.create({
                ...defaultSettings(req.admin.id),
                blockedDates: [blockedDate],
            });
        } else {
            const isAlreadyBlocked = settings.blockedDates.some(
                (existingDate) => startOfDay(existingDate).getTime() === blockedDate.getTime(),
            );

            if (isAlreadyBlocked) {
                return res.status(400).json({
                    success: false,
                    message: "Date is already blocked",
                });
            }

            settings = await Settings.findOneAndUpdate(
                { adminId: req.admin.id },
                { blockedDates: [...settings.blockedDates, blockedDate] },
                { new: true, runValidators: true },
            );
        }

        return res.status(200).json({
            success: true,
            data: toPlain(settings),
            message: "Date blocked successfully",
        });
    } catch (error) {
        console.error("Error adding blocked date:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to block date",
        });
    }
};

export const removeBlockedDate = async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const { date } = req.body;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: "Date is required",
            });
        }

        const dateToRemove = startOfDay(new Date(date));

        const settings = await Settings.findOne({ adminId: req.admin.id });

        if (!settings) {
            return res.status(404).json({
                success: false,
                message: "Settings not found",
            });
        }

        const updatedSettings = await Settings.findOneAndUpdate(
            { adminId: req.admin.id },
            {
                blockedDates: settings.blockedDates.filter(
                    (existingDate) => startOfDay(existingDate).getTime() !== dateToRemove.getTime(),
                ),
            },
            { new: true, runValidators: true },
        );

        return res.status(200).json({
            success: true,
            data: toPlain(updatedSettings),
            message: "Date unblocked successfully",
        });
    } catch (error) {
        console.error("Error removing blocked date:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to unblock date",
        });
    }
};
