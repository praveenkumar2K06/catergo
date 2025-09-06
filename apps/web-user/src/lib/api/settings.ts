import axios from "axios";

export interface Settings {
	maxOrdersPerDay: number;
	enableDailyOrderLimit: boolean;
	blockedDates: string[];
	createdAt: string;
	updatedAt: string;
}

interface BlockedDatesResponse {
	success: boolean;
	data: {
		blockedDates: string[];
		limitReachedDates: string[];
		unavailableDates: string[];
	};
}

interface SettingsResponse {
	success: boolean;
	data: Settings;
}

export const getUnavailableDates = async (): Promise<
	BlockedDatesResponse["data"]
> => {
	const response = await axios.get<BlockedDatesResponse>(
		`${import.meta.env.VITE_SERVER_URL}/api/settings/blocked-dates`,
	);
	return response.data.data;
};

export const getSettings = async (): Promise<Settings> => {
	const response = await axios.get<SettingsResponse>(
		`${import.meta.env.VITE_SERVER_URL}/api/settings`,
	);
	return response.data.data;
};
