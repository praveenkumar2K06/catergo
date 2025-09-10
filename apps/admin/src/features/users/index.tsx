import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import type { ColumnFiltersState } from "@tanstack/react-table";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "@/components/ui/button";
import { fetchUsersQuery } from "@/lib/api/users";
import { UserTable } from "./users-table";

export default function UsersPage() {
	const navigate = useNavigate();
	const search = useSearch({ from: "/_authed/users" });
	const { data } = useSuspenseQuery(
		fetchUsersQuery(search.page ?? 0, search.pageSize ?? 10, search.name),
	);

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

	return (
		<div>
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
							toast.info("To be implemented", {
								description:
									"This feature is not yet available.",
							});
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
						onEditUser={() =>
							toast.info("To be implemented", {
								description:
									"This feature is not yet available.",
							})
						}
						onDeleteUser={() =>
							toast.info("To be implemented", {
								description:
									"This feature is not yet available.",
							})
						}
					/>
				</div>
			</div>
		</div>
	);
}
