import { useSession } from "@tanstack/react-start/server";

type SessionUser = {
	userId: string;
	userName: string;
	userEmail: string;
	token: string;
};

export function useAppSession() {
	return useSession<SessionUser>({
		password: import.meta.env.VITE_SECURE_TOKEN,
	});
}
