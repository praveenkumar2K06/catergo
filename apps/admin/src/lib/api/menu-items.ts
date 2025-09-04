import { queryOptions } from "@tanstack/react-query";
import axios from "axios";
import type { MenuItem } from "@/types";

interface GetMenuResponse {
	success: boolean;
	data: MenuItem[];
	count: number;
}

interface CreateOrUpdateMenuResponse {
	success: boolean;
	data: MenuItem;
	error?: string;
}

const fetchMenuItems = async () => {
	await new Promise((r) => setTimeout(r, 500));
	return axios
		.get(`${import.meta.env.VITE_SERVER_URL}/api/menu-items`)
		.then((res) => res.data as Promise<GetMenuResponse>);
};

export const addMenuItem = async (menuItem: Omit<MenuItem, "id">) => {
	return axios
		.post(`${import.meta.env.VITE_SERVER_URL}/api/menu-items`, menuItem)
		.then((res) => res.data as Promise<CreateOrUpdateMenuResponse>);
};

export const updateMenuItem = async (menuItem: MenuItem) => {
	const { id, ...rest } = menuItem;
	return axios
		.put(`${import.meta.env.VITE_SERVER_URL}/api/menu-items/${id}`, rest)
		.then((res) => res.data as Promise<CreateOrUpdateMenuResponse>);
};

export const deleteMenuItem = async (id: string) => {
	return axios
		.delete(`${import.meta.env.VITE_SERVER_URL}/api/menu-items/${id}`)
		.then((res) => res.data as Promise<CreateOrUpdateMenuResponse>);
};

export const fetchMenuQuery = queryOptions({
	queryKey: ["menu"],
	queryFn: () => fetchMenuItems(),
});
