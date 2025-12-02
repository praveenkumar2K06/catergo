import type { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, MoreHorizontal, XCircle } from "lucide-react";
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
import type { User } from "@/types";

interface UsersActionsProps {
	onEdit?: (user: User) => void;
	onDelete?: (user: User) => void;
	onViewDetails?: (user: User) => void;
}

export const createColumns = ({
	onEdit,
	onDelete,
	onViewDetails,
}: UsersActionsProps = {}): ColumnDef<User>[] => [
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
		accessorKey: "phone",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Phone" />
		),
		cell: ({ row }) => <div>{row.getValue("phone")}</div>,
		enableSorting: false,
	},
	{
		accessorKey: "numberOfPeople",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Number of People" />
		),
		cell: ({ row }) => <div>{row.getValue("numberOfPeople")}</div>,
		enableSorting: false,
	},
	{
		accessorKey: "selectedDate",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Selected Date" />
		),
		cell: ({ row }) => {
			const selectedDate = row.getValue("selectedDate") as string;

			const parsedDate = new Date(selectedDate);

			return <div>{parsedDate.toDateString()}</div>;
		},
		enableSorting: false,
	},
	{
		id: "booked",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Booked" />
		),
		cell: ({ row }) => {
			const hasEvent = !!row.original.event;
			return (
				<div className="flex items-center gap-2">
					{hasEvent ? (
						<>
							<CheckCircle className="h-4 w-4 text-green-500" />
							<span className="text-green-600 text-sm">Yes</span>
						</>
					) : (
						<>
							<XCircle className="h-4 w-4 text-muted-foreground" />
							<span className="text-muted-foreground text-sm">
								No
							</span>
						</>
					)}
				</div>
			);
		},
		enableSorting: false,
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const user = row.original;

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
								navigator.clipboard.writeText(user.id)
							}
						>
							Copy user ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => onViewDetails?.(user)}>
							View details
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => onEdit?.(user)}>
							Edit user
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onDelete?.(user)}
							className="text-destructive"
						>
							Delete user
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

// Export default columns for backward compatibility
export const columns = createColumns();
