import { queryOptions } from "@tanstack/react-query";
import axios from "axios";

export interface Category {
	id: string;
	name: string;
	icon: string;
	order: number;
}

interface CategoriesResponse {
	success: boolean;
	data: Category[];
}

const fetchCategories = async (catererId: string): Promise<Category[]> => {
	const response = await axios.get<CategoriesResponse>(
		`${import.meta.env.VITE_SERVER_URL}/api/categories/${catererId}`,
	);
	return response.data.data;
};

export const categoriesQueryOptions = (catererId: string | null) =>
	queryOptions({
		queryKey: ["categories", catererId],
		queryFn: () => {
			if (!catererId) throw new Error("Caterer ID is required");
			return fetchCategories(catererId);
		},
		enabled: !!catererId,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
