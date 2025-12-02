import { DataTable } from "@/components/data-table";
import type { Category } from "@/lib/api/categories";
import { createColumns } from "./columns";

interface CategoryTableProps {
	data: Category[];
	onEditCategory?: (category: Category) => void;
	onDeleteCategory?: (category: Category) => void;
}

export function CategoryTable({
	data,
	onEditCategory,
	onDeleteCategory,
}: CategoryTableProps) {
	// Create columns with action handlers
	const tableColumns = createColumns({
		onEdit: onEditCategory,
		onDelete: onDeleteCategory,
	});

	return <DataTable columns={tableColumns} data={data} searchKey="name" />;
}
