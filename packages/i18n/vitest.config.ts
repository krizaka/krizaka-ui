import { defineConfig } from "vitest/config";

// Every exported function is tested: coverage is a gate, not a report. The bin is a one-line call of `main`.
export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    exclude: ["test/fixtures/**", "node_modules/**"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/bin.ts"],
      reporter: ["text"],
      thresholds: { functions: 100, lines: 100, statements: 100, branches: 100 },
    },
  },
});
