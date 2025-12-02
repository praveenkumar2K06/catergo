import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	type Category,
	createCategory,
	updateCategory,
} from "@/lib/api/categories";

interface CategoryFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
	initialData?: Category;
	adminId: string;
}

interface CategoryFormData {
	name: string;
	icon: string;
}

export function CategoryForm({
	open,
	onOpenChange,
	onSuccess,
	initialData,
	adminId,
}: CategoryFormProps) {
	const queryClient = useQueryClient();
	const isEditing = !!initialData?.id;

	const [formData, setFormData] = useState<CategoryFormData>({
		name: "",
		icon: "🍽️",
	});

	// Reset form when dialog opens/closes or initialData changes
	useEffect(() => {
		if (open) {
			if (initialData) {
				setFormData({
					name: initialData.name,
					icon: initialData.icon,
				});
			} else {
				setFormData({
					name: "",
					icon: "🍽️",
				});
			}
		}
	}, [open, initialData]);

	const createMutation = useMutation({
		mutationFn: createCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["categories", adminId],
			});
			toast.success("Category created successfully");
			onOpenChange(false);
			onSuccess?.();
		},
		onError: (error) => {
			toast.error("Failed to create category", {
				description: error.message,
			});
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: CategoryFormData }) =>
			updateCategory(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["categories", adminId],
			});
			toast.success("Category updated successfully");
			onOpenChange(false);
			onSuccess?.();
		},
		onError: (error) => {
			toast.error("Failed to update category", {
				description: error.message,
			});
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.name.trim()) {
			toast.error("Category name is required");
			return;
		}

		if (isEditing && initialData) {
			updateMutation.mutate({ id: initialData.id, data: formData });
		} else {
			createMutation.mutate(formData);
		}
	};

	const isPending = createMutation.isPending || updateMutation.isPending;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[400px]">
				<DialogHeader>
					<DialogTitle>
						{isEditing ? "Edit Category" : "Add New Category"}
					</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="category-name">Name</Label>
						<Input
							id="category-name"
							value={formData.name}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									name: e.target.value,
								}))
							}
							placeholder="e.g., Starters, Main Course"
							disabled={isPending}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="category-icon">Icon (Emoji)</Label>
						<Input
							id="category-icon"
							value={formData.icon}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									icon: e.target.value,
								}))
							}
							placeholder="🍽️"
							className="text-2xl"
							disabled={isPending}
						/>
						<p className="text-muted-foreground text-xs">
							Use an emoji to represent this category
						</p>
					</div>
					<div className="flex justify-end gap-2 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isPending}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isPending}>
							{isPending ? (
								<>
									<LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
									Saving...
								</>
							) : isEditing ? (
								"Update"
							) : (
								"Create"
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
