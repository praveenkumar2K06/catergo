import { Phone, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PersonalDetailsProps {
	name: string;
	phone: string;
	onNameChange: (name: string) => void;
	onPhoneChange: (phone: string) => void;
}

export function PersonalDetails({
	name,
	phone,
	onNameChange,
	onPhoneChange,
}: PersonalDetailsProps) {
	return (
		<>
			<div className="space-y-2">
				<Label htmlFor="name" className="flex items-center gap-2">
					<User className="h-4 w-4 text-primary" />
					Full Name
				</Label>
				<Input
					id="name"
					placeholder="Enter your full name"
					value={name}
					onChange={(e) => onNameChange(e.target.value)}
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="phone" className="flex items-center gap-2">
					<Phone className="h-4 w-4 text-primary" />
					Phone Number
				</Label>
				<Input
					id="phone"
					placeholder="Enter your phone number"
					value={phone}
					onChange={(e) => onPhoneChange(e.target.value)}
				/>
			</div>
		</>
	);
}
