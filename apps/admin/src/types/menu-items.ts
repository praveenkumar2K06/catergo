export interface MenuItem {
	id: string;
	name: string;
	description: string;
	price: number;
	image: string;
	category: string;
	isVeg: boolean;
	qtyPerUnit: number;
	metrics: Metrics;
}

enum Metrics {
	Piece = "Piece",
	Kg = "Kg",
	Litre = "Litre",
}
