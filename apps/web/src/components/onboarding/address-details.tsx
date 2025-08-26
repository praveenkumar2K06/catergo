import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressDetailsProps {
	address: string;
	pincode: string;
	onAddressChange: (address: string) => void;
	onPincodeChange: (pincode: string) => void;
}

export function AddressDetails({
	address,
	pincode,
	onAddressChange,
	onPincodeChange,
}: AddressDetailsProps) {
	return (
		<>
			<div className="space-y-2">
				<Label htmlFor="address" className="flex items-center gap-2">
					<MapPin className="h-4 w-4 text-primary" />
					Delivery Address
				</Label>
				<Input
					id="address"
					placeholder="Enter your complete address"
					value={address}
					onChange={(e) => onAddressChange(e.target.value)}
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="pincode">Pin Code</Label>
				<Input
					id="pincode"
					placeholder="Enter pin code"
					value={pincode}
					onChange={(e) => onPincodeChange(e.target.value)}
				/>
			</div>
		</>
	);
}
