import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { categories } from "./menu-data";

interface MenuCategoriesProps {
	activeCategory: string;
	onCategoryChange: (category: string) => void;
}

export function MenuCategories({
	activeCategory,
	onCategoryChange,
}: MenuCategoriesProps) {
	return (
		<div className="sticky top-0 z-10 border-border border-b bg-card/95 py-4 backdrop-blur-sm">
			<ScrollArea className="w-full">
				<div className="flex gap-2 px-4">
					{categories.map((category) => (
						<Button
							key={category.id}
							variant={
								activeCategory === category.id
									? "default"
									: "outline"
							}
							size="sm"
							onClick={() => onCategoryChange(category.id)}
							className="flex items-center gap-2 whitespace-nowrap transition-all duration-200 hover:scale-105"
						>
							<span className="text-sm">{category.icon}</span>
							<span className="font-medium">{category.name}</span>
						</Button>
					))}
				</div>
			</ScrollArea>
		</div>
	);
}
