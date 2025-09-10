import type { MenuItem } from "./menu-items";

export interface CartItem {
	id: string;
	userId: string;
	menuItemId: string;
	quantity: number;
	createdAt: Date;
	updatedAt: Date;
	menuItem: MenuItem;
}

export interface EventUser {
	id: string;
	name: string;
	phone: string;
	address: string;
	pincode: string;
	numberOfPeople: number;
	selectedDate: string;
	createdAt: Date;
	adminId: string;
	cartItems: CartItem[];
}

export interface UserEvent {
	id: string;
	name: string;
	date: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface EventExtended extends UserEvent {
	user: EventUser;
}
