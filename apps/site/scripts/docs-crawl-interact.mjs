// WHY  The interactions of the documentation crawl (playgrounds, copy buttons, examples) are the longest job of the crawl and
//      need a browser page; they are apart from the sitemap logic and from the report.
// WHAT `interact(page, note)`: drives the examples and playgrounds of a page like a reader would; `note(category, detail)`
//      receives each problem found. `DEBUG` prints the time of each step.
// HOW  Imported by scripts/docs-crawl.mjs; run the crawl itself (see its header). Selftest: scripts/docs-crawl.selftest.mjs.
// OWNER krizaka-ui (lane platform), ADR-026 phase D.

import { isHarmlessClickError } from "./docs-crawl-verdicts.mjs";

export const DEBUG = process.argv.includes("--debug");

/* The examples and playgrounds of the page, driven like a reader would. Errors raised meanwhile are attributed to the
   interaction by `note` (the phase). */
export async function interact(page, note) {
  const lap = (what, t) => DEBUG && console.log(`    ${what}: ${Date.now() - t} ms`);
  let t = Date.now();
  // Playgrounds: every control must change the canvas or the code.
  const plays = page.locator(".kz-play");
  for (let i = 0; i < (await plays.count()); i++) {
    const play = plays.nth(i);
    await play.scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(400);
    const canvas = play.locator(".kz-play-canvas");
    const snap = async () => ({
      html: await canvas.evaluate((c) => c.innerHTML).catch(() => ""),
      code: await play.locator(".kz-play-code").evaluate((c) => c.textContent).catch(() => ""),
      shot: (await canvas.screenshot({ animations: "disabled" }).catch(() => Buffer.alloc(0))).toString("base64"),
    });
    const same = (a, b) => a.html === b.html && a.code === b.code && a.shot === b.shot;
    const box = await canvas.boundingBox();
    const filled = await canvas.evaluate((c) => c.children.length > 0 && !c.querySelector(".kz-play-wait")).catch(() => false);
    if (!box || box.width < 4 || box.height < 4 || !filled) note("playground-empty", "the playground canvas renders nothing");
    const rows = play.locator(".kz-play-row");
    for (let r = 0; r < (await rows.count()); r++) {
      const row = rows.nth(r);
      const label = ((await row.locator(".kz-play-label").first().textContent().catch(() => "")) ?? "").trim().slice(0, 30);
      const before = await snap();
      let acted = false;
      const sw = row.locator('[role="switch"]');
      const slider = row.locator('[role="slider"]');
      const input = row.locator('input[type="text"], input:not([type]), textarea');
      const options = row.locator('[role="radio"], button');
      try {
        if (await sw.count()) {
          await sw.first().click({ timeout: 3000 });
          acted = true;
        } else if (await slider.count()) {
          await slider.first().focus();
          await page.keyboard.press("ArrowRight");
          await page.keyboard.press("ArrowRight");
          acted = true;
        } else if (await input.count()) {
          await input.first().fill("Krizaka x");
          acted = true;
        } else if (await options.count()) {
          // choose the options in turn until one changes the canvas
          for (let c = 0; c < (await options.count()); c++) {
            const el = options.nth(c);
            const on = (await el.getAttribute("aria-checked")) === "true" || (await el.getAttribute("aria-pressed")) === "true" || ["on", "checked"].includes((await el.getAttribute("data-state")) ?? "");
            if (on) continue;
            await el.click({ timeout: 3000 });
            acted = true;
            await page.waitForTimeout(200);
            if (!same(before, await snap())) break;
          }
        }
      } catch (e) {
        note("interaction-error", `playground control « ${label} »: ${String(e.message).split("\n")[0].slice(0, 120)}`);
        continue;
      }
      if (!acted) continue;
      await page.waitForTimeout(250);
      if (same(before, await snap())) note("knob-noop", `playground control « ${label} » changes neither the canvas nor the code`);
    }
  }

  lap("playgrounds", t);
  t = Date.now();
  // Copy buttons: they must copy something.
  const copies = page.locator('button[aria-label*="opy" i], button[aria-label*="opier" i], button[data-copy], pre ~ button[aria-live], figure button[aria-live="polite"]');
  const copyCount = Math.min(await copies.count(), 40);
  for (let i = 0; i < copyCount; i++) {
    const btn = copies.nth(i);
    // A « Copy » button inside an example is sample content (a tooltip's trigger), unless it sits in a code block.
    const sample = await btn.evaluate((b) => Boolean(b.closest(".kz-live-example, .kz-catalog-live")) && !b.parentElement?.querySelector("pre, code") && !b.closest("figure, [data-rehype-pretty-code-figure]")).catch(() => false);
    if (sample) continue;
    // To the middle of the screen: « visible » is not enough on a phone, where a fixed bar (the site's RailNav) covers the bottom edge
    // and the forced press would land on the bar, not on the button.
    await btn.evaluate((b) => b.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" })).catch(() => {});
    if (!(await btn.isVisible().catch(() => false))) continue;
    try {
      await page.evaluate(() => navigator.clipboard.writeText("__empty__"));
      await btn.click({ timeout: 3000, force: true });
      let text = "";
      for (let tries = 0; tries < 8 && (!text.trim() || text === "__empty__"); tries++) {
        await page.waitForTimeout(150);
        text = await page.evaluate(() => navigator.clipboard.readText());
      }
      if (!text.trim() || text === "__empty__") note("copy-empty", `a copy button copied nothing (« ${((await btn.getAttribute("aria-label")) ?? "").slice(0, 40)} »)`);
    } catch (e) {
      note("interaction-error", `a copy button threw: ${String(e.message).split("\n")[0].slice(0, 120)}`);
    }
  }

  lap("copy", t);
  t = Date.now();
  // Examples: click the first control, open what opens, type in the first field, focus the tabbables.
  const examples = page.locator(".kz-live-example");
  const total = Math.min(await examples.count(), 60);
  for (let i = 0; i < total; i++) {
    const ex = examples.nth(i);
    try {
      await ex.scrollIntoViewIfNeeded({ timeout: 2000 });
    } catch {
      continue;
    }
    await page.waitForTimeout(120);
    const url = page.url();
    const targets = ex.locator('button:not([disabled]), [role="tab"], [role="switch"], [role="checkbox"], [role="combobox"], summary, [role="button"]:not([aria-disabled="true"])');
    if (await targets.count()) {
      const first = targets.first();
      if (await first.isVisible().catch(() => false)) {
        await first.click({ timeout: 2500 }).catch((e) => {
          if (!isHarmlessClickError(String(e.message))) note("interaction-error", `click threw: ${String(e.message).split("\n")[0].slice(0, 120)}`);
        });
        await page.waitForTimeout(250);
        if (await page.locator('[role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"], [data-radix-popper-content-wrapper]').count()) {
          await page.keyboard.press("Escape");
          await page.waitForTimeout(150);
        }
      }
    }
    const field = ex.locator('input[type="text"], input[type="search"], input[type="email"], input:not([type]), textarea').first();
    if (await field.count()) {
      await field.fill("Krizaka", { timeout: 2000 }).catch(() => {});
      await field.press("Enter", { timeout: 1000 }).catch(() => {});
    }
    const tabbables = ex.locator('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex="0"]');
    for (let t = 0; t < Math.min(await tabbables.count(), 3); t++) await tabbables.nth(t).focus({ timeout: 800 }).catch(() => {});
    if (page.url() !== url) {
      // An example that navigates away is a link doing its job; come back.
      await page.goBack({ waitUntil: "networkidle" }).catch(() => {});
      break;
    }
  }
  lap("examples", t);
}
