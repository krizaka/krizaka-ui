import { resolve } from "node:path";

import { configDefaults, defineConfig } from "vitest/config";

const src = resolve(import.meta.dirname, "src");

// `@krizaka/ui/<primitive>` (what the registry's examples import) resolves to the sources, as in tsconfig.json.
// The web primitives run on happy-dom; src/native is tested by Jest with React Native's preset (jest.config.mjs).
export default defineConfig({
  resolve: {
    alias: [
      { find: /^@krizaka\/ui$/, replacement: `${src}/index.ts` },
      { find: /^@krizaka\/ui\/cn$/, replacement: `${src}/cn.ts` },
      { find: /^@krizaka\/ui\/([a-z-]+)$/, replacement: `${src}/$1/index.ts` },
      // A nested entry (`@krizaka/ui/app-header/search`): its own folder with an index.
      { find: /^@krizaka\/ui\/([a-z-]+)\/([a-z-]+)$/, replacement: `${src}/$1/$2/index.ts` },
    ],
  },
  test: {
    environment: "happy-dom",
    globals: true,
    testTimeout: 15_000,
    exclude: [...configDefaults.exclude, "src/native/**"],
    // The report SonarCloud reads (CI analysis); no threshold: the quality gate judges the new code.
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/native/**"],
      reporter: ["text-summary", "lcov"],
    },
  },
});
