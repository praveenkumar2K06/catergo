import { queryOptions } from "@tanstack/react-query";
import type { MenuItem } from "../types";

interface Response {
	success: boolean;
	data: MenuItem[];
	count: number;
}

const fetchMenuItems = async () => {
	await new Promise((r) => setTimeout(r, 500));
	return fetch(`${import.meta.env.VITE_SERVER_URL}/api/menu-items`).then(
		(res) => res.json() as Promise<Response>,
	);
};

export const menuQueryOptions = queryOptions({
	queryKey: ["menu"],
	queryFn: () => fetchMenuItems(),
});
