import { Phone, User } from "lucide-react";
import NextImageLoading from "@/components/ui/image-loader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PersonalDetailsProps {
	name: string;
	phone: string;
	illustration?: string;
	onNameChange: (name: string) => void;
	onPhoneChange: (phone: string) => void;
}

export function PersonalDetails({
	name,
	phone,
	illustration,
	onNameChange,
	onPhoneChange,
}: PersonalDetailsProps) {
	return (
		<div className="space-y-6">
			{illustration && (
				<div className="mb-6 flex items-center justify-center">
					<NextImageLoading
						src={illustration}
						alt="Personal details illustration"
						className="h-auto w-full"
					/>
				</div>
			)}
			<div className="group space-y-3">
				<Label
					htmlFor="name"
					className="flex items-center gap-2 font-medium text-base"
				>
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 transition-colors group-focus-within:bg-primary/20">
						<User className="h-4 w-4 text-primary" />
					</div>
					Full Name
				</Label>
				<Input
					id="name"
					placeholder="Enter your full name"
					value={name}
					onChange={(e) => onNameChange(e.target.value)}
					className="h-12 px-4 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20"
					autoFocus
				/>
			</div>

			<div className="group space-y-3">
				<Label
					htmlFor="phone"
					className="flex items-center gap-2 font-medium text-base"
				>
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 transition-colors group-focus-within:bg-primary/20">
						<Phone className="h-4 w-4 text-primary" />
					</div>
					Phone Number
				</Label>
				<Input
					id="phone"
					placeholder="Enter your phone number"
					value={phone}
					onChange={(e) => onPhoneChange(e.target.value)}
					className="h-12 px-4 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20"
				/>
			</div>
		</div>
	);
}
