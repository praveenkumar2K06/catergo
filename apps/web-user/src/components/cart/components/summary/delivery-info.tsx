import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserData } from "@/lib/types";

interface DeliveryInfoProps {
	userData: UserData;
}

export function DeliveryInfo({ userData }: DeliveryInfoProps) {
	return (
		<Card className="border-border bg-card">
			<CardHeader className="pb-3">
				<CardTitle className="text-foreground text-lg">
					Delivery Details
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2">
				<motion.div
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.1, duration: 0.3 }}
					className="flex justify-between text-sm"
				>
					<span className="text-muted-foreground">
						Delivering to:
					</span>
					<span className="font-medium text-foreground">
						{userData.name}
					</span>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.2, duration: 0.3 }}
					className="flex justify-between text-sm"
				>
					<span className="text-muted-foreground">Address:</span>
					<span className="max-w-[200px] text-right text-foreground">
						{userData.address}
					</span>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.3, duration: 0.3 }}
					className="flex justify-between text-sm"
				>
					<span className="text-muted-foreground">Date:</span>
					<span className="text-foreground">
						{userData.selectedDate
							? new Date(
									userData.selectedDate,
								).toLocaleDateString()
							: "Date Not Specified"}
					</span>
				</motion.div>
			</CardContent>
		</Card>
	);
}
