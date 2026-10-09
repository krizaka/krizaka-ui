import { defineConfig } from "tsup";

/**
 * ESM + types. Two builds: the web entry (every module a client component — the marks and the motion run in the
 * browser) and the native entry (React Native, react-native-svg), which has no "use client" and never loads react-dom.
 */
export default defineConfig([
  {
    entry: { index: "src/index.ts" },
    format: ["esm"],
    dts: true,
    sourcemap: true,
    clean: true,
    external: ["react", "react-dom", "react/jsx-runtime"],
    banner: { js: '"use client";' },
  },
  {
    entry: { native: "src/native/index.ts" },
    format: ["esm"],
    dts: true,
    sourcemap: true,
    clean: false,
    external: ["react", "react/jsx-runtime", "react-native", "react-native-svg"],
  },
]);
