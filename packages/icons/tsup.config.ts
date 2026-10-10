import { defineConfig } from "tsup";

/**
 * ESM + types. `index` (web) and `native` (react-native-svg) share the glyphs as a chunk; every icon is a
 * `/* @__PURE__ *\/` call, so a bundler keeps only the icons an app imports. No "use client": the web icons hold no
 * hook and render in a Server Component.
 */
export default defineConfig({
  entry: { index: "src/index.ts", native: "src/native/index.ts", glyphs: "src/catalog.ts" },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: false,
  target: "es2022",
  external: ["react", "react/jsx-runtime", "react-native-svg"],
});
