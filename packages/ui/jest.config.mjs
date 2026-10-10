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
  moduleNameMapper: {
    ...preset.moduleNameMapper,
    // ESM only (an `import` condition): Jest runs CommonJS, so it reads the built file and Babel transforms it.
    "^@krizaka/tokens/native$": "<rootDir>/node_modules/@krizaka/tokens/dist/native.js",
  },
  transform: {
    ...preset.transform,
    "^.+\\.(js|ts|tsx)$": ["babel-jest", { presets: ["module:@react-native/babel-preset"] }],
  },
  // pnpm keeps packages under node_modules/.pnpm/<name>@<version>/node_modules/<name>: React Native ships Flow and
  // untranspiled ESM, so it and its satellites go through Babel; the rest is plain CommonJS.
  transformIgnorePatterns: ["node_modules/(?!(\\.pnpm|(jest-)?react-native|@react-native(-community)?|react-native-svg)/)"],
};
