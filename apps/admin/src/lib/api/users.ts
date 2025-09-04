import { queryOptions } from "@tanstack/react-query";
import axios from "axios";
import type { User } from "@/types";

export interface UserResponse {
	success: boolean;
	data: User[];
	count: number;
}

const fetchUsers = async () => {
	await new Promise((r) => setTimeout(r, 500));
	console.log("Fetching users...");
	return axios
		.get(`${import.meta.env.VITE_SERVER_URL}/api/users`)
		.then((res) => res.data as Promise<UserResponse>);
};

export const usersQueryOptions = queryOptions({
	queryKey: ["users"],
	queryFn: () => fetchUsers(),
});
