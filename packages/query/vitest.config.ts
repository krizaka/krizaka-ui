import { defineConfig } from "vitest/config";

// Every exported function is tested: coverage is a gate, not a report. The React parts run on happy-dom.
export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: true,
    exclude: ["examples/**", "node_modules/**"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/index.ts", "src/core.ts"],
      reporter: ["text", "lcov"],
      thresholds: { functions: 100, lines: 100, statements: 99, branches: 95 },
    },
  },
});
