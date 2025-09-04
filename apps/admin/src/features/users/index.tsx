import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import ErrorDisplay from "@/components/shared/layout/error";
import Loader from "@/components/shared/layout/loader";
import { Button } from "@/components/ui/button";
import { usersQueryOptions } from "@/lib/api/users";
import { UserTable } from "./users-table";

export default function UsersPage() {
	// Use React Query to fetch data
	const { data, isPending, isError, error } = useQuery(usersQueryOptions);

	if (isPending) {
		return <Loader variant="catering" />;
	}

	if (isError) {
		return <ErrorDisplay type="server" message={error.message} />;
	}

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
