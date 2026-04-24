import jwt from "jsonwebtoken";
import { env } from "./config/env.js";

const JWT_SECRET = env.JWT_SECRET;
const JWT_EXPIRY = env.JWT_EXPIRY;

export function getClaimsFromRequest(req) {
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("No token provided");
    }

    const token = authHeader.split(" ")[1];

    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        throw new Error("Invalid or expired token");
    }
}

export function generateToken(admin) {
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    if (!JWT_EXPIRY) {
        throw new Error("JWT_EXPIRY is not defined");
    }

    return jwt.sign(
        {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY },
    );
}
