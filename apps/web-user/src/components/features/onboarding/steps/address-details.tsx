import { LocateFixed, MapPin } from "lucide-react";
import NextImageLoading from "@/components/ui/image-loader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressDetailsProps {
	address: string;
	pincode: string;
	illustration?: string;
	onAddressChange: (address: string) => void;
	onPincodeChange: (pincode: string) => void;
}

export function AddressDetails({
	address,
	pincode,
	illustration,
	onAddressChange,
	onPincodeChange,
}: AddressDetailsProps) {
	return (
		<div className="space-y-6">
			{illustration && (
				<div className="mb-6 flex items-center justify-center">
					<NextImageLoading
						src={illustration}
						alt="Address details illustration"
						className="h-auto max-w-xs"
					/>
				</div>
			)}
			<div className="group space-y-3">
				<Label
					htmlFor="address"
					className="flex items-center gap-2 font-medium text-base"
				>
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 transition-colors group-focus-within:bg-primary/20">
						<LocateFixed className="h-4 w-4 text-primary" />
					</div>
					Delivery Address
				</Label>
				<Input
					id="address"
					placeholder="Enter your complete address"
					value={address}
					onChange={(e) => onAddressChange(e.target.value)}
					className="h-12 px-4 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20"
					autoFocus
				/>
			</div>

			<div className="group space-y-3">
				<Label
					htmlFor="pincode"
					className="flex items-center gap-2 font-medium text-base"
				>
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 transition-colors group-focus-within:bg-primary/20">
						<MapPin className="h-4 w-4 text-primary" />
					</div>
					Pin Code
				</Label>
				<Input
					id="pincode"
					placeholder="Enter pin code"
					value={pincode}
					onChange={(e) => onPincodeChange(e.target.value)}
					className="h-12 px-4 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20"
				/>
			</div>
		</div>
	);
}
