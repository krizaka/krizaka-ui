import { defineConfig } from "tsup";

/** ESM + types, one entry. `@krizaka/app-client` stays a dependency, never bundled; Tauri is passed in, never imported. */
export default defineConfig({
  entry: { index: "src/index.ts" },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: false,
  target: "es2022",
  external: [/^@krizaka\//],
});
