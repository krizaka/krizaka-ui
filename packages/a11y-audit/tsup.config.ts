import { defineConfig } from "tsup";

/** ESM + types, Node only (a test tool: it runs in CI next to Playwright, never in a browser bundle). axe-core stays external. */
export default defineConfig({
  entry: { index: "src/index.ts" },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: false,
  target: "es2022",
  platform: "node",
  external: ["axe-core"],
});
