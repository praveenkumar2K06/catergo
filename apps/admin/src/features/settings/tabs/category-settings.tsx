import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import { Plus } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
	type Category,
	categoriesQueryOptions,
	deleteCategory,
} from "@/lib/api/categories";
import { CategoryForm, CategoryTable } from "./categories";

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

	const {
		data: categories = [],
		isLoading,
		isError,
	} = useQuery({
		...categoriesQueryOptions(adminId),
		enabled: !!adminId,
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

	const handleEditCategory = (category: Category) => {
		setEditingCategory(category);
		setIsFormOpen(true);
	};

	const handleDeleteCategory = (category: Category) => {
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
				<div className="space-y-3">
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton
							// biome-ignore lint/suspicious/noArrayIndexKey: Placeholder skeletons
							key={`skeleton-${i}`}
							className="h-12 w-full"
						/>
					))}
				</div>
			</div>
		);
	}

	if (isError) {
		return <ErrorDisplay type="server" className="h-max" />;
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-row items-center justify-between">
				<div>
					<h2 className="font-bold text-lg">Category Management</h2>
					<p className="text-muted-foreground text-sm">
						Manage your menu categories. Categories help organize
						your menu items.
					</p>
				</div>
				<Button
					onClick={() => {
						setEditingCategory(null);
						setIsFormOpen(true);
					}}
					size="sm"
				>
					<Plus className="mr-2 h-4 w-4" />
					Add Category
				</Button>
			</div>

			<CategoryTable
				data={categories}
				onEditCategory={handleEditCategory}
				onDeleteCategory={handleDeleteCategory}
			/>

			{/* Category Form Dialog */}
			<CategoryForm
				open={isFormOpen}
				onOpenChange={setIsFormOpen}
				onSuccess={() => {
					setEditingCategory(null);
					setIsFormOpen(false);
				}}
				initialData={editingCategory || undefined}
				adminId={adminId}
			/>

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
