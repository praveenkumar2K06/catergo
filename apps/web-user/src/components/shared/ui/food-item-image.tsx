import NextImageLoading from "@/components/ui/image-loader";
import type { MenuItem } from "@/lib/types";

interface FoodItemImageProps {
	item: MenuItem;
	className?: string;
	showOverlay?: boolean;
}

export function FoodItemImage({
	item,
	className = "",
	showOverlay = false,
}: FoodItemImageProps) {
	const defaultFallback = "https://placehold.co/600x400/png";

	if (!item.image) {
		return (
			<div className={`relative overflow-hidden bg-muted ${className}`}>
				<NextImageLoading
					src={defaultFallback}
					fallbackSrc={defaultFallback}
					alt={item.name}
					className="h-72 w-full object-cover transition-transform duration-300 group-hover:scale-105"
				/>
				{showOverlay && (
					<div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
				)}
			</div>
		);
	}

	return (
		<div className={`relative overflow-hidden ${className}`}>
			<NextImageLoading
				src={item.image}
				fallbackSrc={defaultFallback}
				alt={item.name}
				className="h-72 w-full object-cover transition-transform duration-300 group-hover:scale-105"
			/>
			{showOverlay && (
				<div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
			)}
		</div>
	);
}
