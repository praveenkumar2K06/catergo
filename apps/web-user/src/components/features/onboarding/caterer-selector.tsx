import { useMutation, useQuery } from "@tanstack/react-query";
import type React from "react";
import { useState } from "react";
import ErrorDisplay from "@/components/shared/layout/error";
import Loader from "@/components/shared/layout/loader";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import NextImageLoading from "@/components/ui/image-loader";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { getAllCaterers, verifyCaterer } from "@/lib/api/caterer";
import { handleMutationError } from "@/lib/error-handlers";

interface CatererEntryProps {
	onComplete: (catererId: string, catererName: string) => void;
}

export function CatererEntry({ onComplete }: CatererEntryProps) {
	const [selectedCatererId, setSelectedCatererId] = useState("");
	const [error, setError] = useState("");

	const {
		isPending,
		data,
		error: queryError,
	} = useQuery({
		queryKey: ["all-caterers"],
		queryFn: getAllCaterers,
	});

	const verifyCatererMutation = useMutation({
		mutationFn: verifyCaterer,
		onSuccess: () => {
			const selectedCaterer = data?.data.find(
				(caterer) => caterer.id === selectedCatererId,
			);
			const selectedCatererName = selectedCaterer
				? selectedCaterer.name
				: "";
			onComplete(selectedCatererId, selectedCatererName);
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

		if (!selectedCatererId) {
			setError("Please select a caterer");
			return;
		}

		setError("");
		verifyCatererMutation.mutate(selectedCatererId);
	};

	if (queryError) {
		return <ErrorDisplay type="general" />;
	}

	if (isPending) {
		return <Loader />;
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<Card className="w-full max-w-md border-0 shadow-lg">
				<CardHeader className="text-center">
					<CardTitle className="font-bold text-2xl">
						Welcome to FoodOrder
					</CardTitle>
					<CardDescription>
						Select your caterer to get started with your food
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
							<Label htmlFor="caterer-selection">
								Available Caterers
							</Label>
							<Select
								value={selectedCatererId}
								onValueChange={setSelectedCatererId}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select a caterer" />
								</SelectTrigger>
								<SelectContent>
									{data?.data.map((caterer) => (
										<SelectItem
											key={caterer.id}
											value={caterer.id}
										>
											<div className="flex flex-col">
												<span className="font-medium">
													{caterer.name}
												</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{error && (
								<p className="text-destructive text-sm">
									{error}
								</p>
							)}
						</div>

						<Button
							type="submit"
							className="w-full"
							disabled={
								verifyCatererMutation.isPending ||
								!selectedCatererId
							}
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
