// The React Native tests (src/native/**/*.test.tsx): Jest with React Native's own preset and Testing Library — the
// renderer and the mocks the apps use. Everything else is tested by Vitest (vitest.config.ts excludes src/native).
import preset from "@react-native/jest-preset";

/** @type {import("jest").Config} */
export default {
  ...preset,
  rootDir: import.meta.dirname,
  testEnvironment: "jest-environment-node",
  testEnvironmentOptions: { customExportConditions: ["require", "react-native"] },
  roots: ["<rootDir>/src/native"],
  testMatch: ["**/*.test.tsx"],
  testTimeout: 30_000,
  moduleNameMapper: {
    ...preset.moduleNameMapper,
    // ESM only (an `import` condition): Jest runs CommonJS, so it reads the built files and Babel transforms them.
    "^@krizaka/tokens/native$": "<rootDir>/node_modules/@krizaka/tokens/dist/native.js",
    "^@krizaka/intl$": "<rootDir>/node_modules/@krizaka/intl/dist/index.js",
    // The registry's native examples import the package as an app does: resolved to the sources.
    "^@krizaka/charts/native$": "<rootDir>/src/native/index.ts",
  },
  transform: {
    ...preset.transform,
    "^.+\\.(js|ts|tsx)$": ["babel-jest", { presets: ["module:@react-native/babel-preset"] }],
  },
  transformIgnorePatterns: ["node_modules/(?!(\\.pnpm|(jest-)?react-native|@react-native(-community)?|react-native-svg|@krizaka)/)"],
};
