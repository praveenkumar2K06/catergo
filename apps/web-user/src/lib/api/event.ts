import axios from "axios";

export interface CreateEventRequest {
	userId: string;
	name: string;
	date: string;
}

export const createEvent = async (event: CreateEventRequest) => {
	await new Promise((r) => setTimeout(r, 500));
	return axios
		.post(`${import.meta.env.VITE_SERVER_URL}/api/events`, event, {
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then((res) => res.data as Promise<CreateEventRequest>);
};
