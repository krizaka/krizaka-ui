// WHY  The interactions of the documentation crawl (playgrounds, copy buttons, examples) are the longest job of the crawl and
//      need a browser page; they are apart from the sitemap logic and from the report.
// WHAT `interact(page, note)`: drives the examples and playgrounds of a page like a reader would; `note(category, detail)`
//      receives each problem found. `DEBUG` prints the time of each step.
// HOW  Imported by scripts/docs-crawl.mjs; run the crawl itself (see its header). Selftest: scripts/docs-crawl.selftest.mjs.
// OWNER krizaka-ui (lane platform), ADR-026 phase D.

import { isHarmlessClickError } from "./docs-crawl-verdicts.mjs";

export const DEBUG = process.argv.includes("--debug");

const firstLine = (e) => String(e.message).split("\n")[0].slice(0, 120);

/* What a playground shows: its canvas (markup and pixels) and its code. Two equal snapshots mean a control did nothing. */
function snapshotOf(play, canvas) {
  return async () => ({
    html: await canvas.evaluate((c) => c.innerHTML).catch(() => ""),
    code: await play.locator(".kz-play-code").evaluate((c) => c.textContent).catch(() => ""),
    shot: (await canvas.screenshot({ animations: "disabled" }).catch(() => Buffer.alloc(0))).toString("base64"),
  });
}

const same = (a, b) => a.html === b.html && a.code === b.code && a.shot === b.shot;

async function isOn(el) {
  if ((await el.getAttribute("aria-checked")) === "true") return true;
  if ((await el.getAttribute("aria-pressed")) === "true") return true;
  return ["on", "checked"].includes((await el.getAttribute("data-state")) ?? "");
}

/* Choose the options in turn until one changes the canvas; true when one was clicked. */
async function chooseOptions(page, options, before, snap) {
  let acted = false;
  for (let c = 0; c < (await options.count()); c++) {
    const el = options.nth(c);
    if (await isOn(el)) continue;
    await el.click({ timeout: 3000 });
    acted = true;
    await page.waitForTimeout(200);
    if (!same(before, await snap())) break;
  }
  return acted;
}

/* Drives the row's control (a switch, else a slider, else a text field, else its options); true when one was driven. */
async function driveControl(page, row, before, snap) {
  const sw = row.locator('[role="switch"]');
  if (await sw.count()) {
    await sw.first().click({ timeout: 3000 });
    return true;
  }
  const slider = row.locator('[role="slider"]');
  if (await slider.count()) {
    await slider.first().focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    return true;
  }
  const input = row.locator('input[type="text"], input:not([type]), textarea');
  if (await input.count()) {
    await input.first().fill("Krizaka x");
    return true;
  }
  const options = row.locator('[role="radio"], button');
  if (await options.count()) return chooseOptions(page, options, before, snap);
  return false;
}

/* One control row: driving it must change the canvas or the code. */
async function checkControlRow(page, row, snap, note) {
  const label = ((await row.locator(".kz-play-label").first().textContent().catch(() => "")) ?? "").trim().slice(0, 30);
  const before = await snap();
  let acted;
  try {
    acted = await driveControl(page, row, before, snap);
  } catch (e) {
    note("interaction-error", `playground control « ${label} »: ${firstLine(e)}`);
    return;
  }
  if (!acted) return;
  await page.waitForTimeout(250);
  if (same(before, await snap())) note("knob-noop", `playground control « ${label} » changes neither the canvas nor the code`);
}

async function checkPlayground(page, play, note) {
  await play.scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(400);
  const canvas = play.locator(".kz-play-canvas");
  const snap = snapshotOf(play, canvas);
  const box = await canvas.boundingBox();
  const filled = await canvas.evaluate((c) => c.children.length > 0 && !c.querySelector(".kz-play-wait")).catch(() => false);
  if (!box || box.width < 4 || box.height < 4 || !filled) note("playground-empty", "the playground canvas renders nothing");
  const rows = play.locator(".kz-play-row");
  for (let r = 0; r < (await rows.count()); r++) await checkControlRow(page, rows.nth(r), snap, note);
}

/* Playgrounds: every control must change the canvas or the code. */
async function checkPlaygrounds(page, note) {
  const plays = page.locator(".kz-play");
  for (let i = 0; i < (await plays.count()); i++) await checkPlayground(page, plays.nth(i), note);
}

const COPY_BUTTONS = 'button[aria-label*="opy" i], button[aria-label*="opier" i], button[data-copy], pre ~ button[aria-live], figure button[aria-live="polite"]';
const EMPTY_CLIPBOARD = "__empty__";
const copiedNothing = (text) => !text.trim() || text === EMPTY_CLIPBOARD;

