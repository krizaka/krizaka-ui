import { defineConfig } from "tsup";

/** ESM + types; every module is a client component (the marks and the motion run in the browser). */
export default defineConfig({
  entry: { index: "src/index.ts" },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "react/jsx-runtime"],
  banner: { js: '"use client";' },
});
