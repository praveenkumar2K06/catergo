import axios from "axios";

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
	const response = await axios.get<SettingsResponse>(
		`${import.meta.env.VITE_SERVER_URL}/api/settings`,
	);
	return response.data.data;
};

export const updateSettings = async (
	settings: SettingsUpdateRequest,
): Promise<Settings> => {
	const response = await axios.put<SettingsResponse>(
		`${import.meta.env.VITE_SERVER_URL}/api/settings`,
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
	const response = await axios.post<SettingsResponse>(
		`${import.meta.env.VITE_SERVER_URL}/api/settings/blocked-dates`,
		{ date },
	);
	return response.data.data;
};

export const removeBlockedDate = async (date: string): Promise<Settings> => {
	const response = await axios.delete<SettingsResponse>(
		`${import.meta.env.VITE_SERVER_URL}/api/settings/blocked-dates`,
		{ data: { date } },
	);
	return response.data.data;
};
