import { useQuery } from "@tanstack/react-query";
import { getSettings, getUnavailableDates } from "@/lib/api/settings";

export const useUnavailableDates = (adminId: string) => {
	return useQuery({
		queryKey: ["unavailable-dates"],
		queryFn: () => getUnavailableDates(adminId),
		staleTime: 60 * 1000,
	});
};

export const useSettings = (adminId: string) => {
	return useQuery({
		queryKey: ["settings"],
		queryFn: () => getSettings(adminId),
		staleTime: 60 * 1000,
	});
};
