import { useQuery } from "@tanstack/react-query";
import { getSettings, getUnavailableDates } from "@/lib/api/settings";

export const useUnavailableDates = () => {
	return useQuery({
		queryKey: ["unavailable-dates"],
		queryFn: () => getUnavailableDates(),
		staleTime: 60 * 1000,
	});
};

export const useSettings = () => {
	return useQuery({
		queryKey: ["settings"],
		queryFn: () => getSettings(),
		staleTime: 60 * 1000,
	});
};
