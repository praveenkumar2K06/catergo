import { queryOptions } from "@tanstack/react-query";
import type { User } from "@/types";
import { apiClient } from "./client";

export interface UserResponse {
	success: boolean;
	data: User[];
	pagination: {
		page: number;
		pageSize: number;
		totalPages: number;
	};
}

export interface CreateUserRequest {
	name: string;
	phone: string;
	address: string;
	pincode: string;
	numberOfPeople: number;
	selectedDate: string;
	adminId: string;
}

export interface UpdateUserRequest {
	name?: string;
	phone?: string;
	address?: string;
	pincode?: string;
	numberOfPeople?: number;
	selectedDate?: string;
}

const fetchUsers = async (page: number, pageSize: number, search?: string) => {
	await new Promise((r) => setTimeout(r, 500));
	return apiClient
		.get("/api/users/v2", {
			params: {
				page,
				pageSize,
				search,
			},
		})
		.then((res) => res.data as Promise<UserResponse>);
};

export const fetchUsersQuery = (
	page: number,
	pageSize: number,
	search?: string,
) =>
	queryOptions({
		queryKey: ["users", { page, pageSize, search }],
		queryFn: () => fetchUsers(page, pageSize, search),

		throwOnError: true,
	});

export const createUser = async (data: CreateUserRequest): Promise<User> => {
	const response = await apiClient.post<User>("/api/users", data);
	return response.data;
};

export const updateUser = async (
	id: string,
	data: UpdateUserRequest,
): Promise<User> => {
	const response = await apiClient.put<User>(`/api/users/${id}`, data);
	return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
	await apiClient.delete(`/api/users/${id}`);
};
