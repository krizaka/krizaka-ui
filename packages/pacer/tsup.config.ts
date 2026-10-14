import { defineConfig, type Options } from "tsup";

/**
 * ESM + types. `.` is framework-free and server-safe (a Node script can run a queue); `./react` is the hooks, a client
 * module (the "use client" banner). TanStack Pacer and React stay external (a dependency and a peer); the hooks import
 * the framework-free code from `index.js`, kept external so it is never copied.
 */
const shared = {
  format: ["esm"],
  sourcemap: true,
  clean: false,
  target: "es2022",
  external: ["react", /^@tanstack\//, "./index.js"],
} satisfies Options;

export default defineConfig([
  { ...shared, entry: { index: "src/index.ts" }, dts: { entry: { index: "src/index.ts", react: "src/react.ts" } } },
  { ...shared, entry: { react: "src/react.ts" }, dts: false, banner: { js: '"use client";' } },
]);
