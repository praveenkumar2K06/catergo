import { queryOptions } from "@tanstack/react-query";
import axios from "axios";
import { apiClient } from "./client";

export interface AdminUser {
	id: string;
	email: string;
	name: string;
	role: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	success: boolean;
	message: string;
	data: {
		admin: AdminUser;
		token: string;
	};
}

export interface VerifyResponse {
	success: boolean;
	data: {
		admin: AdminUser;
	};
}

export const loginAdmin = async (
	credentials: LoginRequest,
): Promise<LoginResponse["data"]> => {
	const response = await axios.post<LoginResponse>(
		`${import.meta.env.VITE_SERVER_URL}/api/auth/login`,
		credentials,
	);
	return response.data.data;
};

export const verifyToken = async (): Promise<AdminUser> => {
	const response = await apiClient.get<VerifyResponse>("/api/auth/verify");
	return response.data.data.admin;
};

export const verifyTokenQuery = () =>
	queryOptions({
		queryKey: ["auth", "verify"],
		queryFn: verifyToken,
		retry: false,
		staleTime: 5 * 60 * 1000,
	});
