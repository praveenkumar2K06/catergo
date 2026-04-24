import { useQuery } from "@tanstack/react-query";
import { LoaderCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { fetchMenuQuery } from "@/lib/api/menu-items";

export interface EventMenuData {
	eventName?: string;
	eventDescription?: string;
	selectedMenuItems: Record<string, number>;
}

interface EventMenuSelectorProps {
	data: EventMenuData;
	onChange: (data: EventMenuData) => void;
	disabled?: boolean;
}

export function EventMenuSelector({
	data,
	onChange,
	disabled,
}: EventMenuSelectorProps) {
	const [menuPage, setMenuPage] = useState(0);
	const [menuSearch, setMenuSearch] = useState("");
	const [menuSearchInput, setMenuSearchInput] = useState("");

	useEffect(() => {
		const timeout = setTimeout(() => setMenuSearch(menuSearchInput), 500);
		return () => clearTimeout(timeout);
	}, [menuSearchInput]);

	const { data: menuData, isLoading: isLoadingMenu } = useQuery(
		fetchMenuQuery(menuPage, 10, menuSearch),
	);

	const handleMenuChange = (itemId: string, checked: boolean) => {
		const updated = { ...data.selectedMenuItems };
		if (checked) {
			updated[itemId] = 1;
		} else {
			delete updated[itemId];
		}
		onChange({ ...data, selectedMenuItems: updated });
	};

	const handleQuantityChange = (itemId: string, quantity: number) => {
		onChange({
			...data,
			selectedMenuItems: {
				...data.selectedMenuItems,
				[itemId]: quantity || 1,
			},
		});
	};

	return (
		<>
			<div className="space-y-2">
				<Label htmlFor="event-name">Event Name (Optional)</Label>
				<Input
					id="event-name"
					value={data.eventName ?? ""}
					onChange={(e) =>
						onChange({ ...data, eventName: e.target.value })
					}
					placeholder="Enter event name (e.g. John's Birthday)"
					disabled={disabled}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="event-description">
					Event Description (Optional)
				</Label>
				<Input
					id="event-description"
					value={data.eventDescription ?? ""}
					onChange={(e) =>
						onChange({ ...data, eventDescription: e.target.value })
					}
					placeholder="Enter event description"
					disabled={disabled}
				/>
			</div>

			<div className="space-y-4 pt-2">
				<Label>Select Menu Items</Label>
				<Input
					placeholder="Search menu items..."
					value={menuSearchInput}
					onChange={(e) => {
						setMenuSearchInput(e.target.value);
						setMenuPage(0);
					}}
					disabled={disabled}
				/>
				<div className="grid grid-cols-1 gap-2 sm:grid-cols-1">
					{isLoadingMenu && (
						<div className="col-span-2 flex justify-center py-4">
							<LoaderCircleIcon className="h-6 w-6 animate-spin text-muted-foreground" />
						</div>
					)}
					{!isLoadingMenu &&
						menuData?.data?.map((item: any) => (
							<div
								key={item.id}
								className="flex items-center space-x-2 rounded-md border p-2 text-sm"
							>
								<Checkbox
									id={`menu-${item.id}`}
									checked={!!data.selectedMenuItems[item.id]}
									onCheckedChange={(checked) =>
										handleMenuChange(item.id, checked as boolean)
									}
									disabled={disabled}
								/>
								<Label
									htmlFor={`menu-${item.id}`}
									className="cursor-pointer flex-1 font-normal"
								>
									{item.name}{" "}
									<span className="text-muted-foreground">
										({item.category})
									</span>
								</Label>
								{!!data.selectedMenuItems[item.id] && (
									<Input
										type="number"
										min={1}
										value={data.selectedMenuItems[item.id]}
										className="h-8 w-16 text-center"
										onChange={(e) =>
											handleQuantityChange(
												item.id,
												Number(e.target.value),
											)
										}
										disabled={disabled}
									/>
								)}
							</div>
						))}
					{!isLoadingMenu &&
						(!menuData?.data || menuData.data.length === 0) && (
							<p className="col-span-2 text-sm text-muted-foreground">
								No menu items found.
							</p>
						)}

					{!!menuData?.pagination &&
						menuData.pagination.totalPages > 1 && (
							<div className="col-span-2 flex items-center justify-between pt-2">
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() =>
										setMenuPage((p) => Math.max(0, p - 1))
									}
									disabled={
										disabled || menuPage === 0 || isLoadingMenu
									}
								>
									Previous
								</Button>
								<span className="text-sm text-muted-foreground">
									Page {menuPage + 1} of{" "}
									{menuData.pagination.totalPages}
								</span>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => setMenuPage((p) => p + 1)}
									disabled={
										disabled ||
										menuPage >=
											menuData.pagination.totalPages - 1 ||
										isLoadingMenu
									}
								>
									Next
								</Button>
							</div>
						)}
				</div>
			</div>
		</>
	);
}