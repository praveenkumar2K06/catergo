import axios from "axios";

export interface Settings {
	maxOrdersPerDay: number;
	enableDailyOrderLimit: boolean;
	blockedDates: string[];
	bulkOrderDiscount: number;
	bulkOrderMinPersons: number;
	hidePrices: boolean;
	id: string;
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

export const getUnavailableDates = async (
	adminId: string,
): Promise<BlockedDatesResponse["data"]> => {
	const response = await axios.get<BlockedDatesResponse>(
		`${import.meta.env.VITE_SERVER_URL}/api/settings/blocked-dates`,
		{ params: { adminId } },
	);
	return response.data.data;
};

export const getSettings = async (adminId: string): Promise<Settings> => {
	const response = await axios.get<SettingsResponse>(
		`${import.meta.env.VITE_SERVER_URL}/api/settings`,
		{ params: { adminId } },
	);
	return response.data.data;
};
