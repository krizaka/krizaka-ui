// The design tokens of @krizaka/sovkora-shared are a copy: this package is CommonJS (React Native and the CLI read it)
// and cannot import the ES module @krizaka/tokens/native. This test holds the copy to its source — the Krizaka
// platform surfaces with the Sovkora brand (the `sovkora` brand of @krizaka/tokens since 4.0, same values) — in both modes.
import assert from "node:assert/strict";

import { brands, themes as platform } from "@krizaka/tokens/native";
import { test } from "vitest";

import { status, themes } from "../src/index.ts";

/** The roles of the platform theme that the shared theme carries under the same name. */
const PLATFORM_ROLES = [
  "surface0",
  "surface1",
  "surface2",
  "surface3",
  "borderSubtle",
  "borderDefault",
  "borderStrong",
  "textPrimary",
  "textSecondary",
  "textMuted",
];
/** The roles the Sovkora brand sets. */
const BRAND_ROLES = ["accent", "accentHover", "onAccent", "accentText"];

for (const mode of ["dark", "light"]) {
  test(`${mode}: the platform surfaces, borders and text of @krizaka/tokens`, () => {
    for (const role of PLATFORM_ROLES) assert.equal(themes[mode][role], platform[mode][role], `${mode}.${role}`);
  });

  test(`${mode}: the Sovkora brand accent of @krizaka/tokens (orange, never the 1.x blue or amber)`, () => {
    for (const role of BRAND_ROLES) assert.equal(themes[mode][role], brands.sovkora[mode][role], `${mode}.${role}`);
  });
}

test("status colours are the platform's", () => {
  assert.equal(status.success, platform.dark.success);
  assert.equal(status.error, platform.dark.danger);
  assert.equal(status.warning, platform.dark.warning);
});

test("every theme names every role", () => {
  const roles = Object.keys(themes.dark).sort();
  for (const [name, theme] of Object.entries(themes)) assert.deepEqual(Object.keys(theme).sort(), roles, name);
});
