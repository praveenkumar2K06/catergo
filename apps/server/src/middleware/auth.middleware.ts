import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "@/client";
import { env } from "@/config/env";

interface AuthRequest extends Request {
	admin?: {
		id: string;
		email: string;
		name: string;
		role: string;
	};
}

const JWT_SECRET = env.JWT_SECRET;

export const authenticateAdmin = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const token = req.header("Authorization")?.replace("Bearer ", "");

		if (!token) {
			return res.status(401).json({
				success: false,
				message: "Access token is required",
			});
		}

		try {
			const decoded = jwt.verify(token, JWT_SECRET) as {
				id: string;
				email: string;
				name: string;
				role: string;
			};

			// Verify admin still exists and is active
			const admin = await prisma.admin.findUnique({
				where: { id: decoded.id },
				select: {
					id: true,
					email: true,
					name: true,
					role: true,
					isActive: true,
				},
			});

			if (!admin || !admin.isActive) {
				return res.status(401).json({
					success: false,
					message: "Invalid or inactive account",
				});
			}

			req.admin = {
				id: admin.id,
				email: admin.email,
				name: admin.name,
				role: admin.role,
			};

			next();
		} catch {
			return res.status(401).json({
				success: false,
				message: "Invalid or expired token",
			});
		}
	} catch (error) {
		console.error("Error in authentication middleware:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

export const requireRole = (allowedRoles: string[]) => {
	return (req: AuthRequest, res: Response, next: NextFunction) => {
		if (!req.admin) {
			return res.status(401).json({
				success: false,
				message: "Authentication required",
			});
		}

		if (!allowedRoles.includes(req.admin.role)) {
			return res.status(403).json({
				success: false,
				message: "Insufficient permissions",
			});
		}

		next();
	};
};
