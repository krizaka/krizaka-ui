import { defineConfig } from "vitest/config";

// The components render on happy-dom with Testing Library and the jest-dom matchers (test/setup.ts); the registry and
// platform-version tests (scripts/*.test.mjs) read the meta files and the manifests on Node.
// The report SonarCloud reads; no threshold: the quality gate judges the new code.
export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.mjs"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/index.ts", "src/**/__tests__/**"],
      reporter: ["text-summary", "lcov"],
    },
  },
});
