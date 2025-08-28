import axios from "axios";
import type { CartItem } from "../types";

export interface CreateCartItemRequest {
	userId: string;
	menuId: string;
	quantity: number;
}

export interface UpdateCartQuantityRequest {
	id: string;
	quantity: number;
}

export const createCartItem = async (
	userId: string,
	data: Omit<CreateCartItemRequest, "userId">,
) => {
	await new Promise((r) => setTimeout(r, 500));

	const requestData: CreateCartItemRequest = {
		userId,
		menuId: data.menuId,
		quantity: data.quantity,
	};

	return axios
		.post(`${import.meta.env.VITE_SERVER_URL}/api/cart`, requestData, {
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then((res) => res.data as Promise<CartItem>);
};

export const removeCartItem = async (id: string) => {
	await new Promise((r) => setTimeout(r, 500));
	return axios
		.delete(`${import.meta.env.VITE_SERVER_URL}/api/cart/${id}`, {
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then((res) => res.data as Promise<void>);
};

export const updateCartQuantity = async (data: UpdateCartQuantityRequest) => {
	await new Promise((r) => setTimeout(r, 500));

	const request = {
		id: data.id,
		quantity: data.quantity,
	};
	return axios
		.patch(`${import.meta.env.VITE_SERVER_URL}/api/cart`, request, {
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then((res) => res.data as Promise<CartItem>);
};
