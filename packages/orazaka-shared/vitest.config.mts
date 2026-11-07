import { defineConfig } from "vitest/config";

// The contracts are tested from their sources (src/); `pnpm build` compiles the same sources to CommonJS (tsconfig.build.json).
// The report SonarCloud reads; no threshold: the quality gate judges the new code.
export default defineConfig({
  test: {
    environment: "node",
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/index.ts"],
      reporter: ["text-summary", "lcov"],
    },
  },
});
