import type { Request } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "./config/env";

const JWT_SECRET = env.JWT_SECRET;
const JWT_EXPIRY = env.JWT_EXPIRY;

export type JwtClaims = {
	id: string;
	email: string;
	name: string;
	role: string;
};

export function getClaimsFromRequest(req: Request): JwtClaims {
	if (!JWT_SECRET) {
		throw new Error("JWT_SECRET is not defined");
	}
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		throw new Error("No token provided");
	}

	const token = authHeader.split(" ")[1];

	try {
		const claims = jwt.verify(token, JWT_SECRET);
		return claims as JwtClaims;
	} catch (_) {
		throw new Error("Invalid or expired token");
	}
}

export function generateToken(admin: {
	id: string;
	email: string;
	name: string;
	role: string;
}) {
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
		{ expiresIn: JWT_EXPIRY as SignOptions["expiresIn"] },
	);
}
