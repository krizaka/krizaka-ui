import { defineConfig } from "vitest/config";

// Every exported function is tested: coverage is a gate, not a report.
export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      reporter: ["text"],
      thresholds: { functions: 100, lines: 100, statements: 100, branches: 100 },
    },
  },
});
