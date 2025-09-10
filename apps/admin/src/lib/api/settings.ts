import axios from "axios";
import { apiClient } from "./client";

export interface Settings {
	id: string;
	maxOrdersPerDay: number;
	enableDailyOrderLimit: boolean;
	blockedDates: string[];
	createdAt: string;
	updatedAt: string;
}

export interface SettingsUpdateRequest {
	maxOrdersPerDay?: number;
	enableDailyOrderLimit?: boolean;
	blockedDates?: string[];
}

interface SettingsResponse {
	success: boolean;
	data: Settings;
}

interface BlockedDatesResponse {
	success: boolean;
	data: {
		blockedDates: string[];
	};
}

export const getSettings = async (): Promise<Settings> => {
	const response = await apiClient.get<SettingsResponse>("/api/settings");
	return response.data.data;
};

export const updateSettings = async (
	settings: SettingsUpdateRequest,
): Promise<Settings> => {
	const response = await apiClient.put<SettingsResponse>(
		"/api/settings",
		settings,
	);
	return response.data.data;
};

export const getBlockedDates = async (): Promise<string[]> => {
	const response = await axios.get<BlockedDatesResponse>(
		`${import.meta.env.VITE_SERVER_URL}/api/settings/blocked-dates`,
	);
	return response.data.data.blockedDates;
};

export const addBlockedDate = async (date: string): Promise<Settings> => {
	const response = await apiClient.post<SettingsResponse>(
		"/api/settings/blocked-dates",
		{ date },
	);
	return response.data.data;
};

export const removeBlockedDate = async (date: string): Promise<Settings> => {
	const response = await apiClient.delete<SettingsResponse>(
		"/api/settings/blocked-dates",
		{ data: { date } },
	);
	return response.data.data;
};
