import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import Admin from "../models/Admin.js";

const JWT_SECRET = env.JWT_SECRET;

export const authenticateAdmin = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access token is required",
            });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);

            const admin = await Admin.findById(decoded.id).select(
                "email name role isActive",
            );

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

export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
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
