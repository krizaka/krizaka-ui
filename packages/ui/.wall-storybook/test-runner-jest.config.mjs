import config from "../../../apps/storybook/.storybook/test-runner-jest.config.mjs";

export default {
  ...config,
  testEnvironmentOptions: {
    ...config.testEnvironmentOptions,
    "jest-playwright": {
      ...config.testEnvironmentOptions["jest-playwright"],
      launchOptions: { executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] },
    },
  },
};
