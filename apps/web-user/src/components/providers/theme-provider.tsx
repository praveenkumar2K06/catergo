import { ScriptOnce } from "@tanstack/react-router";
import { clientOnly, createIsomorphicFn } from "@tanstack/react-start";
import { createContext, type ReactNode, use, useEffect, useState } from "react";

export type UserTheme = "light" | "dark" | "system";
export type AppTheme = Exclude<UserTheme, "system">;

const themeStorageKey = "ui-theme";

const getStoredUserTheme = createIsomorphicFn()
	.server((): UserTheme => "system")
	.client((): UserTheme => {
		const stored = localStorage.getItem(themeStorageKey);
		return stored as UserTheme;
	});

const setStoredTheme = clientOnly((theme: UserTheme) => {
	localStorage.setItem(themeStorageKey, theme);
});

const getSystemTheme = createIsomorphicFn()
	.server((): AppTheme => "light")
	.client((): AppTheme => {
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	});

const handleThemeChange = clientOnly((userTheme: UserTheme) => {
	const root = document.documentElement;
	root.classList.remove("light", "dark", "system");

	if (userTheme === "system") {
		const systemTheme = getSystemTheme();
		root.classList.add(systemTheme, "system");
	} else {
		root.classList.add(userTheme);
	}
});

const setupPreferredListener = clientOnly(() => {
	const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
	const handler = () => handleThemeChange("system");
	mediaQuery.addEventListener("change", handler);
	return () => mediaQuery.removeEventListener("change", handler);
});

const themeScript = (() => {
	function themeFn() {
		try {
			const storedTheme = localStorage.getItem("ui-theme") || "system";
			const validTheme = ["light", "dark", "system"].includes(storedTheme)
				? storedTheme
				: "system";

			if (validTheme === "system") {
				const systemTheme = window.matchMedia(
					"(prefers-color-scheme: dark)",
				).matches
					? "dark"
					: "light";
				document.documentElement.classList.add(systemTheme, "system");
			} else {
				document.documentElement.classList.add(validTheme);
			}
		} catch (_) {
			const systemTheme = window.matchMedia(
				"(prefers-color-scheme: dark)",
			).matches
				? "dark"
				: "light";
			document.documentElement.classList.add(systemTheme, "system");
		}
	}
	return `(${themeFn.toString()})();`;
})();

type ThemeContextProps = {
	userTheme: UserTheme;
	appTheme: AppTheme;
	setTheme: (theme: UserTheme) => void;
};
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

type ThemeProviderProps = {
	children: ReactNode;
};
export function ThemeProvider({ children }: ThemeProviderProps) {
	const [userTheme, setUserTheme] = useState<UserTheme>(getStoredUserTheme);

	useEffect(() => {
		if (userTheme !== "system") return;
		return setupPreferredListener();
	}, [userTheme]);

	const appTheme = userTheme === "system" ? getSystemTheme() : userTheme;

	const setTheme = (newUserTheme: UserTheme) => {
		setUserTheme(newUserTheme);
		setStoredTheme(newUserTheme);
		handleThemeChange(newUserTheme);
	};

	return (
		<ThemeContext value={{ userTheme, appTheme, setTheme }}>
			<ScriptOnce>{themeScript}</ScriptOnce>

			{children}
		</ThemeContext>
	);
}

export const useTheme = () => {
	const context = use(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};
