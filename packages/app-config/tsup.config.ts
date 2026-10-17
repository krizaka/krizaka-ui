import { defineConfig } from "tsup";

/** ESM + types; the entries share the core by import, not by copy. */
export default defineConfig({
  entry: { index: "src/index.ts", server: "src/server.ts", client: "src/client.ts", react: "src/react.ts" },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: false,
  target: "es2022",
  external: ["react"],
  splitting: true,
});
