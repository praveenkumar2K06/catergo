import { endOfMonth, startOfMonth } from "date-fns";
import type { Request, Response } from "express";
import prisma from "../client";

// Fetch all events
export const getEvents = async (req: Request, res: Response) => {
	try {
		const { month } = req.query;

		const parsedMonth = Number(month);

		const year = new Date().getFullYear();
		const start = startOfMonth(new Date(year, parsedMonth - 1));
		const end = endOfMonth(new Date(year, parsedMonth - 1));

		const events = await prisma.event.findMany({
			where: {
				date: {
					gte: start,
					lte: end,
				},
			},
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

// Create a new event
export const createEvent = async (req: Request, res: Response) => {
	try {
		const { userId, name, date } = req.body;

		const newEvent = await prisma.event.create({
			data: {
				userId,
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

// Update an event
export const updateEvent = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { name, date } = req.body;

		const updatedEvent = await prisma.event.update({
			where: { id },
			data: {
				name,
				date,
			},
		});

		res.status(200).json(updatedEvent);
	} catch (error) {
		console.error("Error updating event:", error);
		res.status(500).json({ error: "Failed to update event" });
	}
};

// Delete an event
export const deleteEvent = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		await prisma.event.delete({
			where: { id },
		});

		res.status(200).json({
			success: true,
			message: "Event deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting event:", error);
		res.status(500).json({ error: "Failed to delete event" });
	}
};
