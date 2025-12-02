import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "./client";

export interface Category {
	id: string;
	name: string;
	icon: string;
	order: number;
	createdAt: string;
	updatedAt: string;
}

export interface CreateCategoryRequest {
	name: string;
	icon?: string;
	order?: number;
}

export interface UpdateCategoryRequest {
	name?: string;
	icon?: string;
	order?: number;
}

interface CategoriesResponse {
	success: boolean;
	data: Category[];
}

interface CategoryResponse {
	success: boolean;
	data: Category;
}

const fetchCategories = async (adminId: string): Promise<Category[]> => {
	const response = await apiClient.get<CategoriesResponse>(
		`/api/categories/${adminId}`,
	);
	return response.data.data;
};

export const categoriesQueryOptions = (adminId: string) =>
	queryOptions({
		queryKey: ["categories", adminId],
		queryFn: () => fetchCategories(adminId),
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

export const createCategory = async (
	data: CreateCategoryRequest,
): Promise<Category> => {
	const response = await apiClient.post<CategoryResponse>(
		"/api/categories",
		data,
	);
	return response.data.data;
};

export const updateCategory = async (
	id: string,
	data: UpdateCategoryRequest,
): Promise<Category> => {
	const response = await apiClient.put<CategoryResponse>(
		`/api/categories/${id}`,
		data,
	);
	return response.data.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
	await apiClient.delete(`/api/categories/${id}`);
};

export const reorderCategories = async (
	categories: { id: string; order: number }[],
): Promise<Category[]> => {
	const response = await apiClient.put<CategoriesResponse>(
		"/api/categories/reorder",
		{ categories },
	);
	return response.data.data;
};
