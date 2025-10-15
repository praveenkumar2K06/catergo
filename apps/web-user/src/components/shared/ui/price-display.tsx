import { formatPrice } from "@/lib/validation";

interface PriceDisplayProps {
	price: number;
	quantity?: number;
	className?: string;
	showTotal?: boolean;
	currency?: string;
	hidePrices?: boolean;
}

export function PriceDisplay({
	price,
	quantity = 1,
	className = "",
	showTotal = false,
	currency,
	hidePrices = false,
}: PriceDisplayProps) {
	if (hidePrices) {
		return (
			<div />
		);
	}

	const displayPrice = showTotal ? price * quantity : price;

	return (
		<span className={`font-semibold text-primary ${className}`}>
			{formatPrice(displayPrice, currency)}
		</span>
	);
}
