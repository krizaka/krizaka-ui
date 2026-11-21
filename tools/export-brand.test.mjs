import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { assertDistinctMarks, assertMarksDeclared, assertMarksOfficial, assertWritable, BRANDS, DECLARED_MARKS, OFFICIAL_MARKS, purgeBrand, shapesOf, avatarFiles, brandFiles, brandIndex, emblem, hslToRgba, stalePaths, standalone, tokensOf } from "./export-brand.mjs";

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
  assert.equal(assertWritable("brand/verikora/logo-dark.svg"), "brand/verikora/logo-dark.svg");
  assert.equal(assertWritable("people/defaults/v1/folioviv/person-1.svg"), "people/defaults/v1/folioviv/person-1.svg");
  assert.equal(assertWritable("brand/manifest.json"), "brand/manifest.json");
  assert.throws(() => assertWritable("site/home/x.png"));
  assert.throws(() => assertWritable("brand/../site/x.png"));
});

test("brand/index.json lists every URL and the producing version", () => {
  const idx = brandIndex(["sovkora"], "9.9.9", "cdn.example");
  assert.equal(idx.generatedFrom, "@krizaka/ui@9.9.9");
  assert.equal(idx.brands.sovkora["mark-dark-64"], "https://cdn.example/brand/sovkora/mark-dark-64.png");
  assert.equal(idx.brands.sovkora["favicon"], "https://cdn.example/brand/sovkora/favicon.svg");
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

// ADR-026 phase D: the two regexes over 80 characters are named parts and a function; the other patterns are named. The
// expectations were recorded from the regex version (80,000 hsl() values and 80,000 paths gave no difference).
import {
  ARIA_HIDDEN,
  BRAND_FOLDER,
  DASHED_CIRCLE,
  ENV_LINE,
  EXTENSION,
  FAINT_CIRCLE,
  FILE_NAME,
  HSL_ARGUMENTS,
  hslInside,
  isWritable,
  QUOTED_VALUE,
  SIZE_ATTRIBUTE,
  STYLE_BLOCK,
  TOKEN_WITH_FALLBACK,
  VIEW_BOX,
} from "./export-brand.mjs";

test("hslInside cuts hsl( … ) and hsla( … ); HSL_ARGUMENTS reads hue, saturation, lightness and an optional alpha", () => {
  assert.equal(hslInside("hsl(  240 4% 64% )"), "240 4% 64%");
  assert.equal(hslInside("hsla(240, 4%, 64%, 0.5)"), "240, 4%, 64%, 0.5");
  assert.equal(hslInside("rgb(1 2 3)"), undefined);
  assert.equal(hslInside("hsl()"), undefined);
  assert.equal(hslInside("hsl(1) )"), undefined);
  const started = performance.now();
  for (const evil of [`hsl(${" ".repeat(200000)}`, `hsl(${" ".repeat(200000)}x`, `hsl(${"a ".repeat(100000)}`]) {
    assert.equal(hslInside(evil), undefined);
    assert.equal(HSL_ARGUMENTS.exec(`1${" ".repeat(200000)}x`), null);
  }
  assert.ok(performance.now() - started < 1000, "no super-linear backtracking");
  assert.deepEqual(HSL_ARGUMENTS.exec("240deg, 4%, 64%")?.slice(1, 4), ["240", "4", "64"]);
  assert.deepEqual(HSL_ARGUMENTS.exec("0 0% 100% / 0.10")?.slice(4), ["0.10", ""]);
  assert.deepEqual(HSL_ARGUMENTS.exec("0, 0%, 100%, 10%")?.slice(4), ["10", "%"]);
  for (const bad of ["240 4 64", "240 4% 64% 0.5", "x 4% 64%", ""]) assert.equal(HSL_ARGUMENTS.exec(bad), null, bad);
  });

test("isWritable: brand/<brand>/<file>, the defaults' folder, the two manifests and the index; nothing else", () => {
  for (const p of ["brand/krizaka/logo-dark.svg", "people/defaults/v1/verikora/person-1.svg", "brand/manifest.json", "people/defaults/v1/manifest.json", "brand/index.json"])
    assert.equal(isWritable(p), true, p);
  for (const p of ["people/defaults/v1/index.json", "brand/a/b/c", "brand//x", "brand/A/x.svg", "people/defaults/v2/a/b.svg", "site/a/b.png", "brand/krizaka/", "brand/a b/x"])
    assert.equal(isWritable(p), false, p);
  assert.ok(BRAND_FOLDER.test("folioviv") && !BRAND_FOLDER.test("Folioviv"));
  assert.ok(FILE_NAME.test("mark-dark-256.png") && !FILE_NAME.test("a b.png"));
  });

test("the SVG edit patterns find what React writes", () => {
  assert.equal("a<style>.x{}</style>b".replace(STYLE_BLOCK, ""), "ab");
  assert.equal("var(--kz-ink, color-mix(in srgb, red, blue))".replace(TOKEN_WITH_FALLBACK, (_, name) => name), "--kz-ink");
  assert.equal('<rect width="4" height="5" x="1"/>'.replace(SIZE_ATTRIBUTE, ""), '<rect x="1"/>');
  assert.equal('<svg aria-hidden="true">'.replace(ARIA_HIDDEN, ""), "<svg>");
  assert.equal('<circle r="1" stroke-dasharray="2 3"/><circle opacity=".35"></circle><circle r="2"/>'.replace(DASHED_CIRCLE, "").replace(FAINT_CIRCLE, ""), '<circle r="2"/>');
  assert.deepEqual(VIEW_BOX.exec('<svg viewBox="-1 -2 34.5 36">')?.slice(1), ["-1", "-2", "34.5", "36"]);
  assert.equal("logo-dark.png".replace(EXTENSION, ""), "logo-dark");
  });

test("ENV_LINE and QUOTED_VALUE read a KEY=value line and strip matching quotes", () => {
  assert.deepEqual(ENV_LINE.exec("export KEY = 'a b'")?.slice(1), ["KEY", "'a b'"]);
  assert.equal(ENV_LINE.exec("lower=1"), null);
  assert.equal("'a b'".replace(QUOTED_VALUE, "$2"), "a b");
  assert.equal("'mixed\"".replace(QUOTED_VALUE, "$2"), "'mixed\"");
  });

test("two brands never publish the same mark: Kridoc wearing Folioviv's file is refused", () => {
  const same = Buffer.from("<svg>same</svg>");
  const files = new Map([
    ["brand/folioviv/mark-light.svg", same],
    ["brand/kridoc/mark-light.svg", same],
  ]);
  assert.throws(() => assertDistinctMarks(files), /kridoc and folioviv publish the same mark-light\.svg/);
  files.set("brand/kridoc/mark-light.svg", Buffer.from("<svg>kridoc</svg>"));
  assert.doesNotThrow(() => assertDistinctMarks(files));
  // the dark and light files of one brand may be equal to each other; only another brand's file is refused
  assert.doesNotThrow(() => assertDistinctMarks(new Map([["brand/a/mark-dark.svg", same], ["brand/a/mark-light.svg", same]])));
});

test("a published mark must carry every shape of its official file", () => {
  const official = readFileSync(new URL("./fixtures/brand-official/kridoc-embleme-clair.svg", import.meta.url));
  const files = new Map([["brand/kridoc/mark-light.svg", official], ["brand/kridoc/mark-dark.svg", official]]);
  assert.doesNotThrow(() => assertMarksOfficial(files));
  assert.ok(shapesOf(official.toString()).length >= 6);
  const orange = Buffer.from('<svg><path d="M0 0 L9 9"/></svg>');
  assert.throws(() => assertMarksOfficial(new Map([...files, ["brand/kridoc/mark-light.svg", orange]])), /not the official kridoc-embleme-clair\.svg/);
  assert.throws(() => assertMarksOfficial(new Map()), /is not published/);
  assert.deepEqual(Object.keys(OFFICIAL_MARKS), ["kridoc"]);
});

test("a published mark is the declared one: changed content, or a light and dark that became identical, is refused (krizaka-internal#4592)", () => {
  const dark = Buffer.from("<svg>dark</svg>");
  const light = Buffer.from("<svg>light</svg>");
  const short = (b) => createHash("sha256").update(b).digest("hex").slice(0, 10);
  const declared = { kridoc: { light: short(light), dark: short(dark) } };
  const ok = new Map([["brand/kridoc/mark-light.svg", light], ["brand/kridoc/mark-dark.svg", dark]]);
  assert.doesNotThrow(() => assertMarksDeclared(ok, declared));
  // today's Kridoc state: both themes serve one file, matching neither declared hash
  const same = new Map([["brand/kridoc/mark-light.svg", dark], ["brand/kridoc/mark-dark.svg", dark]]);
  assert.throws(() => assertMarksDeclared(same, declared), /kridoc mark-light\.svg changed content under the declared \?v=/);
  // a changed file without a new declaration is refused, even when light and dark stay different
  const changed = new Map([...ok, ["brand/kridoc/mark-dark.svg", Buffer.from("<svg>other</svg>")]]);
  assert.throws(() => assertMarksDeclared(changed, declared), /mark-dark\.svg changed content/);
  // light and dark identical is refused unless the declaration says so
  const sameDeclared = { kridoc: { light: short(dark), dark: short(dark) } };
  assert.doesNotThrow(() => assertMarksDeclared(same, sameDeclared));
  assert.throws(() => assertMarksDeclared(same, { kridoc: { light: "aaaaaaaaaa", dark: short(dark) } }), /changed content/);
  // a brand with no declaration, and a declared mark that is not published, are refused
  assert.throws(() => assertMarksDeclared(ok, {}, ["kridoc"]), /kridoc has no declared marks/);
  assert.throws(() => assertMarksDeclared(new Map(), declared), /brand\/kridoc\/mark-light\.svg is declared but not published/);
});

test("the committed declaration names every brand and its marks", () => {
  assert.deepEqual(Object.keys(DECLARED_MARKS).sort(), [...BRANDS].sort());
  for (const themes of Object.values(DECLARED_MARKS)) assert.match(`${themes.light}${themes.dark}`, /^[0-9a-f]{20}$/);
  assert.notEqual(DECLARED_MARKS.krizaka.light, DECLARED_MARKS.krizaka.dark);
});

// krizaka-internal#4592: Bunny ignores the query string, so a changed mark stayed cached on the edge under its old URL.
test("the upload purges brand/* on the pull zone with the account key, and says so when it has none", async () => {
  const calls = [];
  const fetchImpl = async (url, init) => { calls.push([String(url), init]); return { ok: true, status: 200 }; };
  const logs = [];
  assert.equal(await purgeBrand({ pull: "cdn.example" }, "acct", fetchImpl, (l) => logs.push(l)), true);
  assert.equal(calls.length, 1);
  assert.equal(new URL(calls[0][0]).searchParams.get("url"), "https://cdn.example/brand/*");
  assert.equal(calls[0][1].method, "POST");
  assert.equal(calls[0][1].headers.AccessKey, "acct");
  assert.equal(await purgeBrand({ pull: "cdn.example" }, "", fetchImpl, (l) => logs.push(l)), false);
  assert.equal(calls.length, 1);
  assert.match(logs.at(-1), /not purged: MEDIA_ACCOUNT_API_KEY is not set/);
  const refused = async () => ({ ok: false, status: 401 });
  await assert.rejects(purgeBrand({ pull: "cdn.example" }, "acct", refused, () => {}), /purge of brand\/\* failed: HTTP 401/);
});