/* A « Copy » button inside an example is sample content (a tooltip's trigger), unless it sits in a code block. */
const isSampleButton = (btn) =>
  btn
    .evaluate((b) => Boolean(b.closest(".kz-live-example, .kz-catalog-live")) && !b.parentElement?.querySelector("pre, code") && !b.closest("figure, [data-rehype-pretty-code-figure]"))
    .catch(() => false);

async function readClipboard(page) {
  let text = "";
  for (let tries = 0; tries < 8 && copiedNothing(text); tries++) {
    await page.waitForTimeout(150);
    text = await page.evaluate(() => navigator.clipboard.readText());
  }
  return text;
}

async function checkCopyButton(page, btn, note) {
  if (await isSampleButton(btn)) return;
  // To the middle of the screen: « visible » is not enough on a phone, where a fixed bar (the site's RailNav) covers the bottom edge
  // and the forced press would land on the bar, not on the button.
  await btn.evaluate((b) => b.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" })).catch(() => {});
  if (!(await btn.isVisible().catch(() => false))) return;
  try {
    await page.evaluate((empty) => navigator.clipboard.writeText(empty), EMPTY_CLIPBOARD);
    await btn.click({ timeout: 3000, force: true });
    const text = await readClipboard(page);
    if (copiedNothing(text)) note("copy-empty", `a copy button copied nothing (« ${((await btn.getAttribute("aria-label")) ?? "").slice(0, 40)} »)`);
  } catch (e) {
    note("interaction-error", `a copy button threw: ${firstLine(e)}`);
  }
}

/* Copy buttons: they must copy something. */
async function checkCopyButtons(page, note) {
  const copies = page.locator(COPY_BUTTONS);
  const copyCount = Math.min(await copies.count(), 40);
  for (let i = 0; i < copyCount; i++) await checkCopyButton(page, copies.nth(i), note);
}

const EXAMPLE_TARGETS = 'button:not([disabled]), [role="tab"], [role="switch"], [role="checkbox"], [role="combobox"], summary, [role="button"]:not([aria-disabled="true"])';
const OVERLAYS = '[role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"], [data-radix-popper-content-wrapper]';
const FIELDS = 'input[type="text"], input[type="search"], input[type="email"], input:not([type]), textarea';
const TABBABLES = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex="0"]';

/* Click the example's first visible control, and close what it opened. */
async function clickFirstControl(page, ex, note) {
  const targets = ex.locator(EXAMPLE_TARGETS);
  if (!(await targets.count())) return;
  const first = targets.first();
  if (!(await first.isVisible().catch(() => false))) return;
  await first.click({ timeout: 2500 }).catch((e) => {
    if (!isHarmlessClickError(String(e.message))) note("interaction-error", `click threw: ${firstLine(e)}`);
  });
  await page.waitForTimeout(250);
  if (await page.locator(OVERLAYS).count()) {
    await page.keyboard.press("Escape");
    await page.waitForTimeout(150);
  }
}

async function typeInFirstField(ex) {
  const field = ex.locator(FIELDS).first();
  if (!(await field.count())) return;
  await field.fill("Krizaka", { timeout: 2000 }).catch(() => {});
  await field.press("Enter", { timeout: 1000 }).catch(() => {});
}

async function focusTabbables(ex) {
  const tabbables = ex.locator(TABBABLES);
  for (let t = 0; t < Math.min(await tabbables.count(), 3); t++) await tabbables.nth(t).focus({ timeout: 800 }).catch(() => {});
}

/* One example, driven like a reader would; true when it navigated away (the walk stops there). */
async function driveExample(page, ex, note) {
  try {
    await ex.scrollIntoViewIfNeeded({ timeout: 2000 });
  } catch {
    return false;
  }
  await page.waitForTimeout(120);
  const url = page.url();
  await clickFirstControl(page, ex, note);
  await typeInFirstField(ex);
  await focusTabbables(ex);
  if (page.url() === url) return false;
  // An example that navigates away is a link doing its job; come back.
  await page.goBack({ waitUntil: "networkidle" }).catch(() => {});
  return true;
}

/* Examples: click the first control, open what opens, type in the first field, focus the tabbables. */
async function driveExamples(page, note) {
  const examples = page.locator(".kz-live-example");
  const total = Math.min(await examples.count(), 60);
  for (let i = 0; i < total; i++) if (await driveExample(page, examples.nth(i), note)) break;
}

const STEPS = [
  ["playgrounds", checkPlaygrounds],
  ["copy", checkCopyButtons],
  ["examples", driveExamples],
];

/* The examples and playgrounds of the page, driven like a reader would. Errors raised meanwhile are attributed to the
   interaction by `note` (the phase). */
export async function interact(page, note) {
  for (const [what, step] of STEPS) {
    const t = Date.now();
    await step(page, note);
    if (DEBUG) console.log(`    ${what}: ${Date.now() - t} ms`);
  }
}
