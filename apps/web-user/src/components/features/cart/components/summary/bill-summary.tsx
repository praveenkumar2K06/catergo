import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface BillSummaryProps {
	totalItems: number;
	subtotal: number;
	deliveryFee: number;
	taxes: number;
	total: number;
	discount?: number;
	originalSubtotal?: number;
}

export function BillSummary({
	totalItems,
	subtotal,
	deliveryFee,
	taxes,
	total,
	discount = 0,
	originalSubtotal,
}: BillSummaryProps) {
	return (
		<Card className="border-border bg-card">
			<CardHeader>
				<CardTitle className="text-foreground text-lg">
					Bill Summary
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<motion.div
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.1, duration: 0.3 }}
					className="flex justify-between text-sm"
				>
					<span className="text-muted-foreground">
						Subtotal ({totalItems} items)
					</span>
					<span className="text-foreground">
						₹{originalSubtotal || subtotal}
					</span>
				</motion.div>

				{discount > 0 && (
					<motion.div
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.15, duration: 0.3 }}
						className="flex justify-between text-sm"
					>
						<span className="text-muted-foreground">
							Bulk Order Discount
						</span>
						<span className="font-medium text-green-600">
							-₹{discount}
						</span>
					</motion.div>
				)}

				<motion.div
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.2, duration: 0.3 }}
					className="flex justify-between text-sm"
				>
					<span className="text-muted-foreground">
						Delivery Fee{" "}
						{subtotal > 500 && (
							<span className="text-primary">
								(Free above ₹500)
							</span>
						)}
					</span>
					<span className="text-foreground">
						{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
					</span>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.3, duration: 0.3 }}
					className="flex justify-between text-sm"
				>
					<span className="text-muted-foreground">
						Taxes & Charges
					</span>
					<span className="text-foreground">₹{taxes}</span>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, scaleX: 0 }}
					animate={{ opacity: 1, scaleX: 1 }}
					transition={{ delay: 0.4, duration: 0.3 }}
				>
					<Separator className="bg-border" />
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						delay: 0.5,
						duration: 0.4,
						type: "spring",
						stiffness: 200,
					}}
					className="flex justify-between font-semibold text-lg"
				>
					<span className="text-foreground">Total</span>
					<span className="text-primary">₹{total}</span>
				</motion.div>

				{subtotal < 500 && (
					<motion.div
						initial={{ opacity: 0, y: 10, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						transition={{ delay: 0.6, duration: 0.4 }}
						className="rounded bg-accent/10 p-2 text-accent text-xs"
					>
						Add ₹{500 - subtotal} more to get free delivery!
					</motion.div>
				)}
			</CardContent>
		</Card>
	);
}
