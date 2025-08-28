import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MenuSearchProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	onClearSearch: () => void;
	placeholder?: string;
	className?: string;
}

export function MenuSearch({
	searchQuery,
	onSearchChange,
	onClearSearch,
	placeholder = "Search menu items...",
	className = "",
}: MenuSearchProps) {
	return (
		<div className={`relative ${className}`}>
			<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
			<Input
				type="text"
				placeholder={placeholder}
				value={searchQuery}
				onChange={(e) => onSearchChange(e.target.value)}
				className="pr-10 pl-10"
			/>
			{searchQuery && (
				<Button
					variant="ghost"
					size="sm"
					onClick={onClearSearch}
					className="-translate-y-1/2 absolute top-1/2 right-1 h-7 w-7 p-0"
				>
					<X className="h-4 w-4" />
				</Button>
			)}
		</div>
	);
}
