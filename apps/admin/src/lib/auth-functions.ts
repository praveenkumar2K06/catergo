import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { loginAdmin } from "./api/auth";
import { useAppSession } from "./session";

export const fetchUser = createServerFn({ method: "GET" }).handler(async () => {
	const session = await useAppSession();

	if (
		!session.data.userId &&
		!session.data.userEmail &&
		!session.data.userName &&
		!session.data.token
	) {
		return null;
	}

	return {
		id: session.data.userId,
		name: session.data.userName,
		email: session.data.userEmail,
		token: session.data.token,
	};
});

export const loginFn = createServerFn({ method: "POST" })
	.validator((d: { email: string; password: string }) => d)
	.handler(async ({ data }) => {
		const user = await loginAdmin({
			email: data.email,
			password: data.password,
		});

		if (!user) {
			throw notFound();
		}

		const session = await useAppSession();

		await session.update({
			userEmail: user.admin.email,
			userId: user.admin.id,
			userName: user.admin.name,
			token: user.token,
		});

		return {
			id: user.admin.id,
			name: user.admin.name,
			email: user.admin.email,
			token: user.token,
		};
	});

export const logoutFn = createServerFn().handler(async () => {
	const session = await useAppSession();

	session.clear();
});
