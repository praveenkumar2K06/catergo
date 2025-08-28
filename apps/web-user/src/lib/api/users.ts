import axios from "axios";
import type { UserData } from "../types";

export const createUser = async (userData: UserData) => {
	await new Promise((r) => setTimeout(r, 500));
	return axios
		.post(`${import.meta.env.VITE_SERVER_URL}/api/users`, userData, {
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then((res) => res.data as Promise<UserData>);
};

export const updateUser = async (id: string, userData: UserData) => {
	await new Promise((r) => setTimeout(r, 500));
	return axios
		.put(`${import.meta.env.VITE_SERVER_URL}/api/users/${id}`, userData, {
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then((res) => res.data as Promise<UserData>);
};
