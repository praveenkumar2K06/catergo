import { format } from "date-fns";
import { ArrowLeft, Pencil, Users } from "lucide-react";
import { EditUserDetailsDialog } from "@/components/features/shared/edit-user-details-dialog";
import { ModeToggle } from "@/components/shared/layout/mode-toggle";
import { Button } from "@/components/ui/button";
import type { UserData } from "@/lib/types";

interface MenuHeaderProps {
	userData: UserData;
	onBack: () => void;
	cartButton?: React.ReactNode;
	onUpdateUserData?: (
		numberOfPeople: number,
		selectedDate: Date | undefined,
	) => void;
	blockedDates?: Date[];
	isUpdating?: boolean;
}

export function MenuHeader({
	userData,
	onBack,
	cartButton,
	onUpdateUserData,
	blockedDates = [],
	isUpdating = false,
}: MenuHeaderProps) {
	return (
		<div className="border-border border-b bg-card/95 px-4 py-4 backdrop-blur-sm">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Button
						variant="ghost"
						size="sm"
						onClick={onBack}
						className="hover:bg-muted/50"
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<div className="space-y-1">
						<h1 className="font-bold text-foreground text-xl">
							Welcome, {userData.name.split(" ")[0]}! 👋
						</h1>
						<div className="flex items-center gap-2 text-muted-foreground text-sm">
							<div className="flex items-center gap-1">
								<Users className="h-3 w-3" />
								<span>{userData.numberOfPeople} people</span>
							</div>
							<span className="text-xs">•</span>
							<span>
								{userData.selectedDate
									? format(
											userData.selectedDate,
											"EEEE dd/MM/yyyy hh:mm aa",
										)
									: "Date Not Specified"}
							</span>
							{onUpdateUserData && (
								<EditUserDetailsDialog
									numberOfPeople={userData.numberOfPeople}
									selectedDate={userData.selectedDate}
									blockedDates={blockedDates}
									onSave={onUpdateUserData}
									isLoading={isUpdating}
									trigger={
										<Button
											variant="ghost"
											size="sm"
											className="ml-1 h-5 px-1.5"
										>
											<Pencil className="h-3 w-3" />
											<span className="sr-only">
												Edit details
											</span>
										</Button>
									}
								/>
							)}
						</div>
						<p className="text-muted-foreground/80 text-xs">
							📍{" "}
							{userData.address.length > 35
								? `${userData.address.substring(0, 35)}...`
								: userData.address}
						</p>
					</div>
				</div>

				<div className="flex flex-col items-end justify-end gap-2">
					<ModeToggle />
					{cartButton}
				</div>
			</div>
		</div>
	);
}
