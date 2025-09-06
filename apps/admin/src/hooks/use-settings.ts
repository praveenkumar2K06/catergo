import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	addBlockedDate,
	getBlockedDates,
	getSettings,
	removeBlockedDate,
	type SettingsUpdateRequest,
	updateSettings,
} from "@/lib/api/settings";

const SETTINGS_QUERY_KEY = ["settings"];

export const useSettings = () => {
	return useQuery({
		queryKey: SETTINGS_QUERY_KEY,
		queryFn: () => getSettings(),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

export const useUpdateSettings = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (settings: SettingsUpdateRequest) =>
			updateSettings(settings),
		onSuccess: (data) => {
			queryClient.setQueryData(SETTINGS_QUERY_KEY, data);
			queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY });
		},
	});
};

export const useBlockedDates = () => {
	return useQuery({
		queryKey: ["blocked-dates"],
		queryFn: () => getBlockedDates(),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

export const useAddBlockedDate = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (date: string) => addBlockedDate(date),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: ["blocked-dates"] });
		},
	});
};

export const useRemoveBlockedDate = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (date: string) => removeBlockedDate(date),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: ["blocked-dates"] });
		},
	});
};
