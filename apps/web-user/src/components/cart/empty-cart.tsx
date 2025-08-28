import { ArrowLeft, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

interface EmptyCartProps {
	onBack: () => void;
}

export function EmptyCart({ onBack }: EmptyCartProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			className="min-h-screen bg-background text-foreground"
		>
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1, duration: 0.4 }}
				className="border-border border-b bg-card px-4 py-3"
			>
				<div className="flex items-center gap-3">
					<Button variant="ghost" size="sm" onClick={onBack}>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<h1 className="font-bold text-foreground text-xl">
						Your Cart
					</h1>
				</div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
				className="flex min-h-[60vh] flex-col items-center justify-center px-4"
			>
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{
						delay: 0.5,
						type: "spring",
						stiffness: 200,
						damping: 20,
					}}
				>
					<ShoppingBag className="mb-4 h-16 w-16 text-muted" />
				</motion.div>
				<motion.h2
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.6, duration: 0.4 }}
					className="mb-2 font-semibold text-foreground text-xl"
				>
					Your cart is empty
				</motion.h2>
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.7, duration: 0.4 }}
					className="mb-6 text-center text-muted"
				>
					Add some delicious items from our menu to get started
				</motion.p>
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.8, duration: 0.4 }}
				>
					<Button
						onClick={onBack}
						className="bg-primary text-primary-foreground hover:opacity-90"
					>
						Browse Menu
					</Button>
				</motion.div>
			</motion.div>
		</motion.div>
	);
}
