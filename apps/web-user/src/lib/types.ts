export interface UserData {
	name: string;
	phone: string;
	address: string;
	pincode: string;
	numberOfPeople: number;
	selectedDate: Date | undefined;
}

export interface MenuItem {
	id: string;
	name: string;
	description: string;
	price: number;
	image: string;
	category: string;
	isVeg: boolean;
	qtyPerUnit: number;
	metrics: string;
}

export interface CartItems {
	[key: string]: CartItem;
}

export interface CartItem {
	item: MenuItem;
	quantity: number;
}
