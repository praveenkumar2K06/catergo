import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import ErrorDisplay from "@/components/shared/layout/error";
import Loader from "@/components/shared/layout/loader";
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
import { deleteMenuItem, fetchMenuQuery } from "@/lib/api/menu-items";
import type { MenuItem } from "@/types";
import { MenuForm } from "./menu-form";
import { MenuItemTable } from "./menu-items";

export default function MenuPage() {
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [formItem, setFormItem] = useState<MenuItem | null>(null);
	const { data, isPending, isError, error } = useQuery(fetchMenuQuery);

	const deleteItemMutation = useMutation({
		mutationFn: deleteMenuItem,
		onError: (error) => {
			console.error("Error deleting menu item:", error);
			toast.error("Failed to delete menu item. Please try again.", {
				description: error.message,
			});
		},
		onSuccess() {
			toast.success("Menu item deleted successfully");
		},
	});

	if (isPending) {
		return <Loader variant="catering" />;
	}

	if (isError) {
		return <ErrorDisplay type="server" message={error.message} />;
	}

	return (
		<div>
			<AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<div>
					<div className="flex flex-row items-center justify-between">
						<div>
							<h1 className="font-bold text-2xl">Menu</h1>
							<p className="text-gray-500 text-sm">
								Manage your menu items
							</p>
						</div>
						<Button
							onClick={() => {
								setFormItem(null);
								setIsFormOpen(true);
							}}
						>
							Add Menu Item
						</Button>
					</div>
					<div>
						<MenuItemTable
							data={{
								menuItems: data.data,
								pagination: {
									page: 0,
									totalPages: 1,
									pageSize: 10,
								},
							}}
							handlePaginationChange={() =>
								toast.info("To be implemented", {
									description:
										"This feature is not yet available.",
								})
							}
							handleSortingChange={() =>
								toast.info("To be implemented", {
									description:
										"This feature is not yet available.",
								})
							}
							handleFilterChange={() =>
								toast.info("To be implemented", {
									description:
										"This feature is not yet available.",
								})
							}
							onEditMenuItem={(menuItem) => {
								setFormItem(menuItem);
								setIsFormOpen(true);
							}}
							onDeleteMenuItem={(menuItem) => {
								setFormItem(menuItem);
								setIsDialogOpen(true);
							}}
						/>
					</div>
				</div>
				<MenuForm
					open={isFormOpen}
					onOpenChange={setIsFormOpen}
					onSuccess={() => {
						setFormItem(null);
						setIsFormOpen(false);
					}}
					initialData={formItem || undefined}
				/>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you absolutely sure?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently
							delete this menu item.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								if (formItem?.id) {
									deleteItemMutation.mutate(formItem?.id);
								}
								setIsDialogOpen(false);
							}}
						>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
