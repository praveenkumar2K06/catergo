import { queryOptions } from "@tanstack/react-query";
import axios from "axios";
import type { UserEvent } from "@/types/events";

export interface EventResponse {
	success: boolean;
	data: UserEvent[];
}

const fetchEvents = async (month: number) => {
	await new Promise((r) => setTimeout(r, 500));
	return axios
		.get(`${import.meta.env.VITE_SERVER_URL}/api/events`, {
			params: {
				month,
			},
		})
		.then((res) => res.data as Promise<EventResponse>);
};

export const fetchEventsQuery = (month: number) =>
	queryOptions({
		queryKey: ["events", { month }],
		queryFn: () => fetchEvents(month),

		throwOnError: true,
	});
