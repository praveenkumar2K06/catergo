import { MapPin, Phone, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserData {
	id: string;
	name: string;
	phone: string;
	pincode: string;
	address: string;
}

interface CustomerInformationCardProps {
	user: UserData;
}

function getInitials(name: string) {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase();
}

export function CustomerInformationCard({
	user,
}: CustomerInformationCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<User className="h-5 w-5" />
					Customer Information
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex items-start gap-4">
					<Avatar className="h-12 w-12">
						<AvatarFallback className="bg-primary/10 text-primary">
							{getInitials(user.name)}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1 space-y-3">
						<div>
							<h3 className="font-semibold text-lg">
								{user.name}
							</h3>
							<p className="text-muted-foreground text-sm">
								Customer ID: {user.id}
							</p>
						</div>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div className="flex items-center gap-2">
								<Phone className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">{user.phone}</span>
							</div>
							<div className="flex items-center gap-2">
								<MapPin className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">{user.pincode}</span>
							</div>
						</div>
						<div className="flex items-start gap-2">
							<MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
							<span className="text-sm">{user.address}</span>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
