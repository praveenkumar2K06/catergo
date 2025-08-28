export interface UserData {
	id?: string;
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

export interface CartItem {
	id?: string;
	item: MenuItem;
	quantity: number;
}
