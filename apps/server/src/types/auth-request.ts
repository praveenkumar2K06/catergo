import type { Request } from "express";

export interface AuthRequest extends Request {
	admin?: {
		id: string;
		email: string;
		name: string;
		role: string;
	};
}
