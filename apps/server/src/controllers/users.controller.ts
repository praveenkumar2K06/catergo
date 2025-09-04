import type { Request, Response } from "express";
import prisma from "../client";

export const getUsers = async (_: Request, res: Response) => {
	try {
		const users = await prisma.user.findMany({
			orderBy: {
				selectedDate: "desc",
			},
		});
		res.status(200).json({
			success: true,
			data: users,
			count: users.length,
		});
	} catch (error) {
		console.error("Error fetching users:", error);
		res.status(500).json({ error: "Failed to fetch users" });
	}
};

export const createUser = async (req: Request, res: Response) => {
	try {
		const { name, phone, address, pincode, numberOfPeople, selectedDate } =
			req.body;

		const newUser = await prisma.user.create({
			data: {
				name,
				phone,
				address,
				pincode,
				numberOfPeople,
				selectedDate,
			},
		});

		res.status(201).json(newUser);
	} catch (error) {
		console.error("Error creating user:", error);
		res.status(500).json({ error: "Failed to create user" });
	}
};

export const updateUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { name, phone, address, pincode, numberOfPeople, selectedDate } =
			req.body;

		const updatedUser = await prisma.user.update({
			where: { id },
			data: {
				name,
				phone,
				address,
				pincode,
				numberOfPeople,
				selectedDate,
			},
		});

		res.status(200).json(updatedUser);
	} catch (error) {
		console.error("Error updating user:", error);
		res.status(500).json({ error: "Failed to update user" });
	}
};
