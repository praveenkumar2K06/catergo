import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { UserData } from "@/lib/types";

interface DeliveryInfoProps {
	userData: UserData;
	eventName: string;
	eventDescription: string;
	onEventNameChange: (name: string) => void;
	onEventDescriptionChange: (description: string) => void;
}

export function DeliveryInfo({
	userData,
	eventName,
	eventDescription,
	onEventNameChange,
	onEventDescriptionChange,
}: DeliveryInfoProps) {
	return (
		<Card className="border-border bg-card">
			<CardHeader className="pb-3">
				<CardTitle className="text-foreground text-lg">
					Event & Delivery Details
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Event Name */}
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1, duration: 0.3 }}
					className="space-y-2"
				>
					<Label htmlFor="eventName" className="text-sm">
						Event Name{" "}
						<span className="text-muted-foreground">
							(Optional)
						</span>
					</Label>
					<Input
						id="eventName"
						placeholder="e.g., Birthday Party, Office Meeting"
						value={eventName}
						onChange={(e) => onEventNameChange(e.target.value)}
						className="w-full"
					/>
				</motion.div>

				{/* Event Description */}
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.3 }}
					className="space-y-2"
				>
					<Label htmlFor="eventDescription" className="text-sm">
						Event Description{" "}
						<span className="text-muted-foreground">
							(Optional)
						</span>
					</Label>
					<Textarea
						id="eventDescription"
						placeholder="Any special instructions or details about your event..."
						value={eventDescription}
						onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
							onEventDescriptionChange(e.target.value)
						}
						className="min-h-[80px] w-full resize-none"
					/>
				</motion.div>

				{/* Divider */}
				<div className="border-border border-t pt-4" />

				{/* Delivery Details */}
				<motion.div
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.3, duration: 0.3 }}
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
					transition={{ delay: 0.4, duration: 0.3 }}
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
					transition={{ delay: 0.5, duration: 0.3 }}
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
