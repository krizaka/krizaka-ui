// The builder demo is a workspace page (krizaka-internal#3549): out of the docs layout, full width, the first field one key
// away. The measures at 1440 and 360 (editor top, preview width, tab stops, sideways scroll) are scripts/builder-check.mjs, in CI.
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

import { firstField, focusFirstField } from "../lib/builder-focus.ts";
import { LIMITS } from "../scripts/builder-limits.mjs";

const source = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const exists = (file) => existsSync(new URL(`../${file}`, import.meta.url));
const code = (file) => source(file).replace(/\/\*[\s\S]*?\*\/|^\s*\/\/.*$/gm, "");

test("the limits of the issue: 320 px at 1440, 780 px at 360, a 720 px preview, 10 tab stops", () => {
  assert.deepEqual(LIMITS, { 1440: { editorTop: 320, previewWidth: 720 }, 360: { editorTop: 780 }, tabStops: 10 });
});

test("the builder lives in the workspace group, every other page in the docs group, in both languages", () => {
  for (const root of ["app/(en)", "app/(fr)/fr"]) {
    assert.ok(exists(`${root}/(workspace)/builder/page.tsx`), `${root}: builder`);
    assert.ok(!exists(`${root}/builder`), `${root}: no builder left outside the group`);
    assert.ok(exists(`${root}/(docs)/layout.tsx`) && exists(`${root}/(docs)/[...slug]/page.tsx`) && exists(`${root}/(docs)/page.tsx`), `${root}: docs`);
    assert.match(source(`${root}/(workspace)/layout.tsx`), /<WorkspaceShell>/);
    assert.match(source(`${root}/(docs)/layout.tsx`), /<DocsShell locale="(en|fr)">/);
  }
});

test("the root of the site has no docs layout and no bar: each group layout brings its own", () => {
  const root = code("app/components/SiteRoot.tsx");
  assert.doesNotMatch(root, /DocsLayout|<SiteBar/);
  assert.match(code("app/components/docs/DocsShell.tsx"), /<SiteBar[\s\S]*<DocsLayout/);
});

test("the workspace's first tab stop is the shortcut to the fields, before the bar; no docs menu in it", () => {
  const shell = code("app/components/WorkspaceShell.tsx");
  assert.ok(shell.indexOf("<FieldsShortcut") < shell.indexOf("<SiteBar"), "the shortcut comes first in the page");
  assert.doesNotMatch(shell, /DocsLayout|Sidebar/);
});

test("the page is the whole width: no max-w-6xl, no docs page, a link back to the documentation", () => {
  const view = code("app/components/builder/BuilderPageView.tsx");
  assert.doesNotMatch(view, /max-w-6xl|DocsPage|DocsBody/);
  assert.match(view, /localePath\(locale, "\/"\)/);
  assert.match(view, /b\.backToDocs/);
  for (const locale of ["en", "fr"]) assert.equal(typeof JSON.parse(source(`messages/${locale}.json`)).site.builder.backToDocs, "string", locale);
});

test("the title is the Cahier's: Young Serif (the display face), one weight, never bold", () => {
  const rule = source("app/globals.css").match(/\.kz-workspace-title\s*\{([^}]*)\}/)?.[1] ?? "";
  assert.match(rule, /font-family:\s*var\(--kz-font-display\)/);
  assert.match(rule, /font-weight:\s*400/);
  assert.doesNotMatch(rule, /font-weight:\s*(5|6|7|8|9)\d\d|bold/);
});

test("the editor slot grows into the screen and nothing moves (no transition, no animation) in the workspace's rules", () => {
  const css = source("app/globals.css");
  const block = css.slice(css.indexOf(".kz-workspace-gutter"));
  assert.match(block, /\.kz-builder-screen\s*\{[^}]*min-height:\s*100dvh/);
  assert.match(block, /\.kz-builder-slot\s*\{[^}]*flex:\s*1 1 auto[^}]*min-height:\s*560px/);
  assert.doesNotMatch(block, /transition|animation|@keyframes/);
});

// ── the shortcut: a function of the DOM ─────────────────────────────────────────────────────────────────────────────
const el = (visible, extra = {}) => ({ getClientRects: () => (visible ? [{}] : []), focus() { this.focused = true; }, click() { this.clicked = true; }, ...extra });

test("the first visible text field is the one that gets focus; a hidden one is skipped", () => {
  const hidden = el(false);
  const shown = el(true);
  const root = { querySelectorAll: (selector) => (selector.includes("input") ? [hidden, shown] : []) };
  assert.equal(firstField(root), shown);
  assert.equal(focusFirstField(root, "Fields"), true);
  assert.equal(shown.focused, true);
  assert.equal(hidden.focused, undefined);
});

test("no editor, or no fields tab to open: the shortcut says so and moves nothing", () => {
  assert.equal(focusFirstField(null, "Fields"), false);
  assert.equal(focusFirstField({ querySelectorAll: () => [] }, "Fields"), false);
});

test("on a phone the fields tab is opened first, then the field is focused on the next frame", () => {
  const field = el(true);
  const tab = el(true, { getAttribute: (name) => (name === "aria-label" ? "Fields" : null) });
  const other = el(true, { getAttribute: () => "Blocks" });
  let opened = false;
  const root = { querySelectorAll: (selector) => (selector.includes("input") ? (opened ? [field] : []) : [other, tab]) };
  tab.click = () => (opened = true);
  const frames = [];
  globalThis.requestAnimationFrame = (run) => frames.push(run);
  assert.equal(focusFirstField(root, "Fields"), true);
  assert.equal(opened, true);
  assert.equal(field.focused, undefined);
  frames.forEach((run) => run());
  assert.equal(field.focused, true);
});

test("the fields tab of the rail is found by its text when it has no label (UI Builder 0.4)", () => {
  const field = el(true);
  const tab = el(true, { getAttribute: () => null, textContent: " Fields " });
  let opened = false;
  tab.click = () => (opened = true);
  const root = { querySelectorAll: (selector) => (selector.includes("input") ? (opened ? [field] : []) : [tab]) };
  globalThis.requestAnimationFrame = (run) => run();
  assert.equal(focusFirstField(root, "Fields"), true);
  assert.equal(opened, true);
  assert.equal(field.focused, true);
});
