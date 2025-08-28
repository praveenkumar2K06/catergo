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

	return fetch(`${import.meta.env.VITE_SERVER_URL}/api/cart`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(requestData),
	}).then((res) => res.json() as Promise<CartItem>);
};

export const removeCartItem = async (id: string) => {
	await new Promise((r) => setTimeout(r, 500));
	return fetch(`${import.meta.env.VITE_SERVER_URL}/api/cart/${id}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	}).then((res) => res.json() as Promise<void>);
};

export const updateCartQuantity = async (data: UpdateCartQuantityRequest) => {
	await new Promise((r) => setTimeout(r, 500));

	const request = {
		id: data.id,
		quantity: data.quantity,
	};
	return fetch(`${import.meta.env.VITE_SERVER_URL}/api/cart`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(request),
	}).then((res) => res.json() as Promise<CartItem>);
};
