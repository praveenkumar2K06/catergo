import { Minus, Plus, RotateCcw, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { AnimatedButton, Button } from "@/components/ui/button";
import { fadeAnimation } from "@/lib/animations";
import type { MenuItem } from "@/lib/types";
import NextImageLoading from "../ui/image-loader";

interface CartItemProps {
	id: string;
	item: MenuItem;
	quantity: number;
	suggestedQuantity: number;
	onUpdateQuantity: (itemId: string, quantity: number) => void;
	onRemoveItem: (itemId: string) => void;
}

export function CartItem({
	id,
	item,
	quantity,
	suggestedQuantity,
	onUpdateQuantity,
	onRemoveItem,
}: CartItemProps) {
	const updateQuantity = (newQuantity: number) => {
		if (newQuantity <= 0) {
			onRemoveItem(id);
		} else {
			onUpdateQuantity(id, newQuantity);
		}
	};

	return (
		<motion.div
			className="flex items-center gap-4 rounded-lg bg-popover p-3"
			whileHover={{ scale: 1.01 }}
			transition={{ type: "spring", stiffness: 300, damping: 24 }}
		>
			<NextImageLoading
				src={item.image}
				fallbackSrc="https://placehold.co/100x100/png"
				alt={item.name}
				className="h-16 max-h-16 w-16 rounded-lg object-cover"
			/>

			<div className="min-w-0 flex-1">
				<div className="mb-1 flex items-start justify-between">
					<h3 className="truncate font-medium text-foreground">
						{item.name}
					</h3>
					<Button
						variant="outline"
						size="icon"
						onClick={() => onRemoveItem(id)}
						className="text-destructive hover:text-de"
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>

				<div className="mb-2 flex items-center gap-2">
					<Badge variant={"secondary"} className="text-xs">
						{item.isVeg ? "🟢" : "🔴"}
					</Badge>
					<span className="text-muted-foreground text-sm">
						₹{item.price}
					</span>
				</div>

				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Button
							size="sm"
							variant="outline"
							onClick={() => updateQuantity(quantity - 1)}
							className="h-8 w-8"
						>
							<Minus className="h-3 w-3" />
						</Button>
						<span className="min-w-[2rem] text-center font-medium text-foreground">
							{quantity}
						</span>
						<Button
							size="sm"
							variant="outline"
							onClick={() => updateQuantity(quantity + 1)}
							className="h-8 w-8"
						>
							<Plus className="h-3 w-3" />
						</Button>
						<AnimatePresence>
							{suggestedQuantity !== quantity && (
								<AnimatedButton
									{...fadeAnimation}
									size="icon"
									variant="outline"
									onClick={() =>
										updateQuantity(suggestedQuantity)
									}
									className="h-8 w-8"
								>
									<RotateCcw className="h-3 w-3" />
								</AnimatedButton>
							)}
						</AnimatePresence>
					</div>

					<div className="text-right">
						<div className="font-semibold text-foreground">
							₹{item.price * quantity}
						</div>
						<AnimatePresence>
							{quantity !== suggestedQuantity && (
								<motion.div
									{...fadeAnimation}
									className="text-muted-foreground text-xs"
								>
									Suggested: {suggestedQuantity}
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
