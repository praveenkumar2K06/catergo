import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { EyeIcon, EyeOffIcon, LogInIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginFn } from "@/lib/auth-functions";

export function LoginForm() {
	const navigate = useNavigate();

	const loginMutation = useMutation({
		mutationFn: loginFn,
		onSuccess: async (data) => {
			localStorage.setItem("admin_token", JSON.stringify(data));
		},
	});

	const [showPassword, setShowPassword] = useState(false);

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			try {
				await loginMutation.mutateAsync({ data: value });
				toast.success("Login successful!");
				navigate({ to: "/dashboard" });
			} catch (error) {
				toast.error(
					error instanceof Error
						? error.message
						: "Login failed. Please check your credentials.",
				);
			}
		},
	});

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<LogInIcon className="h-5 w-5" />
					Admin Login
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-4"
				>
					<form.Field
						name="email"
						validators={{
							onChange: ({ value }) => {
								if (!value) return "Email is required";
								if (!/\S+@\S+\.\S+/.test(value))
									return "Please enter a valid email";
								return undefined;
							},
						}}
					>
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="admin@catergo.com"
									value={field.state.value}
									onChange={(e) =>
										field.handleChange(e.target.value)
									}
									disabled={loginMutation.isPending}
								/>
								{field.state.meta.errors.length > 0 && (
									<p className="text-destructive text-sm">
										{field.state.meta.errors.join(", ")}
									</p>
								)}
							</div>
						)}
					</form.Field>

					<form.Field
						name="password"
						validators={{
							onChange: ({ value }) => {
								if (!value) return "Password is required";
								return undefined;
							},
						}}
					>
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<div className="relative">
									<Input
										id="password"
										type={
											showPassword ? "text" : "password"
										}
										placeholder="Enter your password"
										value={field.state.value}
										onChange={(e) =>
											field.handleChange(e.target.value)
										}
										disabled={loginMutation.isPending}
									/>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
										onClick={() =>
											setShowPassword(!showPassword)
										}
										disabled={loginMutation.isPending}
									>
										{showPassword ? (
											<EyeOffIcon className="h-4 w-4" />
										) : (
											<EyeIcon className="h-4 w-4" />
										)}
									</Button>
								</div>
								{field.state.meta.errors.length > 0 && (
									<p className="text-destructive text-sm">
										{field.state.meta.errors.join(", ")}
									</p>
								)}
							</div>
						)}
					</form.Field>

					<Button
						type="submit"
						className="w-full"
						disabled={loginMutation.isPending}
					>
						{loginMutation.isPending ? "Signing in..." : "Sign In"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
