import { defineConfig } from "vitest/config";

// Every exported function is tested: coverage is a gate, not a report. The React parts run on happy-dom.
export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: true,
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/index.ts"],
      reporter: ["text", "lcov"],
      thresholds: { functions: 100, lines: 100, statements: 100, branches: 95 },
    },
  },
});
