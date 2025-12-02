import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Category } from "@/lib/api/categories";

interface CategoryActionsProps {
	onEdit?: (category: Category) => void;
	onDelete?: (category: Category) => void;
}

export const createColumns = ({
	onEdit,
	onDelete,
}: CategoryActionsProps = {}): ColumnDef<Category>[] => [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) =>
					table.toggleAllPageRowsSelected(!!value)
				}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "icon",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Icon" />
		),
		cell: ({ row }) => (
			<span className="text-xl">{row.getValue("icon")}</span>
		),
		enableSorting: false,
	},
	{
		accessorKey: "name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Name" />
		),
		cell: ({ row }) => (
			<div className="font-medium">{row.getValue("name")}</div>
		),
		enableSorting: false,
	},
	{
		accessorKey: "order",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Order" />
		),
		cell: ({ row }) => <div>{row.getValue("order")}</div>,
		enableSorting: false,
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const category = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() =>
								navigator.clipboard.writeText(category.id)
							}
						>
							Copy category ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => onEdit?.(category)}>
							Edit category
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onDelete?.(category)}
							className="text-destructive"
						>
							Delete category
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

// Export default columns for backward compatibility
export const columns = createColumns();
