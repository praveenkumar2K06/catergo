import { endOfDay, endOfMonth, startOfDay, startOfMonth } from "date-fns";
import type { Request, Response } from "express";
import type { Prisma } from "prisma/generated/client";
import type { AuthRequest } from "@/types/auth-request";
import prisma from "../client";

export const getEvents = async (req: AuthRequest, res: Response) => {
	try {
		if (!req.admin) {
			return res.status(401).json({
				success: false,
				message: "Authentication required",
			});
		}

		const { month } = req.query;

		const parsedMonth = Number(month);

		const year = new Date().getFullYear();
		const start = startOfMonth(new Date(year, parsedMonth - 1));
		const end = endOfMonth(new Date(year, parsedMonth - 1));

		const where: Prisma.EventWhereInput = {
			adminId: req.admin.id,
		};

		where.AND = [
			{
				date: {
					gte: start,
					lte: end,
				},
			},
		];

		const events = await prisma.event.findMany({
			where,
			orderBy: {
				date: "asc",
			},
		});

		res.status(200).json({
			success: true,
			data: events,
		});
	} catch (error) {
		console.error("Error fetching events:", error);
		res.status(500).json({ error: "Failed to fetch events" });
	}
};

export const getTodaysEvents = async (req: AuthRequest, res: Response) => {
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
		const where: Prisma.EventWhereInput = {
			adminId: req.admin.id,
		};

		where.AND = [
			{
				date: {
					gte: start,
					lte: end,
				},
			},
		];

		const events = await prisma.event.findMany({
			where,
			orderBy: {
				date: "asc",
			},
		});

		res.status(200).json({
			success: true,
			data: events,
		});
	} catch (error) {
		console.error("Error fetching today's events:", error);
		res.status(500).json({ error: "Failed to fetch today's events" });
	}
};

export const createEvent = async (req: Request, res: Response) => {
	try {
		const { userId, name, date, adminId } = req.body;

		if (!adminId) {
			return res.status(403).json({
				success: false,
				message: "Admin ID is required",
			});
		}

		const settings = await prisma.settings.findFirst();

		if (settings?.enableDailyOrderLimit && settings.maxOrdersPerDay) {
			const eventDate = new Date(date);
			const dayStart = startOfDay(eventDate);
			const dayEnd = endOfDay(eventDate);

			const ordersForDay = await prisma.event.count({
				where: {
					date: {
						gte: dayStart,
						lte: dayEnd,
					},
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

		const newEvent = await prisma.event.upsert({
			where: {
				userId: userId,
			},
			create: {
				userId,
				name,
				date,
				adminId,
			},
			update: {
				name,
				date,
			},
		});

		res.status(201).json(newEvent);
	} catch (error) {
		console.error("Error creating event:", error);
		res.status(500).json({ error: "Failed to create event" });
	}
};

export const getEventById = async (req: AuthRequest, res: Response) => {
	try {
		if (!req.admin) {
			return res.status(401).json({
				success: false,
				message: "Authentication required",
			});
		}

		const { id } = req.params;

		const event = await prisma.event.findFirst({
			where: {
				id,
				adminId: req.admin.id,
			},
			include: {
				user: {
					include: {
						cartItems: {
							include: {
								menuItem: true,
							},
						},
					},
				},
			},
		});

		if (!event) {
			return res.status(404).json({
				success: false,
				message: "Event not found",
			});
		}

		res.status(200).json({
			success: true,
			data: event,
		});
	} catch (error) {
		console.error("Error fetching event:", error);
		res.status(500).json({ error: "Failed to fetch event" });
	}
};
