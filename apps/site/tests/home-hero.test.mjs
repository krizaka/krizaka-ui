// The home's first screen (lib/home-hero.ts, lib/install.ts, lib/github-stars.ts): the live kit's scope, the install line
// the hero copies, and the stars read from GitHub at build.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { parseStars, showStars, STARS_SHOWN_FROM } from "../lib/github-stars.ts";
import { KIT_IDENTITIES, kitScope } from "../lib/home-hero.ts";
import { NATIVE_INSTALL, WEB_INSTALL } from "../lib/install.ts";

test("the kit wears the real token classes: a brand (none for Krizaka, the default) and a scoped theme", () => {
  assert.equal(kitScope("krizaka", "dark"), "theme-dark");
  assert.equal(kitScope("krizaka", "light"), "theme-light");
  assert.equal(kitScope("orochia", "light"), "brand-orochia theme-light");
  assert.equal(kitScope("orazaka", "dark"), "brand-orazaka theme-dark");
});

test("the kit offers the default first, then the products the home's scene draws", () => {
  assert.equal(KIT_IDENTITIES[0], "krizaka");
  assert.deepEqual([...KIT_IDENTITIES].sort(), ["krizaka", "orazaka", "orochia", "yomizaka"]);
});

test("every brand the kit offers exists in @krizaka/tokens' scoped brands", () => {
  const css = readFileSync(new URL("../../../packages/tokens/dist/brands/scoped.css", import.meta.url), "utf8");
  for (const id of KIT_IDENTITIES.filter((id) => id !== "krizaka")) assert.match(css, new RegExp(`\\.brand-${id}\\b`), id);
});

test("the hero's install line is the one the Installation page documents", () => {
  const page = readFileSync(new URL("../content/docs/installation.mdx", import.meta.url), "utf8");
  assert.ok(page.includes(WEB_INSTALL), "installation.mdx documents WEB_INSTALL");
  assert.match(NATIVE_INSTALL, /npm install @krizaka\/ui/);
});

test("stars: the count GitHub gives, or nothing", () => {
  assert.equal(parseStars({ stargazers_count: 42, full_name: "krizaka/krizaka-ui" }), 42);
  assert.equal(parseStars({ stargazers_count: 0 }), 0);
  assert.equal(parseStars({ message: "API rate limit exceeded" }), null);
  assert.equal(parseStars({ stargazers_count: -1 }), null);
  assert.equal(parseStars({ stargazers_count: "12" }), null);
  assert.equal(parseStars(null), null);
});

test("stars are a figure only once they inform: none when unread, none below the threshold", () => {
  assert.equal(showStars(null), false);
  assert.equal(showStars(0), false);
  assert.equal(showStars(STARS_SHOWN_FROM - 1), false);
  assert.equal(showStars(STARS_SHOWN_FROM), true);
});
