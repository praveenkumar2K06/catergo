import type { UserData } from "../types";

export const createUser = async (userData: UserData) => {
	await new Promise((r) => setTimeout(r, 500));
	return fetch(`${import.meta.env.VITE_SERVER_URL}/api/users`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(userData),
	}).then((res) => res.json() as Promise<UserData>);
};

export const updateUser = async (id: string, userData: UserData) => {
	await new Promise((r) => setTimeout(r, 500));
	return fetch(`${import.meta.env.VITE_SERVER_URL}/api/users/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(userData),
	}).then((res) => res.json() as Promise<UserData>);
};
