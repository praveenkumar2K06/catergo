import { queryOptions } from "@tanstack/react-query";
import axios from "axios";
import type { MenuItem } from "../types";

interface Response {
	success: boolean;
	data: MenuItem[];
	count: number;
}

const fetchMenuItems = async (catererId: string | null) => {
	await new Promise((r) => setTimeout(r, 500));

	if (!catererId)
		throw new Error("Caterer ID is required to fetch menu items");

	return axios
		.get(`${import.meta.env.VITE_SERVER_URL}/api/menu-items/${catererId}`)
		.then((res) => res.data as Promise<Response>);
};

export const menuQueryOptions = (catererId: string | null) =>
	queryOptions({
		queryKey: ["menu", catererId],
		queryFn: () => fetchMenuItems(catererId),
	});
