import * as React from "react";
import type { AdminUser } from "@/lib/api/auth";

export interface AuthContext {
	isAuthenticated: boolean;
	login: (user: AdminUser, token: string) => Promise<void>;
	logout: () => Promise<void>;
	user: SessionUser | null;
}

type SessionUser = {
	userId: string;
	userName: string;
	userEmail: string;
	token: string;
};

const AuthContext = React.createContext<AuthContext | null>(null);

const key = "tanstack.auth.user";

function getStoredUser() {
	return JSON.parse(
		localStorage.getItem(key) || "null",
	) as SessionUser | null;
}

function setStoredUser(user: SessionUser | null) {
	if (user) {
		localStorage.setItem(key, JSON.stringify(user));
	} else {
		localStorage.removeItem(key);
	}
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = React.useState<SessionUser | null>(getStoredUser());
	const isAuthenticated = !!user;

	const logout = React.useCallback(async () => {
		setStoredUser(null);
		setUser(null);
	}, []);

	const login = React.useCallback(async (user: AdminUser, token: string) => {
		setStoredUser({
			userId: user.id,
			userName: user.name,
			userEmail: user.email,
			token,
		});
		setUser({
			userId: user.id,
			userName: user.name,
			userEmail: user.email,
			token,
		});
	}, []);

	React.useEffect(() => {
		setUser(getStoredUser());
	}, []);

	return (
		<AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = React.useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
