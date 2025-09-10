import { LoginForm } from "./login-form";

export default function LoginPage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/50">
			<div className="w-full max-w-md space-y-8 px-4">
				<div className="text-center">
					<h2 className="mt-6 font-bold text-3xl tracking-tight">
						Admin Login
					</h2>
					<p className="mt-2 text-muted-foreground text-sm">
						Sign in to your admin account
					</p>
				</div>
				<LoginForm />
			</div>
		</div>
	);
}
