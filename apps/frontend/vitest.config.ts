/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "jsdom",
		setupFiles: ["./src/test/setup.ts"],
		typecheck: {
			include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
		},
		globals: true,
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	esbuild: {
		target: "node22",
	},
});
