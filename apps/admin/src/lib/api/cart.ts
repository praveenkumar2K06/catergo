import { apiClient } from "./client";

export interface CreateCartItemRequest {
	userId: string;
	menuId: string;
	quantity: number;
}

export const createCartItem = async (data: CreateCartItemRequest) => {
	const response = await apiClient.post("/api/cart", data);
	return response.data;
};
