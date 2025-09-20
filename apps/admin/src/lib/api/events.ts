import { queryOptions } from "@tanstack/react-query";
import type { EventExtended, UserEvent } from "@/types/events";
import { apiClient } from "./client";

export interface EventResponse {
	success: boolean;
	data: UserEvent[];
}

export interface EventByIdResponse {
	success: boolean;
	data: EventExtended;
}

const fetchEvents = async (month: number) => {
	await new Promise((r) => setTimeout(r, 500));
	return apiClient
		.get("/api/events", {
			params: {
				month,
			},
		})
		.then((res) => res.data as Promise<EventResponse>);
};

export const fetchTodaysEvents = async () => {
	await new Promise((r) => setTimeout(r, 500));
	return apiClient
		.get("/api/events/today")
		.then((res) => res.data as Promise<EventResponse>);
};

const fetchEventById = async (id: string) => {
	await new Promise((r) => setTimeout(r, 500));
	return apiClient
		.get(`/api/events/${id}`)
		.then((res) => res.data as Promise<EventByIdResponse>);
};

export const fetchEventsQuery = (month: number) =>
	queryOptions({
		queryKey: ["events", { month }],
		queryFn: () => fetchEvents(month),

		throwOnError: true,
	});

export const fetchEventByIdQuery = (id: string) =>
	queryOptions({
		queryKey: ["event", { id }],
		queryFn: () => fetchEventById(id),

		throwOnError: true,
	});
