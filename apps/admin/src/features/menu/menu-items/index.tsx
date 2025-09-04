import type { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import type { MenuItem } from "@/types";
import { createColumns } from "./columns";

interface MenuItemTableProps {
	data: {
		menuItems: MenuItem[];
		pagination: {
			page: number;
			pageSize: number;
			totalPages: number;
		};
	};
	handlePaginationChange: (page: number, pageSize: number) => void;
	handleSortingChange: (sorting: SortingState) => void;
	handleFilterChange: (filters: ColumnFiltersState) => void;
	onEditMenuItem?: (menuItem: MenuItem) => void;
	onDeleteMenuItem?: (menuItem: MenuItem) => void;
}

export function MenuItemTable({
	data,
	handlePaginationChange,
	handleSortingChange,
	handleFilterChange,
	onEditMenuItem,
	onDeleteMenuItem,
}: MenuItemTableProps) {
	// Create columns with action handlers
	const tableColumns = createColumns({
		onEdit: onEditMenuItem,
		onDelete: onDeleteMenuItem,
	});

	return (
		<DataTable
			columns={tableColumns}
			data={data.menuItems}
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
