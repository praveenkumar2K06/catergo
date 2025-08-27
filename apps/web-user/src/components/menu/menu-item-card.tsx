import { useTransition } from "@react-spring/web";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnimatedButton, Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { MenuItem } from "@/lib/types";
import NextImageLoading from "../ui/image-loader";

interface MenuItemCardProps {
	item: MenuItem;
	quantity: number;
	suggestedQuantity: number;
	onQuantityChange: (newQuantity: number) => void;
	onAddToCart: () => void;
	cartQuantity?: number;
	numberOfPeople: number;
}

export function MenuItemCard({
	item,
	quantity,
	suggestedQuantity,
	onQuantityChange,
	onAddToCart,
	cartQuantity,
	numberOfPeople,
}: MenuItemCardProps) {
	const buttonTransition = useTransition(quantity !== suggestedQuantity, {
		from: {
			opacity: 0,
		},
		enter: {
			opacity: 1,
		},
		leave: {
			opacity: 0,
		},
		config: { duration: 150 },
	});

	return (
		<Card className="group overflow-hidden border-border/40 transition-all duration-300 hover:border-primary/20 hover:shadow-xl">
			<CardHeader>
				<div className="relative overflow-hidden">
					<div className="overflow-hidden">
						<NextImageLoading
							src={item.image}
							fallbackSrc="https://placehold.co/600x400/png"
							alt={item.name}
							className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						/>
					</div>
					<div className="absolute top-2 left-2 flex gap-1">
						<Badge variant="secondary" className="backdrop-blur-sm">
							{item.isVeg ? "🟢 Veg" : "🔴 Non-Veg"}
						</Badge>
					</div>
					<div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
				</div>
			</CardHeader>

			<CardContent className="p-4">
				<div className="mb-2 flex items-start justify-between">
					<h3 className="font-semibold text-foreground text-lg">
						{item.name}
					</h3>
					<span className="font-bold text-lg text-primary">
						₹{item.price}
					</span>
				</div>

				<p className="mb-3 line-clamp-2 text-muted-foreground text-sm">
					{item.description}
				</p>

				<div className="mb-4 flex items-center justify-end">
					<span className="font-medium text-primary text-xs">
						Suggested for {numberOfPeople} people:{" "}
						{suggestedQuantity} {item.metrics}
						{suggestedQuantity > 1 ? "s" : ""}
					</span>
				</div>

				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Button
							size="icon"
							variant="outline"
							onClick={() => onQuantityChange(quantity - 1)}
							className="h-8 w-8"
							disabled={quantity <= 1}
						>
							<Minus className="h-3 w-3" />
						</Button>
						<span className="min-w-[2rem] text-center font-medium text-foreground">
							{quantity} {item.metrics}
							{quantity > 1 ? "s" : ""}
						</span>
						<Button
							size="icon"
							variant="outline"
							onClick={() => onQuantityChange(quantity + 1)}
							className="h-8 w-8"
						>
							<Plus className="h-3 w-3" />
						</Button>
						{buttonTransition(
							(style, show) =>
								show && (
									<AnimatedButton
										size="icon"
										variant="outline"
										onClick={() =>
											onQuantityChange(suggestedQuantity)
										}
										style={style}
										className="h-8 w-8"
									>
										<RotateCcw className="h-3 w-3" />
									</AnimatedButton>
								),
						)}
					</div>

					<Button
						onClick={onAddToCart}
						className="bg-primary text-primary-foreground hover:bg-primary/90"
						size="sm"
					>
						Add to Cart
					</Button>
				</div>

				{cartQuantity && (
					<div className="mt-2 font-medium text-chart-3 text-xs">
						✓ {cartQuantity} in cart
					</div>
				)}
			</CardContent>
		</Card>
	);
}
