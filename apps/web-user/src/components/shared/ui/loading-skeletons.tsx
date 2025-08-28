import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";

export const MenuItemSkeleton = () => (
	<Card className="animate-pulse">
		<CardHeader>
			<div className="h-48 rounded-lg bg-muted" />
		</CardHeader>
		<CardContent className="space-y-3 p-4">
			<div className="flex items-start justify-between">
				<div className="h-5 w-3/4 rounded bg-muted" />
				<div className="h-5 w-16 rounded bg-muted" />
			</div>
			<div className="h-4 w-full rounded bg-muted" />
			<div className="h-4 w-2/3 rounded bg-muted" />
		</CardContent>
		<CardFooter className="p-4">
			<div className="flex w-full items-center justify-between">
				<div className="flex gap-2">
					<div className="h-8 w-8 rounded bg-muted" />
					<div className="h-8 w-12 rounded bg-muted" />
					<div className="h-8 w-8 rounded bg-muted" />
				</div>
				<div className="h-8 w-20 rounded bg-muted" />
			</div>
		</CardFooter>
	</Card>
);

export const CartItemSkeleton = () => (
	<div className="flex animate-pulse items-center gap-4 rounded-lg bg-popover p-3">
		<div className="h-16 w-16 rounded-lg bg-muted" />
		<div className="flex-1 space-y-2">
			<div className="flex items-start justify-between">
				<div className="h-4 w-1/2 rounded bg-muted" />
				<div className="h-8 w-8 rounded bg-muted" />
			</div>
			<div className="flex gap-2">
				<div className="h-5 w-8 rounded bg-muted" />
				<div className="h-4 w-12 rounded bg-muted" />
			</div>
			<div className="flex items-center justify-between">
				<div className="flex gap-2">
					<div className="h-8 w-8 rounded bg-muted" />
					<div className="h-8 w-12 rounded bg-muted" />
					<div className="h-8 w-8 rounded bg-muted" />
				</div>
				<div className="h-5 w-16 rounded bg-muted" />
			</div>
		</div>
	</div>
);

export const MenuPageSkeleton = () => (
	<div className="min-h-screen bg-background">
		<div className="animate-pulse space-y-4 p-4">
			{/* Header skeleton */}
			<div className="h-12 rounded bg-muted" />

			{/* Categories skeleton */}
			<div className="flex gap-2 overflow-x-auto">
				{Array.from({ length: 6 }, () => (
					<div
						key={crypto.randomUUID()}
						className="h-10 w-24 flex-shrink-0 rounded-full bg-muted"
					/>
				))}
			</div>

			{/* Menu items skeleton */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }, () => (
					<MenuItemSkeleton key={crypto.randomUUID()} />
				))}
			</div>
		</div>
	</div>
);

export const CartPageSkeleton = () => (
	<div className="min-h-screen bg-background">
		<div className="animate-pulse space-y-4 p-4">
			{/* Header skeleton */}
			<div className="h-12 rounded bg-muted" />

			{/* Delivery info skeleton */}
			<div className="h-20 rounded bg-muted" />

			{/* Cart items skeleton */}
			<div className="space-y-3">
				{Array.from({ length: 3 }, () => (
					<CartItemSkeleton key={crypto.randomUUID()} />
				))}
			</div>

			{/* Bill summary skeleton */}
			<div className="h-32 rounded bg-muted" />

			{/* Action buttons skeleton */}
			<div className="flex gap-3">
				<div className="h-10 flex-1 rounded bg-muted" />
				<div className="h-10 flex-1 rounded bg-muted" />
			</div>
		</div>
	</div>
);
