import { platform } from "node:os";
import { join } from "node:path";

import { getStoryContext, type TestRunnerConfig, waitForPageReady } from "@storybook/test-runner";
import { checkA11y, configureAxe, injectAxe } from "axe-playwright";
import { toMatchImageSnapshot } from "jest-image-snapshot";

/**
 * Every story, in dark then in light: an axe audit (a violation fails the run, as `a11y.test: "error"` asks) and a
 * screenshot compared with the committed one (0.1 % of the pixels may differ). Baselines are per platform, because
 * fonts and anti-aliasing differ between macOS and the Linux CI.
 */
const SCREENSHOTS = join(process.cwd(), "__screenshots__", platform());
const THEMES = ["dark", "light"] as const;

const config: TestRunnerConfig = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page, context) {
    const story = await getStoryContext(page, context);
    for (const theme of THEMES) {
      await page.evaluate((light) => document.documentElement.classList.toggle("light", light), theme === "light");
      await waitForPageReady(page);
      if (story.parameters?.a11y?.test !== "off" && !story.parameters?.a11y?.disable) {
        await configureAxe(page, { rules: story.parameters?.a11y?.config?.rules });
        await checkA11y(page, "#storybook-root", {
          detailedReport: true,
          detailedReportOptions: { html: true },
          verbose: false,
          axeOptions: story.parameters?.a11y?.options,
        });
      }
      const image = await page.locator("#storybook-root").screenshot({ animations: "disabled" });
      expect(image).toMatchImageSnapshot({
        customSnapshotsDir: SCREENSHOTS,
        customSnapshotIdentifier: `${context.id}--${theme}`,
        failureThreshold: 0.001,
        failureThresholdType: "percent",
        customDiffDir: join(process.cwd(), "__screenshots__", "__diff__"),
      });
    }
  },
};

export default config;
