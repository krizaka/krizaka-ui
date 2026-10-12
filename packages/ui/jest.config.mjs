// The React Native tests (src/native/**/*.test.tsx): Jest with React Native's own preset and Testing Library — the
// renderer and the mocks the apps use. Everything else is tested by Vitest (vitest.config.ts excludes src/native).
import preset from "@react-native/jest-preset";

/** @type {import("jest").Config} */
export default {
  ...preset,
  rootDir: import.meta.dirname,
  // The preset's environment is jest-environment-node 29; the workspace runs Jest 30 (see pnpm-workspace.yaml): the
  // same environment, from Jest 30 (a direct dev dependency: no other copy is picked up), with React Native's
  // export conditions.
  testEnvironment: "jest-environment-node",
  testEnvironmentOptions: { customExportConditions: ["require", "react-native"] },
  roots: ["<rootDir>/src/native"],
  testMatch: ["**/*.test.tsx"],
  // The first suite pays React Native's Babel transform on a cold cache (CI, while turbo runs the other tasks).
  testTimeout: 30_000,
  moduleNameMapper: {
    ...preset.moduleNameMapper,
    // ESM only (an `import` condition): Jest runs CommonJS, so it reads the built file and Babel transforms it.
    "^@krizaka/tokens/native$": "<rootDir>/node_modules/@krizaka/tokens/dist/native.js",
    // The registry's native examples import the package as an app does: resolved to the sources.
    "^@krizaka/ui/native$": "<rootDir>/src/native/index.ts",
    "^@krizaka/ui/native/([a-z-]+)$": "<rootDir>/src/native/$1.tsx",
    // @krizaka/query (the native list's server state): the workspace build (ESM, transformed by Babel like the tokens).
    "^@krizaka/query$": "<rootDir>/node_modules/@krizaka/query/dist/index.js",
    // The Expo modules of the entries that need one (optional peers): their native side does not exist under Jest.
    "^expo-video$": "<rootDir>/src/native/mocks/expo-video.tsx",
    "^expo-camera$": "<rootDir>/src/native/mocks/expo-camera.tsx",
  },
  transform: {
    ...preset.transform,
    "^.+\\.(js|ts|tsx)$": ["babel-jest", { presets: ["module:@react-native/babel-preset"] }],
  },
  // pnpm keeps packages under node_modules/.pnpm/<name>@<version>/node_modules/<name>: React Native ships Flow and
  // untranspiled ESM, so it and its satellites go through Babel; the rest is plain CommonJS.
  transformIgnorePatterns: ["node_modules/(?!(\\.pnpm|(jest-)?react-native|@react-native(-community)?|react-native-svg|@shopify/flash-list)/)"],
  // FlashList v2 measures its views through the native layout: its own setup gives them a size under Jest.
  setupFiles: [...(preset.setupFiles ?? []), "@shopify/flash-list/jestSetup"],
};
