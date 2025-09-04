import { queryOptions } from "@tanstack/react-query";
import axios from "axios";
import type { MenuItem } from "@/types";

interface GetMenuResponse {
	success: boolean;
	data: MenuItem[];
	count: number;
}

const fetchMenuItems = async () => {
	await new Promise((r) => setTimeout(r, 500));
	return axios
		.get(`${import.meta.env.VITE_SERVER_URL}/api/menu-items`)
		.then((res) => res.data as Promise<GetMenuResponse>);
};

export const fetchMenuQuery = queryOptions({
	queryKey: ["menu"],
	queryFn: () => fetchMenuItems(),
});
