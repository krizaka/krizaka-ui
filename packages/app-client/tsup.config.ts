import { defineConfig } from "tsup";

/** ESM + types, one entry. The discovery client stays a dependency, never bundled. */
export default defineConfig({
  entry: { index: "src/index.ts" },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: false,
  target: "es2022",
  external: [/^@krizaka\//],
});
