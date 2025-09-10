import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
	plugins: [
		// this is the plugin that enables path aliases
		viteTsConfigPaths({
			projects: ["./tsconfig.json"],
		}),
		tailwindcss(),
		devtools(),
		tanstackStart({
			customViteReactPlugin: true,
			target: "bun",
			spa: {
				enabled: true,
				prerender: {
					enabled: true,
				},
			},
		}),
		viteReact(),
	],
});

export default config;
