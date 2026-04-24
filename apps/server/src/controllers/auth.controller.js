import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import { generateToken } from "../utils.js";
import { toPlain } from "../lib/serialize.js";

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

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

        const plainAdmin = toPlain(admin);
        const token = generateToken(plainAdmin);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                admin: {
                    id: plainAdmin.id,
                    email: plainAdmin.email,
                    name: plainAdmin.name,
                    role: plainAdmin.role,
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

export const createAdmin = async (req, res) => {
    try {
        const { email, password, name, role = "admin" } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: "Email, password, and name are required",
            });
        }

        const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });

        if (existingAdmin) {
            return res.status(409).json({
                success: false,
                message: "Admin with this email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const admin = await Admin.create({
            email: email.toLowerCase(),
            password: hashedPassword,
            name,
            role,
        });

        const plainAdmin = toPlain(admin);

        return res.status(201).json({
            success: true,
            message: "Admin created successfully",
            data: {
                admin: {
                    id: plainAdmin.id,
                    email: plainAdmin.email,
                    name: plainAdmin.name,
                    role: plainAdmin.role,
                    isActive: plainAdmin.isActive,
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

export const verifyToken = async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const admin = await Admin.findById(req.admin.id).select(
            "email name role isActive",
        );

        if (!admin || !admin.isActive) {
            return res.status(401).json({
                success: false,
                message: "Invalid or inactive account",
            });
        }

        return res.status(200).json({
            success: true,
            data: { admin: toPlain(admin) },
        });
    } catch (error) {
        console.error("Error verifying token:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const changePassword = async (req, res) => {
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

        const admin = await Admin.findById(req.admin.id);

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

        admin.password = await bcrypt.hash(newPassword, 12);
        await admin.save();

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
