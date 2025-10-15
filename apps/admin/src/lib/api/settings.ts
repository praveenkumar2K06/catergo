import { apiClient } from "./client";

export interface Settings {
	id: string;
	maxOrdersPerDay: number;
	enableDailyOrderLimit: boolean;
	bulkOrderDiscount: number;
	bulkOrderMinPersons: number;
	hidePrices: boolean;
	blockedDates: string[];
	createdAt: string;
	updatedAt: string;
}

export interface SettingsUpdateRequest {
	maxOrdersPerDay?: number;
	enableDailyOrderLimit?: boolean;
	blockedDates?: string[];
	bulkOrderDiscount?: number;
	bulkOrderMinPersons?: number;
	hidePrices?: boolean;
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

export const getSettings = async (adminId: string): Promise<Settings> => {
	const response = await apiClient.get<SettingsResponse>(
		`${import.meta.env.VITE_SERVER_URL}/api/settings`,
		{
			params: { adminId },
		},
	);
	return response.data.data;
};

export const updateSettings = async (
	settings: SettingsUpdateRequest,
): Promise<Settings> => {
	const response = await apiClient.put<SettingsResponse>(
		`${import.meta.env.VITE_SERVER_URL}/api/settings`,
		settings,
	);
	return response.data.data;
};

export const getBlockedDates = async (adminId: string): Promise<string[]> => {
	const response = await apiClient.get<BlockedDatesResponse>(
		`${import.meta.env.VITE_SERVER_URL}/api/settings/blocked-dates`,
		{ params: { adminId } },
	);
	return response.data.data.blockedDates;
};

export const addBlockedDate = async (date: string): Promise<Settings> => {
	const response = await apiClient.post<SettingsResponse>(
		`${import.meta.env.VITE_SERVER_URL}/api/settings/blocked-dates`,
		{ date },
	);
	return response.data.data;
};

export const removeBlockedDate = async (date: string): Promise<Settings> => {
	const response = await apiClient.delete<SettingsResponse>(
		`${import.meta.env.VITE_SERVER_URL}/api/settings/blocked-dates`,
		{ data: { date } },
	);
	return response.data.data;
};
