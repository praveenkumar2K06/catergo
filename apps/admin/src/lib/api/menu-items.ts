import { queryOptions } from "@tanstack/react-query";
import type { MenuItem } from "@/types";
import { apiClient } from "./client";

interface GetMenuResponse {
	success: boolean;
	data: MenuItem[];
	total: number;
	pagination: {
		page: number;
		pageSize: number;
		totalPages: number;
	};
}

interface CreateOrUpdateMenuResponse {
	success: boolean;
	data: MenuItem;
	error?: string;
}

const fetchMenuItems = async (
	page: number,
	pageSize: number,
	search?: string,
) => {
	await new Promise((r) => setTimeout(r, 500));
	const token = localStorage.getItem("admin_token");
	const parsed = token ? JSON.parse(token) : null;
	return apiClient
		.get(`/api/menu-items/${parsed?.admin.id}`, {
			params: {
				page,
				pageSize,
				search,
			},
		})
		.then((res) => res.data as Promise<GetMenuResponse>);
};

export const addMenuItem = async (menuItem: Omit<MenuItem, "id">) => {
	return apiClient
		.post("/api/menu-items", menuItem)
		.then((res) => res.data as Promise<CreateOrUpdateMenuResponse>);
};

export const updateMenuItem = async (menuItem: MenuItem) => {
	const { id, ...rest } = menuItem;
	return apiClient
		.put(`/api/menu-items/${id}`, rest)
		.then((res) => res.data as Promise<CreateOrUpdateMenuResponse>);
};

export const deleteMenuItem = async (id: string) => {
	return apiClient
		.delete(`/api/menu-items/${id}`)
		.then((res) => res.data as Promise<CreateOrUpdateMenuResponse>);
};

export const fetchMenuQuery = (
	page: number,
	pageSize: number,
	search?: string,
) =>
	queryOptions({
		queryKey: ["menu", { page, pageSize, search }],
		queryFn: () => fetchMenuItems(page, pageSize, search),
	});
