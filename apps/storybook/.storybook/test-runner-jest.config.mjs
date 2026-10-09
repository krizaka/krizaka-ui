// The test-runner's Jest configuration: every story is visited with motion reduced, so the marks stand still, the
// words do not roll and [data-reveal] blocks are shown at once — the screenshots are deterministic.
import { getJestConfig } from "@storybook/test-runner";

const base = getJestConfig();

/** @type {import('@jest/types').Config.InitialOptions} */
export default {
  ...base,
  testTimeout: 30000,
  testEnvironmentOptions: {
    ...base.testEnvironmentOptions,
    "jest-playwright": {
      ...base.testEnvironmentOptions?.["jest-playwright"],
      browsers: ["chromium"],
      contextOptions: { reducedMotion: "reduce", viewport: { width: 1024, height: 640 }, deviceScaleFactor: 1 },
    },
  },
};
