import { defineConfig, type Options } from "tsup";

/**
 * ESM + types, one file per entry, in three groups:
 * - library: the engine (`.`), `<Rich>` (server-safe: no hook) and the programmatic gates (`./check`);
 * - client: `./react` (context and hook) carries a "use client" banner;
 * - bin: the `krizaka-i18n` CLI, with its shebang.
 * React, TypeScript and @krizaka/intl stay external (peer and dependency).
 */
const shared = {
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: false,
  target: "es2022",
  external: ["react", "react/jsx-runtime", "typescript", /^@krizaka\/intl/],
} satisfies Options;

export default defineConfig([
  { ...shared, entry: { index: "src/index.ts", rich: "src/rich.tsx", check: "src/check-entry.ts" } },
  { ...shared, entry: { react: "src/react.tsx" }, banner: { js: '"use client";' } },
  { ...shared, entry: { bin: "src/bin.ts" }, dts: false, banner: { js: "#!/usr/bin/env node" } },
]);
