import assert from "node:assert/strict";
import { test } from "node:test";

import { assertWritable, avatarFiles, brandFiles, brandIndex, emblem, hslToRgba, stalePaths, standalone, tokensOf } from "./export-brand.mjs";

test("reads the tokens of a theme block", () => {
  const css = ":root, .theme-dark {\n  --kz-text-primary: hsl(0 0% 96%); /* x */\n}\nhtml.light {\n  --kz-text-primary: hsl(240 6% 10%);\n}\n";
  assert.deepEqual(tokensOf(css, ":root, .theme-dark"), { "--kz-text-primary": "hsl(0 0% 96%)" });
  assert.equal(tokensOf(css, "html.light")["--kz-text-primary"], "hsl(240 6% 10%)");
  assert.throws(() => tokensOf(css, ".nope"));
});

test("converts hsl() with and without alpha", () => {
  assert.equal(hslToRgba("hsl(0 0% 100%)"), "rgba(255, 255, 255, 1)");
  assert.equal(hslToRgba("hsl(0 0% 100% / 0.10)"), "rgba(255, 255, 255, 0.1)");
  assert.throws(() => hslToRgba("red"));
});

test("makes a rendered mark standalone: no stylesheet, no host token left", () => {
  const svg = '<svg width="32" height="32" viewBox="0 0 400 400" aria-hidden="true"><style>.a{}</style><circle stroke="var(--kz-border-default, color-mix(in srgb, currentColor 30%, transparent))"/></svg>';
  const out = standalone(svg, { "--kz-border-default": "hsl(0 0% 100% / 0.10)" }, 400);
  assert.ok(!out.includes("var(") && !out.includes("<style") && !out.includes("aria-hidden"));
  assert.ok(out.startsWith('<svg width="400" height="400"'));
  assert.throws(() => standalone(svg, {}, 400), /no --kz-border-default/);
});

test("cuts the orbit and ring from an emblem and pads its viewBox", () => {
  const svg = '<svg viewBox="100 100 200 200"><circle stroke-dasharray="3 3" r="1"/><circle opacity=".35" r="2"/><path d="M0"/></svg>';
  const out = emblem(svg);
  assert.ok(!out.includes("<circle") && out.includes("<path"));
  assert.ok(out.includes('viewBox="88 88 224 224"'));
});

test("names the files of the library", () => {
  const files = brandFiles();
  assert.ok(files.includes("logo-dark.svg") && files.includes("mark-light-1024.png") && files.includes("avatar-500.png") && files.includes("social-preview-1280x640.png"));
  assert.equal(files.length, 2 * 2 * 5 + 3 + 8);
  for (const f of ["mark-dark-64.png", "mark-light-512.png", "lockup-dark.svg", "lockup-light.svg", "favicon.svg", "og-mark.png"]) assert.ok(files.includes(f), f);
  assert.deepEqual(avatarFiles(["person"], [256], 2), ["person-1.svg", "person-1-256.webp", "person-2.svg", "person-2-256.webp"]);
});

test("writes only brand/ and people/defaults/v1/", () => {
  assert.equal(assertWritable("brand/yomizaka/logo-dark.svg"), "brand/yomizaka/logo-dark.svg");
  assert.equal(assertWritable("people/defaults/v1/akinaza/person-1.svg"), "people/defaults/v1/akinaza/person-1.svg");
  assert.equal(assertWritable("brand/manifest.json"), "brand/manifest.json");
  assert.throws(() => assertWritable("site/home/x.png"));
  assert.throws(() => assertWritable("brand/../site/x.png"));
});

test("brand/index.json lists every URL and the producing version", () => {
  const idx = brandIndex(["orazaka"], "9.9.9", "cdn.example");
  assert.equal(idx.generatedFrom, "@krizaka/ui@9.9.9");
  assert.equal(idx.brands.orazaka["mark-dark-64"], "https://cdn.example/brand/orazaka/mark-dark-64.png");
  assert.equal(idx.brands.orazaka["favicon"], "https://cdn.example/brand/orazaka/favicon.svg");
  assert.equal(assertWritable("brand/index.json"), "brand/index.json");
});

test("cuts the orbit and ring as React renders them (open and close tags)", () => {
  const out = emblem('<svg viewBox="0 0 400 400"><circle r="1" stroke-dasharray="8 8" opacity=".6"></circle><circle r="2" opacity=".35"></circle><circle r="3"></circle></svg>');
  assert.equal((out.match(/<circle/g) ?? []).length, 1);
});

test("names the files of the zone the export no longer produces (a brand that left)", () => {
  const files = new Map([["brand/krizaka/logo-dark.svg", Buffer.from("")], ["brand/manifest.json", Buffer.from("")]]);
  const listed = ["brand/retired/logo-dark.svg", "brand/krizaka/logo-dark.svg", "brand/manifest.json", "people/defaults/v1/retired/person-1.svg"];
  assert.deepEqual(stalePaths(listed, files), ["brand/retired/logo-dark.svg", "people/defaults/v1/retired/person-1.svg"]);
});
