import type { Request, Response } from "express";
import prisma from "@/client";

export const verifyCaterer = async (req: Request, res: Response) => {
	try {
		const { catererId } = req.body;

		const caterer = await prisma.admin.findUnique({
			where: { id: catererId },
		});

		if (!caterer) {
			return res.status(404).json({
				success: false,
				message: "Caterer not found",
			});
		}

		res.status(200).json({
			success: true,
			message: "Caterer verified successfully",
		});
	} catch (error) {
		if (
			error instanceof Error &&
			error.message.includes("Malformed ObjectID")
		) {
			return res.status(404).json({
				success: false,
				message: "Caterer not found",
			});
		}
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

export const getAllCaterers = async (_req: Request, res: Response) => {
	try {
		const caterers = await prisma.admin.findMany({
			select: {
				id: true,
				email: true,
				name: true,
			},
		});

		res.status(200).json({
			success: true,
			data: caterers,
		});
	} catch {
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};
