import { defineConfig, type Options } from "tsup";

/**
 * ESM + types, two groups that share one chunk of framework-free code (`core.js`, kept external so it is never copied):
 * - server-safe: `.` (TanStack re-exported + the Krizaka layer), `./server` (prefetch, hydration), `./persist`,
 *   `./native` and `core` itself — no directive, importable from a Server Component;
 * - client: the provider and the live hook (`react.js`) and `./devtools` carry a "use client" banner.
 * TanStack, React and @krizaka/realtime stay external (dependencies and peers).
 */
const shared = {
  format: ["esm"],
  sourcemap: true,
  clean: false,
  target: "es2022",
  external: ["react", "react/jsx-runtime", /^@tanstack\//, /^@krizaka\//, /^nuqs/, "./core.js", "./react.js"],
} satisfies Options;

// One declaration build for every entry: `.` and `./server` share one `KrizakaApiError` type.
const declarations = {
  index: "src/index.ts",
  core: "src/core.ts",
  react: "src/react.tsx",
  server: "src/server.tsx",
  persist: "src/persist.ts",
  native: "src/native.ts",
  devtools: "src/devtools.tsx",
  url: "src/url.ts",
  "url-server": "src/url-server.ts",
  "url-next": "src/url-next.tsx",
};

export default defineConfig([
  {
    ...shared,
    entry: { index: "src/index.ts", core: "src/core.ts", server: "src/server.tsx", persist: "src/persist.ts", native: "src/native.ts", "url-server": "src/url-server.ts" },
    dts: { entry: declarations },
  },
  { ...shared, entry: { react: "src/react.tsx", devtools: "src/devtools.tsx", url: "src/url.ts", "url-next": "src/url-next.tsx" }, dts: false, banner: { js: '"use client";' } },
]);
