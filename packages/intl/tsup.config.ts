import { defineConfig } from "tsup";

/** ESM + types, one entry per sub-path; the shared formatter cache is a chunk, so every entry reuses one cache. */
export default defineConfig({
  entry: {
    index: "src/index.ts",
    money: "src/money.ts",
    number: "src/number.ts",
    date: "src/date.ts",
    plural: "src/plural.ts",
  },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: false,
  target: "es2022",
});
