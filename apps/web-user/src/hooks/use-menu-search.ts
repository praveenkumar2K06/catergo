import { useMemo, useState } from "react";
import type { MenuItem } from "@/lib/types";

export interface UseMenuSearchProps {
	menuItems: MenuItem[];
	activeCategory: string;
}

export interface UseMenuSearchReturn {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	filteredItems: MenuItem[];
	hasSearchResults: boolean;
	clearSearch: () => void;
}

export const useMenuSearch = ({
	menuItems,
	activeCategory,
}: UseMenuSearchProps): UseMenuSearchReturn => {
	const [searchQuery, setSearchQuery] = useState("");

	const filteredItems = useMemo(() => {
		let items = menuItems;

		// Filter by category first
		if (activeCategory !== "all") {
			items = items.filter((item) => item.category === activeCategory);
		}

		// Then filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			items = items.filter(
				(item) =>
					item.name.toLowerCase().includes(query) ||
					item.description.toLowerCase().includes(query) ||
					item.category.toLowerCase().includes(query),
			);
		}

		return items;
	}, [menuItems, activeCategory, searchQuery]);

	const hasSearchResults = filteredItems.length > 0;

	const clearSearch = () => {
		setSearchQuery("");
	};

	return {
		searchQuery,
		setSearchQuery,
		filteredItems,
		hasSearchResults,
		clearSearch,
	};
};
