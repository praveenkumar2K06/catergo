import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ErrorDisplay from "@/components/shared/layout/error";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
	type Category,
	categoriesQueryOptions,
	createCategory,
	deleteCategory,
	updateCategory,
} from "@/lib/api/categories";

interface CategoryFormData {
	name: string;
	icon: string;
}

export const CategorySettings = () => {
	const queryClient = useQueryClient();
	const loader = useLoaderData({ from: "/_authed/settings" });
	const adminId = loader.adminId || "";

	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState<Category | null>(
		null,
	);
	const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
		null,
	);
	const [formData, setFormData] = useState<CategoryFormData>({
		name: "",
		icon: "🍽️",
	});

	const {
		data: categories = [],
		isLoading,
		isError,
	} = useQuery({
		...categoriesQueryOptions(adminId),
		enabled: !!adminId,
	});

	const createMutation = useMutation({
		mutationFn: createCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["categories", adminId],
			});
			toast.success("Category created successfully");
			handleCloseForm();
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
			handleCloseForm();
		},
		onError: (error) => {
			toast.error("Failed to update category", {
				description: error.message,
			});
		},
	});

	const deleteMutation = useMutation({
		mutationFn: deleteCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["categories", adminId],
			});
			toast.success("Category deleted successfully");
			setIsDeleteDialogOpen(false);
			setCategoryToDelete(null);
		},
		onError: (error) => {
			toast.error("Failed to delete category", {
				description: error.message,
			});
		},
	});

	const handleOpenForm = (category?: Category) => {
		if (category) {
			setEditingCategory(category);
			setFormData({ name: category.name, icon: category.icon });
		} else {
			setEditingCategory(null);
			setFormData({ name: "", icon: "🍽️" });
		}
		setIsFormOpen(true);
	};

	const handleCloseForm = () => {
		setIsFormOpen(false);
		setEditingCategory(null);
		setFormData({ name: "", icon: "🍽️" });
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.name.trim()) {
			toast.error("Category name is required");
			return;
		}

		if (editingCategory) {
			updateMutation.mutate({ id: editingCategory.id, data: formData });
		} else {
			createMutation.mutate(formData);
		}
	};

	const handleDeleteClick = (category: Category) => {
		setCategoryToDelete(category);
		setIsDeleteDialogOpen(true);
	};

	const handleConfirmDelete = () => {
		if (categoryToDelete) {
			deleteMutation.mutate(categoryToDelete.id);
		}
	};

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div>
					<Skeleton className="mb-2 h-6 w-48" />
					<Skeleton className="h-4 w-64" />
				</div>
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-32" />
						<Skeleton className="h-4 w-48" />
					</CardHeader>
					<CardContent className="space-y-3">
						{Array.from({ length: 4 }).map((_, i) => (
							<Skeleton
								// biome-ignore lint/suspicious/noArrayIndexKey: Placeholder skeletons
								key={`skeleton-${i}`}
								className="h-12 w-full"
							/>
						))}
					</CardContent>
				</Card>
			</div>
		);
	}

	if (isError) {
		return <ErrorDisplay type="server" className="h-max" />;
	}

	return (
		<div className="space-y-6">
			<div>
				<h2 className="font-bold text-lg">Category Management</h2>
				<p className="text-muted-foreground text-sm">
					Manage your menu categories. Categories help organize your
					menu items.
				</p>
			</div>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle>Categories</CardTitle>
						<CardDescription>
							{categories.length} categor
							{categories.length === 1 ? "y" : "ies"} configured
						</CardDescription>
					</div>
					<Button onClick={() => handleOpenForm()} size="sm">
						<Plus className="mr-2 h-4 w-4" />
						Add Category
					</Button>
				</CardHeader>
				<CardContent>
					{categories.length === 0 ? (
						<div className="py-8 text-center text-muted-foreground">
							<p>No categories yet.</p>
							<p className="text-sm">
								Add your first category to organize your menu
								items.
							</p>
						</div>
					) : (
						<div className="space-y-2">
							{categories.map((category) => (
								<div
									key={category.id}
									className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
								>
									<div className="flex items-center gap-3">
										<GripVertical className="h-4 w-4 cursor-grab text-muted-foreground" />
										<span className="text-xl">
											{category.icon}
										</span>
										<span className="font-medium">
											{category.name}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<Button
											variant="ghost"
											size="icon"
											onClick={() =>
												handleOpenForm(category)
											}
										>
											<Pencil className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											onClick={() =>
												handleDeleteClick(category)
											}
										>
											<Trash2 className="h-4 w-4 text-destructive" />
										</Button>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Category Form Dialog */}
			<Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
				<DialogContent className="sm:max-w-[400px]">
					<DialogHeader>
						<DialogTitle>
							{editingCategory
								? "Edit Category"
								: "Add New Category"}
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
							/>
							<p className="text-muted-foreground text-xs">
								Use an emoji to represent this category
							</p>
						</div>
						<div className="flex justify-end gap-2 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={handleCloseForm}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={
									createMutation.isPending ||
									updateMutation.isPending
								}
							>
								{createMutation.isPending ||
								updateMutation.isPending
									? "Saving..."
									: editingCategory
										? "Update"
										: "Create"}
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Category</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete "
							{categoryToDelete?.name}"? This action cannot be
							undone. Note: You cannot delete a category if menu
							items are using it.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleConfirmDelete}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							disabled={deleteMutation.isPending}
						>
							{deleteMutation.isPending
								? "Deleting..."
								: "Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};
