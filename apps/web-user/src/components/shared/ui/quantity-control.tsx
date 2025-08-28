import { Minus, Plus, RotateCcw } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { AnimatedButton, Button } from "@/components/ui/button";
import { fadeAnimation } from "@/lib/animations";
import { sanitizeQuantity } from "@/lib/validation";

interface QuantityControlProps {
	quantity: number;
	suggestedQuantity: number;
	onQuantityChange: (newQuantity: number) => void;
	showMetrics?: boolean;
	metrics?: string;
	disabled?: boolean;
	size?: "sm" | "default";
	className?: string;
}

export function QuantityControl({
	quantity,
	suggestedQuantity,
	onQuantityChange,
	showMetrics = false,
	metrics = "",
	disabled = false,
	size = "default",
	className = "",
}: QuantityControlProps) {
	const buttonSize = size === "sm" ? "sm" : "icon";
	const buttonClass = size === "sm" ? "h-8 w-8" : "h-8 w-8";

	const handleDecrement = () => {
		const newQuantity = sanitizeQuantity(quantity - 1);
		if (newQuantity >= 1) {
			onQuantityChange(newQuantity);
		}
	};

	const handleIncrement = () => {
		const newQuantity = sanitizeQuantity(quantity + 1);
		onQuantityChange(newQuantity);
	};

	const handleReset = () => {
		const newQuantity = sanitizeQuantity(suggestedQuantity);
		onQuantityChange(newQuantity);
	};

	return (
		<div className={`flex items-center gap-2 ${className}`}>
			<Button
				size={buttonSize}
				variant="outline"
				onClick={handleDecrement}
				className={buttonClass}
				disabled={disabled || quantity <= 1}
			>
				<Minus className="h-3 w-3" />
			</Button>

			<span className="min-w-[2rem] text-center font-medium text-foreground">
				{quantity}
				{showMetrics && metrics ? ` ${metrics}` : ""}
			</span>

			<Button
				size={buttonSize}
				variant="outline"
				onClick={handleIncrement}
				className={buttonClass}
				disabled={disabled}
			>
				<Plus className="h-3 w-3" />
			</Button>

			<AnimatePresence>
				{suggestedQuantity !== quantity && (
					<AnimatedButton
						{...fadeAnimation}
						size="icon"
						variant="outline"
						onClick={handleReset}
						className="h-8 w-8"
						disabled={disabled}
					>
						<RotateCcw className="h-3 w-3" />
					</AnimatedButton>
				)}
			</AnimatePresence>
		</div>
	);
}
