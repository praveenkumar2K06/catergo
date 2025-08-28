import { formatPrice } from "@/lib/validation";

interface PriceDisplayProps {
	price: number;
	quantity?: number;
	className?: string;
	showTotal?: boolean;
	currency?: string;
}

export function PriceDisplay({
	price,
	quantity = 1,
	className = "",
	showTotal = false,
	currency,
}: PriceDisplayProps) {
	const displayPrice = showTotal ? price * quantity : price;

	return (
		<span className={`font-semibold text-primary ${className}`}>
			{formatPrice(displayPrice, currency)}
		</span>
	);
}
