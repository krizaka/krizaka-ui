import { platform } from "node:os";
import { join } from "node:path";

import { getStoryContext, type TestRunnerConfig, waitForPageReady } from "@storybook/test-runner";
import { checkA11y, configureAxe, injectAxe } from "axe-playwright";
import { toMatchImageSnapshot } from "jest-image-snapshot";

/**
 * Every story, in dark then in light: an axe audit (a violation fails the run, as `a11y.test: "error"` asks) and a
 * screenshot compared with the committed one (0.1 % of the pixels may differ). Baselines are per platform, because
 * fonts and anti-aliasing differ between macOS and the Linux CI.
 *
 * A story that opens something in a portal (dialog, sheet, popover, menu, tooltip, toasts) renders it outside
 * `#storybook-root`: it sets `parameters.capture = "viewport"`, and the audit (without the layout's "region" rule) and the screenshot cover
 * the whole page.
 */
const SCREENSHOTS = join(process.cwd(), "__screenshots__", platform());
const THEMES = ["dark", "light"] as const;

const config: TestRunnerConfig = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async preVisit(page) {
    // Every story starts in dark: the previous story's light pass must not leak into the next one (the page is reused,
    // and the native frame reads `html.light` when it mounts).
    await page.evaluate(() => document.documentElement.classList.remove("light"));
    await injectAxe(page);
  },
  async postVisit(page, context) {
    const story = await getStoryContext(page, context);
    const viewport = story.parameters?.capture === "viewport";
    for (const theme of THEMES) {
      await page.evaluate((light) => document.documentElement.classList.toggle("light", light), theme === "light");
      // The native frame follows `html.light` through a MutationObserver and a React state: let it re-render.
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      await waitForPageReady(page);
      if (story.parameters?.a11y?.test !== "off" && !story.parameters?.a11y?.disable) {
        // A page-level audit: "region" (all content inside landmarks) belongs to the app's layout, not to a portal.
        const rules = [...(story.parameters?.a11y?.config?.rules ?? []), ...(viewport ? [{ id: "region", enabled: false }] : [])];
        await configureAxe(page, { rules });
        await checkA11y(page, viewport ? "body" : "#storybook-root", {
          detailedReport: true,
          detailedReportOptions: { html: true },
          verbose: false,
          axeOptions: story.parameters?.a11y?.options,
        });
      }
      const image = viewport
        ? await page.screenshot({ animations: "disabled" })
        : await page.locator("#storybook-root").screenshot({ animations: "disabled" });
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
