import { defineConfig, type Options } from "tsup";

/**
 * ESM + types, one entry per primitive, in three groups (study §2.8):
 * - server: no directive — no hook, no context: usable in a Server Component as they are;
 * - client: a "use client" banner on every file (the marks and the motion, avatar, theme, countdown);
 * - native: React Native (react-native-svg), no directive, never loads react-dom.
 * `dist/` is emptied by the build script, not by tsup: the three builds run side by side.
 */
const shared = {
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: false,
  external: ["react", "react-dom", "react/jsx-runtime"],
} satisfies Options;

export default defineConfig([
  {
    ...shared,
    entry: {
      cn: "src/cn.ts",
      slot: "src/slot/index.ts",
      button: "src/button/index.ts",
      badge: "src/badge/index.ts",
      field: "src/field/index.ts",
      skeleton: "src/skeleton/index.ts",
      "empty-state": "src/empty-state/index.ts",
      spinner: "src/spinner/index.ts",
    },
  },
  {
    ...shared,
    entry: {
      index: "src/index.ts",
      avatar: "src/avatar/index.ts",
      theme: "src/theme/index.ts",
      countdown: "src/countdown/index.ts",
    },
    banner: { js: '"use client";' },
  },
  {
    ...shared,
    entry: { native: "src/native/index.ts" },
    external: [...shared.external, "react-native", "react-native-svg"],
  },
]);
