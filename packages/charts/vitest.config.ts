import { resolve } from "node:path";

import { configDefaults, defineConfig } from "vitest/config";

const src = resolve(import.meta.dirname, "src");

// `@krizaka/charts/<entry>` (what the registry's examples import) resolves to the sources, as in tsconfig.json.
// The web charts run on happy-dom; src/native is tested by Jest with React Native's preset (jest.config.mjs).
export default defineConfig({
  resolve: {
    alias: [
      { find: /^@krizaka\/charts$/, replacement: `${src}/index.ts` },
      { find: /^@krizaka\/charts\/([a-z-]+)$/, replacement: `${src}/$1/index.ts` },
    ],
  },
  // axe over a whole chart is slow on a busy CI runner (turbo runs the other tasks beside it).
  test: { environment: "happy-dom", globals: true, testTimeout: 30_000, exclude: [...configDefaults.exclude, "src/native/**"] },
});
