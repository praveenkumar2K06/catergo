import type { Request, Response } from "express";
import prisma from "@/client";

interface AuthRequest extends Request {
	admin?: {
		id: string;
		email: string;
		name: string;
		role: string;
	};
}

export const getSettings = async (req: AuthRequest, res: Response) => {
	try {
		const adminId = req.query.adminId as string;
		if (!adminId) {
			return res.status(400).json({
				success: false,
				message: "Admin ID is required",
			});
		}

		let settings = await prisma.settings.findUnique({
			where: { adminId: adminId },
		});

		if (!settings) {
			settings = await prisma.settings.create({
				data: {
					maxOrdersPerDay: 50,
					enableDailyOrderLimit: true,
					bulkOrderDiscount: 10,
					bulkOrderMinPersons: 5,
					hidePrices: false,
					blockedDates: [],
					adminId: adminId,
				},
			});
		}

		return res.status(200).json({
			success: true,
			data: settings,
		});
	} catch (error) {
		console.error("Error fetching settings:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to fetch settings",
		});
	}
};

export const updateSettings = async (req: AuthRequest, res: Response) => {
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
		} = req.body;

		let settings = await prisma.settings.findUnique({
			where: { adminId: req.admin.id },
		});

		if (!settings) {
			settings = await prisma.settings.create({
				data: {
					maxOrdersPerDay: maxOrdersPerDay || 50,
					enableDailyOrderLimit: enableDailyOrderLimit ?? true,
					bulkOrderDiscount: bulkOrderDiscount || 10,
					bulkOrderMinPersons: bulkOrderMinPersons || 5,
					hidePrices: hidePrices ?? false,
					blockedDates: blockedDates
						? blockedDates.map((date: string) => new Date(date))
						: [],
					adminId: req.admin.id,
				},
			});
		} else {
			settings = await prisma.settings.update({
				where: { adminId: req.admin.id },
				data: {
					...(maxOrdersPerDay !== undefined && { maxOrdersPerDay }),
					...(enableDailyOrderLimit !== undefined && {
						enableDailyOrderLimit,
					}),
					...(bulkOrderDiscount !== undefined && {
						bulkOrderDiscount,
					}),
					...(bulkOrderMinPersons !== undefined && {
						bulkOrderMinPersons,
					}),
					...(hidePrices !== undefined && { hidePrices }),
					...(blockedDates !== undefined && {
						blockedDates: blockedDates.map(
							(date: string) => new Date(date),
						),
					}),
				},
			});
		}

		return res.status(200).json({
			success: true,
			data: settings,
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

export const getBlockedDates = async (req: AuthRequest, res: Response) => {
	try {
		const adminId = req.query.adminId as string;
		if (!adminId) {
			return res.status(400).json({
				success: false,
				message: "Admin ID is required",
			});
		}
		const settings = await prisma.settings.findUnique({
			where: { adminId: adminId },
		});

		let unavailableDates: Date[] = [];
		const blockedDates: Date[] = settings?.blockedDates || [];

		if (settings?.enableDailyOrderLimit && settings.maxOrdersPerDay > 0) {
			const today = new Date();
			const oneYearFromNow = new Date();
			oneYearFromNow.setFullYear(today.getFullYear() + 1);

			const events = await prisma.event.findMany({
				where: {
					date: {
						gte: today,
						lte: oneYearFromNow,
					},
					user: {
						adminId: adminId,
					},
				},
				select: {
					date: true,
				},
			});

			const eventCountsByDate = new Map<string, number>();
			events.forEach((event) => {
				const dateKey = event.date.toDateString();
				eventCountsByDate.set(
					dateKey,
					(eventCountsByDate.get(dateKey) || 0) + 1,
				);
			});

			const limitReachedDates: Date[] = [];
			eventCountsByDate.forEach((count, dateString) => {
				if (count >= settings.maxOrdersPerDay) {
					limitReachedDates.push(new Date(dateString));
				}
			});

			unavailableDates = [...blockedDates, ...limitReachedDates];
		} else {
			unavailableDates = [...blockedDates];
		}

		return res.status(200).json({
			success: true,
			data: {
				blockedDates: blockedDates,
				limitReachedDates: unavailableDates.filter(
					(date) =>
						!blockedDates.some(
							(blocked) =>
								blocked.toDateString() === date.toDateString(),
						),
				),
				unavailableDates: unavailableDates,
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

export const addBlockedDate = async (req: AuthRequest, res: Response) => {
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

		const blockedDate = new Date(date);

		let settings = await prisma.settings.findUnique({
			where: { adminId: req.admin.id },
		});

		if (!settings) {
			settings = await prisma.settings.create({
				data: {
					maxOrdersPerDay: 50,
					enableDailyOrderLimit: true,
					blockedDates: [blockedDate],
					adminId: req.admin.id,
				},
			});
		} else {
			const isAlreadyBlocked = settings.blockedDates.some(
				(existingDate) =>
					existingDate.toDateString() === blockedDate.toDateString(),
			);

			if (isAlreadyBlocked) {
				return res.status(400).json({
					success: false,
					message: "Date is already blocked",
				});
			}

			settings = await prisma.settings.update({
				where: { adminId: req.admin.id },
				data: {
					blockedDates: [...settings.blockedDates, blockedDate],
				},
			});
		}

		return res.status(200).json({
			success: true,
			data: settings,
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

export const removeBlockedDate = async (req: AuthRequest, res: Response) => {
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

		const dateToRemove = new Date(date);

		const settings = await prisma.settings.findUnique({
			where: { adminId: req.admin.id },
		});

		if (!settings) {
			return res.status(404).json({
				success: false,
				message: "Settings not found",
			});
		}

		const updatedSettings = await prisma.settings.update({
			where: { adminId: req.admin.id },
			data: {
				blockedDates: settings.blockedDates.filter(
					(existingDate) =>
						existingDate.toDateString() !==
						dateToRemove.toDateString(),
				),
			},
		});

		return res.status(200).json({
			success: true,
			data: updatedSettings,
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
