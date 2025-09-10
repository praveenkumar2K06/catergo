import { useMutation } from "@tanstack/react-query";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import NextImageLoading from "@/components/ui/image-loader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { verifyCaterer } from "@/lib/api/caterer";
import { handleMutationError } from "@/lib/error-handlers";

interface CatererEntryProps {
	onComplete: (catererId: string) => void;
}

export function CatererEntry({ onComplete }: CatererEntryProps) {
	const [catererId, setCatererId] = useState("");
	const [error, setError] = useState("");

	const verifyCatererMutation = useMutation({
		mutationFn: verifyCaterer,
		onSuccess: () => {
			onComplete(catererId.trim());
		},
		onError(error) {
			handleMutationError(
				error,
				"Failed to verify Caterer ID. Please try again.",
			);
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!catererId.trim()) {
			setError("Please enter a valid Caterer ID");
			return;
		}

		setError("");
		verifyCatererMutation.mutate(catererId.trim());
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<Card className="w-full max-w-md border-0 shadow-lg">
				<CardHeader className="text-center">
					<CardTitle className="font-bold text-2xl">
						Welcome to FoodOrder
					</CardTitle>
					<CardDescription>
						Enter your Caterer ID to get started with your food
						ordering experience
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="mb-6 flex items-center justify-center">
							<NextImageLoading
								src={"/logo512.png"}
								alt="Personal details illustration"
								className="h-auto w-full"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="catererId">Caterer ID</Label>
							<Input
								id="catererId"
								type="text"
								placeholder="Enter your caterer ID"
								disabled={verifyCatererMutation.isPending}
								value={catererId}
								onChange={(e) => setCatererId(e.target.value)}
							/>
							{error && (
								<p className="text-destructive text-sm">
									{error}
								</p>
							)}
						</div>

						<Button
							type="submit"
							className="w-full"
							disabled={verifyCatererMutation.isPending}
						>
							{verifyCatererMutation.isPending
								? "Loading..."
								: "Continue to Order"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
