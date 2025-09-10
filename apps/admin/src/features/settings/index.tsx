import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateBlockingSettings } from "./tabs/date-blocking";
import { OrderSettings } from "./tabs/order-settings";

const tabs = [
	{
		name: "Order Management",
		value: "orders",
		content: <OrderSettings />,
	},
	{
		name: "Date Blocking",
		value: "date-blocking",
		content: <DateBlockingSettings />,
	},
];
export default function SettingsPage() {
	return (
		<div>
			<div className="flex flex-row items-center justify-between">
				<div>
					<h1 className="font-bold text-2xl">Settings</h1>
					<p className="text-gray-500 text-sm">
						Personalize your experience
					</p>
				</div>
			</div>
			<div className="m-4">
				<Tabs defaultValue="orders" className="gap-4">
					<TabsList className="gap-1 bg-background">
						{tabs.map((tab) => (
							<TabsTrigger
								key={tab.value}
								value={tab.value}
								className="text-muted-foreground transition-colors duration-300 hover:border hover:bg-muted hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground"
							>
								{tab.name}
							</TabsTrigger>
						))}
					</TabsList>

					{tabs.map((tab) => (
						<TabsContent key={tab.value} value={tab.value}>
							{tab.content}
						</TabsContent>
					))}
				</Tabs>
			</div>
		</div>
	);
}
