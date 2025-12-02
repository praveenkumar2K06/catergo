import type { AnyFieldApi } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircleIcon, Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAppForm } from "@/components/ui/tanstack-form";
import { categoriesQueryOptions } from "@/lib/api/categories";
import { addMenuItem, updateMenuItem } from "@/lib/api/menu-items";
import type { MenuItem } from "@/types";
import { Metrics, menuItemFormSchema } from "@/types/menu-items";

const METRICS = [
	{ value: Metrics.Piece, label: "Piece" },
	{ value: Metrics.Kg, label: "Kilogram" },
	{ value: Metrics.Litre, label: "Litre" },
];

interface MenuFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: (menuItem: MenuItem) => void;
	initialData?: Partial<MenuItem>;
}

export function MenuForm({
	open,
	onOpenChange,
	onSuccess,
	initialData,
}: MenuFormProps) {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const isEditing = !!initialData?.id;

	const [imagePreview, setImagePreview] = useState<string | null>(null);

	// Fetch categories for the admin
	const { data: categories = [] } = useQuery({
		...categoriesQueryOptions(user?.userId ?? ""),
		enabled: !!user?.userId,
	});

	const addItemMutation = useMutation({
		mutationFn: addMenuItem,
		onError: (error) => {
			console.error("Error adding menu item:", error);
			toast.error("Failed to add menu item. Please try again.", {
				description: error.message,
			});
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["menu"] });
			if (onSuccess) onSuccess(data.data);
		},
	});

	const updateItemMutation = useMutation({
		mutationFn: updateMenuItem,
		onError: (error) => {
			console.error("Error updating menu item:", error);
			toast.error("Failed to update menu item. Please try again.", {
				description: error.message,
			});
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["menu"] });
			if (onSuccess) onSuccess(data.data);
		},
	});

	const convertFileToBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = (error) => reject(error);
		});
	};

	const handleImageChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
		field: AnyFieldApi,
	) => {
		const file = event.target.files?.[0];
		if (file) {
			try {
				const base64 = await convertFileToBase64(file);
				field.handleChange(base64);
				setImagePreview(base64);
			} catch (error) {
				toast.error("Failed to process image");
				console.error("Error converting file to base64:", error);
			}
		}
	};

	// Create form with validation
	const form = useAppForm({
		validators: {
			onChange: ({ value }) => {
				const result = menuItemFormSchema.safeParse(value);
				if (result.error) {
					return {
						fields: result.error.flatten((issue) => issue.message)
							.fieldErrors,
					};
				}
			},
		},
		defaultValues: {
			id: initialData?.id,
			name: initialData?.name || "",
			description: initialData?.description || "",
			price: initialData?.price || 0,
			image: initialData?.image || "",
			category: initialData?.category || "",
			isVeg: initialData?.isVeg || false,
			qtyPerUnit: initialData?.qtyPerUnit || 1,
			metrics: initialData?.metrics || Metrics.Piece,
			order: initialData?.order ?? 0,
		},
		onSubmit: async ({ value }) => {
			console.log("Form submitted:", value);

			await new Promise((resolve) => setTimeout(resolve, 1000));

			if (value.id) {
				updateItemMutation.mutate({ ...value, id: value.id });
			} else {
				addItemMutation.mutate(value);
			}
		},
	});

	useEffect(() => {
		if (open) {
			form.reset();
			setImagePreview(null);
		}
	}, [open, form]);

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			e.stopPropagation();
			form.handleSubmit();
		},
		[form],
	);

	function FieldInfo({ field }: { field: AnyFieldApi }) {
		return (
			<p data-slot="form-message" className={"text-destructive text-sm"}>
				{field.state.meta.isTouched && !field.state.meta.isValid ? (
					<em>{field.state.meta.errors.join(",")}</em>
				) : null}
				{field.state.meta.isValidating ? "Validating..." : null}
			</p>
		);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>
						{isEditing ? "Edit Product" : "Add New Product"}
					</DialogTitle>
				</DialogHeader>
				<form.AppForm>
					<form className="space-y-4" onSubmit={handleSubmit}>
						<form.AppField name="name">
							{(field) => (
								<field.FormItem>
									<field.FormLabel>Name</field.FormLabel>
									<field.FormControl>
										<Input
											value={field.state.value}
											onChange={(e) =>
												field.handleChange(
													e.target.value,
												)
											}
											onBlur={field.handleBlur}
										/>
									</field.FormControl>
									<FieldInfo field={field} />
								</field.FormItem>
							)}
						</form.AppField>

						<form.AppField name="description">
							{(field) => (
								<field.FormItem>
									<field.FormLabel>
										Description
									</field.FormLabel>
									<field.FormControl>
										<Input
											value={field.state.value}
											onChange={(e) =>
												field.handleChange(
													e.target.value,
												)
											}
											onBlur={field.handleBlur}
										/>
									</field.FormControl>
									<FieldInfo field={field} />
								</field.FormItem>
							)}
						</form.AppField>

						<form.AppField name="image">
							{(field) => (
								<field.FormItem>
									<field.FormLabel>Image</field.FormLabel>
									<field.FormControl>
										<div className="space-y-2">
											<div className="relative">
												<Input
													type="file"
													accept="image/*"
													onChange={(e) =>
														handleImageChange(
															e,
															field,
														)
													}
													onBlur={field.handleBlur}
													className="sr-only"
													id="image-upload"
												/>
												<label
													htmlFor="image-upload"
													className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-border border-dashed transition-colors duration-200 hover:border-border/60 hover:bg-muted/50"
												>
													<div className="flex flex-col items-center justify-center pt-5 pb-6">
														<Upload className="mb-3 h-8 w-8 text-muted-foreground" />
														<p className="mb-1 text-foreground text-sm">
															<span className="font-medium">
																Click to upload
															</span>{" "}
															or drag and drop
														</p>
														<p className="text-muted-foreground text-xs">
															PNG, JPG, GIF up to
															10MB
														</p>
													</div>
												</label>
											</div>
											{imagePreview && (
												<div className="mt-2">
													<img
														src={imagePreview}
														alt="Preview"
														className="h-32 w-32 rounded-md border object-cover"
													/>
												</div>
											)}
											{field.state.value &&
												!imagePreview && (
													<div className="mt-2">
														<img
															src={
																field.state
																	.value
															}
															alt="Current"
															className="mx-auto h-32 w-32 rounded-md border object-cover"
														/>
													</div>
												)}
										</div>
									</field.FormControl>
									<FieldInfo field={field} />
								</field.FormItem>
							)}
						</form.AppField>

						<form.AppField name="price">
							{(field) => (
								<field.FormItem>
									<field.FormLabel>Price</field.FormLabel>
									<field.FormControl>
										<Input
											type="number"
											value={field.state.value}
											onChange={(e) =>
												field.handleChange(
													Number(
														e.target.valueAsNumber,
													),
												)
											}
											onBlur={field.handleBlur}
										/>
									</field.FormControl>
									<FieldInfo field={field} />
								</field.FormItem>
							)}
						</form.AppField>

						<form.AppField name="category">
							{(field) => (
								<field.FormItem>
									<field.FormLabel>Category</field.FormLabel>
									<field.FormControl>
										<Select
											value={field.state.value}
											onValueChange={(
												value: MenuItem["category"],
											) => {
												field.handleChange(value);
											}}
											onOpenChange={field.handleBlur}
											disabled={categories.length === 0}
										>
											<SelectTrigger>
												<SelectValue
													placeholder={
														categories.length === 0
															? "No categories available"
															: "Select a Category"
													}
												/>
											</SelectTrigger>
											<SelectContent>
												{categories.map((category) => (
													<SelectItem
														key={category.id}
														value={category.name}
													>
														<span className="flex items-center gap-2">
															<span>
																{category.icon}
															</span>
															<span>
																{category.name}
															</span>
														</span>
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</field.FormControl>
									<FieldInfo field={field} />
								</field.FormItem>
							)}
						</form.AppField>

						<form.AppField name="isVeg">
							{(field) => (
								<field.FormItem>
									<field.FormLabel>
										Is Vegetarian
									</field.FormLabel>
									<field.FormControl>
										<Checkbox
											checked={field.state.value}
											onCheckedChange={(checked) =>
												checked
													? field.handleChange(true)
													: field.handleChange(false)
											}
											onBlur={field.handleBlur}
										/>
									</field.FormControl>
									<FieldInfo field={field} />
								</field.FormItem>
							)}
						</form.AppField>

						<form.AppField name="qtyPerUnit">
							{(field) => (
								<field.FormItem>
									<field.FormLabel>
										Quantity Per Person
									</field.FormLabel>
									<field.FormControl>
										<Input
											type="number"
											value={field.state.value}
											onChange={(e) =>
												field.handleChange(
													Number(
														e.target.valueAsNumber,
													),
												)
											}
											onBlur={field.handleBlur}
										/>
									</field.FormControl>
									<FieldInfo field={field} />
								</field.FormItem>
							)}
						</form.AppField>

						<form.AppField name="metrics">
							{(field) => (
								<field.FormItem>
									<field.FormLabel>Metrics</field.FormLabel>
									<field.FormControl>
										<Select
											value={field.state.value}
											onValueChange={(
												value: MenuItem["metrics"],
											) => {
												field.handleChange(value);
											}}
											onOpenChange={field.handleBlur}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select a Metric" />
											</SelectTrigger>
											<SelectContent>
												{METRICS.map((metric) => (
													<SelectItem
														key={metric.value}
														value={metric.value}
													>
														{metric.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</field.FormControl>
									<FieldInfo field={field} />
								</field.FormItem>
							)}
						</form.AppField>

						<form.AppField name="order">
							{(field) => (
								<field.FormItem>
									<field.FormLabel>
										Display Order
									</field.FormLabel>
									<field.FormControl>
										<Input
											type="number"
											min={0}
											value={field.state.value}
											onChange={(e) =>
												field.handleChange(
													Number(
														e.target.valueAsNumber,
													) || 0,
												)
											}
											onBlur={field.handleBlur}
											placeholder="0"
										/>
									</field.FormControl>
									<p className="text-muted-foreground text-xs">
										Higher numbers appear first. Items with
										the same order are sorted by date.
									</p>
									<FieldInfo field={field} />
								</field.FormItem>
							)}
						</form.AppField>

						<div className="flex justify-end space-x-2 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
							>
								Cancel
							</Button>
							<Button type="submit">
								{addItemMutation.isPending ||
								updateItemMutation.isPending ? (
									<>
										<LoaderCircleIcon className="animate-spin" />
										Loading
									</>
								) : isEditing ? (
									"Update Product"
								) : (
									"Add Product"
								)}
							</Button>
						</div>
					</form>
				</form.AppForm>
			</DialogContent>
		</Dialog>
	);
}
