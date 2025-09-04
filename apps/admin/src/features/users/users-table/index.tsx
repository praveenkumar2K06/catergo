import type { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import type { User } from "@/types";
import { createColumns } from "./columns";

interface UserTableProps {
	data: {
		users: User[];
		pagination: {
			page: number;
			pageSize: number;
			totalPages: number;
		};
	};
	handlePaginationChange: (page: number, pageSize: number) => void;
	handleSortingChange: (sorting: SortingState) => void;
	handleFilterChange: (filters: ColumnFiltersState) => void;
	onEditUser?: (user: User) => void;
	onDeleteUser?: (user: User) => void;
}

export function UserTable({
	data,
	handlePaginationChange,
	handleSortingChange,
	handleFilterChange,
	onEditUser,
	onDeleteUser,
}: UserTableProps) {
	// Create columns with action handlers
	const tableColumns = createColumns({
		onEdit: onEditUser,
		onDelete: onDeleteUser,
	});

	return (
		<DataTable
			columns={tableColumns}
			data={data.users}
			searchKey="name"
			onPaginationChange={handlePaginationChange}
			onSortingChange={handleSortingChange}
			onFilterChange={handleFilterChange}
			serverSide={true}
			pagination={{
				pageIndex: data.pagination.page,
				pageSize: data.pagination.pageSize,
				pageCount: data.pagination.totalPages,
			}}
		/>
	);
}
