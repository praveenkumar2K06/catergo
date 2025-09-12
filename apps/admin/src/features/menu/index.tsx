import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData, useNavigate, useSearch } from "@tanstack/react-router";
import type { ColumnFiltersState } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
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
	const navigate = useNavigate();
	const loader = useLoaderData({ from: "/_authed/menu" });
	const search = useSearch({ from: "/_authed/menu" });
	const { data } = useSuspenseQuery(
		fetchMenuQuery(search.page ?? 0, search.pageSize ?? 10, search.name),
	);

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

	const handlePaginationChange = (page: number, pageSize: number) => {
		navigate({
			to: "/menu",
			search: {
				...search,
				page,
				pageSize,
			},
			replace: true,
		});
	};

	const handleFilterChange = (filters: ColumnFiltersState) => {
		const searchField = filters.find((field) => field.id === "name");

		navigate({
			to: "/menu",
			search: {
				...search,
				page: 0,
				name: searchField?.value as string | undefined,
			},
		});
	};

	const handleFilterDebounce = useDebouncedCallback(handleFilterChange, 500);

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
						<div className="flex gap-2">
							<Button
								onClick={() => {
									navigator.clipboard.writeText(
										`${import.meta.env.VITE_FRONTEND_URL}/caterer/${loader.adminId}`,
									);
									toast.success("Link copied to clipboard");
								}}
							>
								Copy your unique link
							</Button>
							<Button
								onClick={() => {
									setFormItem(null);
									setIsFormOpen(true);
								}}
							>
								Add Menu Item
							</Button>
						</div>
					</div>
					<div>
						<MenuItemTable
							data={{
								menuItems: data.data,
								pagination: data.pagination,
							}}
							handlePaginationChange={handlePaginationChange}
							handleSortingChange={() =>
								toast.info("To be implemented", {
									description:
										"This feature is not yet available.",
								})
							}
							handleFilterChange={handleFilterDebounce}
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
