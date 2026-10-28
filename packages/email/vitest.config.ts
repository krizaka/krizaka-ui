import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/themes.generated.ts"],
      reporter: ["text", "lcov"],
      thresholds: { functions: 90, lines: 95, statements: 95, branches: 85 },
    },
  },
});
