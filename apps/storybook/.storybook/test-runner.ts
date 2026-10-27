import { existsSync } from "node:fs";
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
/**
 * The stories never touch the network (krizaka-ui#115 follow-up: a poster from www.krizaka.com that did not arrive in
 * time made a native story 88 % different on CI). A request to another host is answered from `fixtures/<host>/<path>`
 * when the file exists (the tour's posters and clips, copied from krizaka.com), and refused otherwise — the example
 * hosts (`example.com`, `api.example.com`…) are unreachable on purpose. A refused krizaka.com asset fails the story:
 * add its fixture.
 */
const FIXTURES = join(process.cwd(), "fixtures");
const FIRST_PARTY = /(^|\.)krizaka\.com$/;
const routed = new WeakSet<object>();
const missing: string[] = [];
// The viewport every story starts from: a failed story must not leave the next one at a phone's width.
let startViewport: { width: number; height: number } | null = null;
const THEMES = ["dark", "light"] as const;

const config: TestRunnerConfig = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async preVisit(page) {
    startViewport ??= page.viewportSize();
    if (startViewport) await page.setViewportSize(startViewport);
    // Every story starts in dark: the previous story's light pass must not leak into the next one (the page is reused,
    // and the native frame reads `html.light` when it mounts).
    await page.evaluate(() => document.documentElement.classList.remove("light"));
    if (!routed.has(page)) {
      routed.add(page);
      await page.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, (route) => {
        const url = new URL(route.request().url());
        const file = join(FIXTURES, url.host, decodeURIComponent(url.pathname));
        if (existsSync(file)) return route.fulfill({ path: file });
        if (FIRST_PARTY.test(url.host)) missing.push(url.href);
        return route.abort("blockedbyclient");
      });
    }
    missing.length = 0;
    await injectAxe(page);
  },
  async postVisit(page, context) {
    const story = await getStoryContext(page, context);
    // A first-party asset without its fixture in apps/storybook/fixtures.
    expect({ missingFixtures: missing }).toEqual({ missingFixtures: [] });
    const viewport = story.parameters?.capture === "viewport";
    // A template's phone story (`parameters.phone`): the page is laid out and captured at a phone's width, then the
    // viewport is put back for the next story.
    const before = page.viewportSize();
    // `parameters.viewportWidth`: the same at any width (a tablet's 768, a laptop's 1024).
    const width: number | undefined = story.parameters?.viewportWidth ?? (story.parameters?.phone ? 390 : undefined);
    if (width) {
      await page.setViewportSize({ width, height: 844 });
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    }
    // `parameters.noOverflow`: nothing of the page sticks out sideways at this width (a bar whose labels are too long).
    if (story.parameters?.noOverflow) {
      const out = await page.evaluate(() => {
        const w = document.documentElement.clientWidth;
        const bad = [...document.querySelectorAll<HTMLElement>("a,button")]
          .filter((el) => el.getClientRects().length > 0 && el.getBoundingClientRect().right > w + 0.5)
          .map((el) => el.textContent?.trim() ?? "");
        return { pageOverflow: document.documentElement.scrollWidth > w, bad };
      });
      expect(out).toEqual({ pageOverflow: false, bad: [] });
    }
    // `parameters.maxHeight`: a section is at most so high at this width (a layout budget: ADR-007's compact price board).
    if (story.parameters?.maxHeight) {
      const { selector, px } = story.parameters.maxHeight as { selector: string; px: number };
      await page.waitForFunction((sel: string) => document.querySelector(sel) !== null, selector);
      const height = await page.evaluate((sel: string) => document.querySelector(sel)!.getBoundingClientRect().height, selector);
      expect({ selector, height: Math.ceil(height), within: Math.ceil(height) <= px }).toEqual({ selector, height: Math.ceil(height), within: true });
    }
    // `parameters.contain`: nothing sticks out of its room (krizaka-ui#753). Every element lies inside the horizontal
    // bounds of the story, and inside the room of the grid, columns or pane it belongs to (`[data-columns]`,
    // `[data-layout]`, `[data-panes]`), unless a scrolling or clipping ancestor holds it — the same containment rule as
    // the site's page audit (`crawl-check`), at the width of the story. It reads the layout, so it holds at 200 % text
    // and in right-to-left as in the default.
    if (story.parameters?.contain) {
      const out = await page.evaluate(() => {
        const root = document.querySelector<HTMLElement>("#storybook-root");
        if (!root) return { bad: ["no #storybook-root"] };
        const holds = (el: Element) => {
          for (let p = el.parentElement; p && p !== root.parentElement; p = p.parentElement) {
            if (/(hidden|auto|scroll|clip)/.test(getComputedStyle(p).overflowX)) return true;
          }
          return false;
        };
        const rooms = [root, ...root.querySelectorAll<HTMLElement>("[data-columns],[data-layout],[data-panes]")];
        const bad: string[] = [];
        for (const room of rooms) {
          const box = room.getBoundingClientRect();
          for (const el of room.querySelectorAll<HTMLElement>("*")) {
            if (el.getClientRects().length === 0 || holds(el)) continue;
            const r = el.getBoundingClientRect();
            if (r.width > 0 && (r.left < box.left - 1 || r.right > box.right + 1)) bad.push(`${el.tagName.toLowerCase()} "${(el.textContent ?? "").trim().slice(0, 24)}" ${Math.round(r.left)}–${Math.round(r.right)} outside ${Math.round(box.left)}–${Math.round(box.right)}`);
          }
        }
        return { bad: [...new Set(bad)].slice(0, 8) };
      });
      expect(out).toEqual({ bad: [] });
    }
    // @krizaka/charts: an ECharts engine and the world's countries load lazily (`data-pending` until drawn).
    await page.waitForFunction(() => !document.querySelector("[data-pending]"), undefined, { timeout: 15_000 });
    for (const theme of THEMES) {
      await page.evaluate((light) => document.documentElement.classList.toggle("light", light), theme === "light");
      // The native frame follows `html.light` through a MutationObserver and a React state: let it re-render.
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      // A canvas or ECharts chart re-reads its colours after a theme switch (a MutationObserver, then its own frame).
      if (await page.locator("[data-kzc] .kzc-host").count()) await page.waitForTimeout(250);
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
      // Remote pictures (a poster, a filmstrip) are in the screenshot only once loaded and decoded.
      await page
        .waitForFunction(() => [...document.images].every((img) => img.complete), undefined, { timeout: 15_000 })
        .catch(() => undefined);
      await page.evaluate(() => Promise.all([...document.images].map((img) => img.decode().catch(() => undefined))));
      // A video with a source that preloads its metadata shows its length once it has it: wait for it, as for the pictures.
      await page
        .waitForFunction(() => [...document.querySelectorAll("video")].every((v) => !v.currentSrc || v.preload === "none" || v.readyState >= 1 || v.error), undefined, { timeout: 15_000 })
        .catch(() => undefined);
      // A story whose picture depends on a media decoder (a video frame) is audited but not screenshot-compared:
      // `parameters: { screenshot: false }`, with the reason beside it — exceptional, reviewed.
      if (story.parameters?.screenshot === false) continue;
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
    // krizaka-ui#393 — the quiet hover: a card or a button under a real pointer does not move (its transform, translate
    // and scale are the same as at rest — a control may be centred by a translate) and no light layer appears.
    const target = page.locator("#storybook-root :is(.kz-block-card, .kz-glow, button[data-variant])").first();
    if ((await target.count()) && (await target.isVisible())) {
      const read = () =>
        target.evaluate((el) => {
          const s = getComputedStyle(el);
          return {
            transform: s.transform,
            translate: s.translate,
            scale: s.scale,
            light: el.classList.contains("kz-block-card") ? getComputedStyle(el, "::after").content : "none",
            pointer: el.style.getPropertyValue("--kz-pointer-x") || el.style.getPropertyValue("--kz-glow-x"),
          };
        });
      const rest = await read();
      await target.hover({ timeout: 2_000 }).catch(() => undefined);
      await page.waitForTimeout(200);
      expect(await read()).toEqual({ ...rest, light: "none", pointer: "" });
      await page.mouse.move(0, 0);
    }
    if (width && before) await page.setViewportSize(before);
  },
};

export default config;
