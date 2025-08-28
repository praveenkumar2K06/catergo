import { ArrowLeft } from "lucide-react";
import { ModeToggle } from "@/components/shared/layout/mode-toggle";
import { Button } from "@/components/ui/button";
import type { UserData } from "@/lib/types";

interface CartHeaderProps {
	totalItems: number;
	userData: UserData;
	onBack: () => void;
}

export function CartHeader({ totalItems, userData, onBack }: CartHeaderProps) {
	return (
		<div className="border-border border-b bg-card px-4 py-3">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Button variant="ghost" size="sm" onClick={onBack}>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<div>
						<h1 className="font-bold text-foreground text-xl">
							Your Cart
						</h1>
						<p className="text-muted-foreground text-sm">
							{totalItems} items • For {userData.numberOfPeople}{" "}
							people
						</p>
					</div>
				</div>
				<ModeToggle />
			</div>
		</div>
	);
}
