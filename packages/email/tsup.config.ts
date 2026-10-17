import { defineConfig } from "tsup";

/** ESM + types, one entry. React, React Email, zod and @krizaka/i18n stay external (dependencies); the catalogues are inlined. */
export default defineConfig({
  entry: { index: "src/index.ts" },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: false,
  target: "es2022",
  external: ["react", "react/jsx-runtime", /^@react-email\//, "zod", /^@krizaka\/i18n/],
});
