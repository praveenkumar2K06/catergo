import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
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
import { deleteUser, fetchUsersQuery } from "@/lib/api/users";
import type { User } from "@/types";
import { UserDetailsDialog } from "./user-details-dialog";
import { UserForm } from "./user-form";
import { UserTable } from "./users-table";

export default function UsersPage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const search = useSearch({ from: "/_authed/users" });
	const { data } = useSuspenseQuery(
		fetchUsersQuery(search.page ?? 0, search.pageSize ?? 10, search.name),
	);

	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const [userToDelete, setUserToDelete] = useState<User | null>(null);
	const [userToView, setUserToView] = useState<User | null>(null);

	const deleteMutation = useMutation({
		mutationFn: deleteUser,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["users"],
			});
			toast.success("User deleted successfully");
			setIsDeleteDialogOpen(false);
			setUserToDelete(null);
		},
		onError: (error) => {
			toast.error("Failed to delete user", {
				description: error.message,
			});
		},
	});

	const handlePaginationChange = (page: number, pageSize: number) => {
		navigate({
			to: "/users",
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
			to: "/users",
			search: {
				...search,
				page: 0,
				name: searchField?.value as string | undefined,
			},
		});
	};

	const handleFilterDebounce = useDebouncedCallback(handleFilterChange, 500);

	const handleEditUser = (user: User) => {
		setEditingUser(user);
		setIsFormOpen(true);
	};

	const handleDeleteUser = (user: User) => {
		setUserToDelete(user);
		setIsDeleteDialogOpen(true);
	};

	const handleViewDetails = (user: User) => {
		setUserToView(user);
		setIsDetailsDialogOpen(true);
	};

	const handleConfirmDelete = () => {
		if (userToDelete) {
			deleteMutation.mutate(userToDelete.id);
		}
	};

	return (
		<div>
			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<div>
					<div className="flex flex-row items-center justify-between">
						<div>
							<h1 className="font-bold text-2xl">Users</h1>
							<p className="text-gray-500 text-sm">
								Manage your users
							</p>
						</div>
						<Button
							onClick={() => {
								setEditingUser(null);
								setIsFormOpen(true);
							}}
						>
							Add User
						</Button>
					</div>
					<div>
						<UserTable
							data={{
								users: data.data,
								pagination: {
									page: 0,
									totalPages: 1,
									pageSize: 10,
								},
							}}
							handlePaginationChange={handlePaginationChange}
							handleSortingChange={() =>
								toast.info("To be implemented", {
									description:
										"This feature is not yet available.",
								})
							}
							handleFilterChange={handleFilterDebounce}
							onEditUser={handleEditUser}
							onDeleteUser={handleDeleteUser}
							onViewDetails={handleViewDetails}
						/>
					</div>
				</div>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete User</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete "
							{userToDelete?.name}"? This action cannot be undone.
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
			<UserForm
				open={isFormOpen}
				onOpenChange={setIsFormOpen}
				onSuccess={() => {
					setEditingUser(null);
					setIsFormOpen(false);
				}}
				initialData={editingUser || undefined}
			/>
			{userToView && (
				<UserDetailsDialog
					user={userToView}
					open={isDetailsDialogOpen}
					onOpenChange={(open) => {
						setIsDetailsDialogOpen(open);
						if (!open) setUserToView(null);
					}}
				/>
			)}
		</div>
	);
}
