export interface UserEvent {
	id: string;
	name: string;
	date: Date;
	description: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface CartItemMenuItem {
	id: string;
	name: string;
	description: string;
	price: number;
	image: string;
	category: string;
	isVeg: boolean;
	qtyPerUnit: number;
	metrics: "Piece" | "Kg" | "Litre";
}

export interface UserCartItem {
	id: string;
	quantity: number;
	menuItem: CartItemMenuItem;
}

export interface User {
	id: string;
	name: string;
	phone: string;
	address: string;
	pincode: string;
	numberOfPeople: number;
	selectedDate: Date;
	createdAt: Date;
	updatedAt: Date;
	event?: UserEvent | null;
	cartItems?: UserCartItem[];
}
