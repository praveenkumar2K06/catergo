import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import prisma from "@/client";
import type { AuthRequest } from "@/types/auth-request";
import { generateToken } from "@/utils";

export const loginAdmin = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: "Email and password are required",
			});
		}

		const admin = await prisma.admin.findUnique({
			where: { email: email.toLowerCase().trim() },
		});

		if (!admin) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		if (!admin.isActive) {
			return res.status(403).json({
				success: false,
				message: "Account is inactive. Please contact administrator.",
			});
		}

		const isPasswordValid = await bcrypt.compare(password, admin.password);

		if (!isPasswordValid) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		const token = generateToken(admin);

		return res.status(200).json({
			success: true,
			message: "Login successful",
			data: {
				admin: {
					id: admin.id,
					email: admin.email,
					name: admin.name,
					role: admin.role,
				},
				token,
			},
		});
	} catch (error) {
		console.error("Error during admin login:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

export const createAdmin = async (req: Request, res: Response) => {
	try {
		const { email, password, name, role = "admin" } = req.body;

		if (!email || !password || !name) {
			return res.status(400).json({
				success: false,
				message: "Email, password, and name are required",
			});
		}

		const existingAdmin = await prisma.admin.findUnique({
			where: { email: email.toLowerCase() },
		});

		if (existingAdmin) {
			return res.status(409).json({
				success: false,
				message: "Admin with this email already exists",
			});
		}

		const hashedPassword = await bcrypt.hash(password, 12);

		const admin = await prisma.admin.create({
			data: {
				email: email.toLowerCase(),
				password: hashedPassword,
				name,
				role,
			},
		});

		return res.status(201).json({
			success: true,
			message: "Admin created successfully",
			data: {
				admin: {
					id: admin.id,
					email: admin.email,
					name: admin.name,
					role: admin.role,
					isActive: admin.isActive,
				},
			},
		});
	} catch (error) {
		console.error("Error creating admin:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

export const verifyToken = async (req: AuthRequest, res: Response) => {
	try {
		if (!req.admin) {
			return res.status(401).json({
				success: false,
				message: "Authentication required",
			});
		}

		const admin = await prisma.admin.findUnique({
			where: { id: req.admin.id },
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

		return res.status(200).json({
			success: true,
			data: { admin },
		});
	} catch (error) {
		console.error("Error verifying token:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

export const changePassword = async (req: AuthRequest, res: Response) => {
	try {
		const { currentPassword, newPassword } = req.body;

		if (!currentPassword || !newPassword) {
			return res.status(400).json({
				success: false,
				message: "Current password and new password are required",
			});
		}

		if (!req.admin) {
			return res.status(401).json({
				success: false,
				message: "Authentication required",
			});
		}

		const admin = await prisma.admin.findUnique({
			where: { id: req.admin.id },
		});

		if (!admin) {
			return res.status(404).json({
				success: false,
				message: "Admin not found",
			});
		}

		const isCurrentPasswordValid = await bcrypt.compare(
			currentPassword,
			admin.password,
		);

		if (!isCurrentPasswordValid) {
			return res.status(400).json({
				success: false,
				message: "Current password is incorrect",
			});
		}

		const hashedNewPassword = await bcrypt.hash(newPassword, 12);

		await prisma.admin.update({
			where: { id: admin.id },
			data: { password: hashedNewPassword },
		});

		return res.status(200).json({
			success: true,
			message: "Password changed successfully",
		});
	} catch (error) {
		console.error("Error changing password:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};
