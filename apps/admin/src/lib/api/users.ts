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
