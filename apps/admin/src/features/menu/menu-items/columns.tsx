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
import type { MenuItem } from "@/types";

interface MenuItemActionsProps {
	onEdit?: (menuItem: MenuItem) => void;
	onDelete?: (menuItem: MenuItem) => void;
}

export const createColumns = ({
	onEdit,
	onDelete,
}: MenuItemActionsProps = {}): ColumnDef<MenuItem>[] => [
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
		accessorKey: "name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Name" />
		),
		cell: ({ row }) => <div>{row.getValue("name")}</div>,
		enableSorting: false,
	},
	{
		accessorKey: "description",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Description" />
		),
		cell: ({ row }) => <div>{row.getValue("description")}</div>,
		enableSorting: false,
	},
	{
		accessorKey: "price",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Price" />
		),
		cell: ({ row }) => <div>{row.getValue("price")}</div>,
		enableSorting: false,
	},
	{
		accessorKey: "category",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Category" />
		),
		cell: ({ row }) => <div>{row.getValue("category")}</div>,
		enableSorting: false,
	},
	{
		accessorKey: "isVeg",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Vegetarian" />
		),
		cell: ({ row }) => <div>{row.getValue("isVeg") ? "Yes" : "No"}</div>,
		enableSorting: false,
	},
	{
		accessorKey: "qtyPerUnit",
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title="Quantity per Person"
			/>
		),
		cell: ({ row }) => <div>{row.getValue("qtyPerUnit")}</div>,
		enableSorting: false,
	},
	{
		accessorKey: "metrics",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Metrics" />
		),
		cell: ({ row }) => <div>{row.getValue("metrics")}</div>,
		enableSorting: false,
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const menu = row.original;

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
								navigator.clipboard.writeText(menu.id)
							}
						>
							Copy menu ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>View details</DropdownMenuItem>
						<DropdownMenuItem onClick={() => onEdit?.(menu)}>
							Edit menu
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onDelete?.(menu)}
							className="text-destructive"
						>
							Delete menu
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

// Export default columns for backward compatibility
export const columns = createColumns();
