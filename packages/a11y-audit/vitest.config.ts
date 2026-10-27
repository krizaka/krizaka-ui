import { defineConfig } from "vitest/config";

// The ratchet is pure and fully covered; the axe wrapper is proved in a real Chromium (contrast needs real layout).
export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    testTimeout: 60_000,
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/index.ts"],
      reporter: ["text"],
      thresholds: { functions: 100, lines: 100, statements: 100, branches: 90 },
    },
  },
});
