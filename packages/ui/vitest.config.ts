import { resolve } from "node:path";

import { configDefaults, defineConfig } from "vitest/config";

const src = resolve(import.meta.dirname, "src");

// `@krizaka/ui/<primitive>` (what the registry's demos import) resolves to the sources, as in tsconfig.json.
// The web primitives run on happy-dom; src/native is tested by Jest with React Native's preset (jest.config.mjs).
export default defineConfig({
  resolve: {
    alias: [
      { find: /^@krizaka\/ui\/cn$/, replacement: `${src}/cn.ts` },
      { find: /^@krizaka\/ui\/([a-z-]+)$/, replacement: `${src}/$1/index.ts` },
    ],
  },
  test: { environment: "happy-dom", globals: true, exclude: [...configDefaults.exclude, "src/native/**"] },
});
