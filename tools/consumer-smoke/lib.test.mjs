// node --test tools/ — the consumer smoke's pure part, on a registry written to a temporary folder.
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";

import { CONSUMERS, ENTRY_POINTS, EXAMPLE_DEPS, examplesOf, missingEntries, NATIVE_PEERS, nativeApp, PACKAGES, parseArgs, parseSpec, summaryMarkdown, webPages } from "./lib.mjs";

const tree = (files) => {
  const dir = mkdtempSync(join(tmpdir(), "kz-consumer-smoke-"));
  for (const [name, content] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, name)), { recursive: true });
    writeFileSync(join(dir, name), typeof content === "string" ? content : JSON.stringify(content));
  }
  return dir;
};

const example = (component, name, native = false) => ({
  name,
  path: `examples/${component}/${native ? "native/" : ""}${name}.tsx`,
  module: `@krizaka/ui/registry/examples/${component}/${native ? "native/" : ""}${name}`,
});

const registry = () =>
  tree({
    "registry/index.json": { name: "ui", version: "9.9.9", items: [{ name: "button" }, { name: "badge" }] },
    "registry/button.json": {
      name: "button",
      title: "Button",
      web: { examples: [example("button", "primary"), example("button", "gone")] },
      native: { examples: [example("button", "primary", true)] },
    },
    "registry/badge.json": { name: "badge", title: "Badge <new>", web: { examples: [example("badge", "dot")] } },
    "registry/examples/button/primary.js": "export default () => null;",
    "registry/examples/button/native/primary.js": "export default () => null;",
    "registry/examples/badge/dot.js": "export default () => null;",
  });

describe("packages", () => {
  it("lists every package once, in the order the consumers name them", () => {
    assert.equal(new Set(PACKAGES).size, PACKAGES.length);
    for (const list of Object.values(CONSUMERS)) for (const pkg of list) assert.ok(PACKAGES.includes(pkg));
  });
});

describe("examplesOf", () => {
  it("returns the examples whose compiled module the package ships, and reports the others", () => {
    const { found, missing } = examplesOf(registry(), "web");
    assert.deepEqual(found.map((e) => `${e.component}/${e.name}`), ["button/primary", "badge/dot"]);
    assert.deepEqual(missing.map((e) => e.module), ["@krizaka/ui/registry/examples/button/gone"]);
  });

  it("reads the native side on its own", () => {
    const { found, missing } = examplesOf(registry(), "native");
    assert.deepEqual(found.map((e) => e.module), ["@krizaka/ui/registry/examples/button/native/primary"]);
    assert.deepEqual(missing, []);
  });
});

describe("webPages", () => {
  it("writes one Server Component page per component, importing its published modules, and an index", () => {
    const pages = webPages("ui", examplesOf(registry(), "web").found);
    assert.deepEqual(pages.map((p) => p.path), ["app/ui/button/page.tsx", "app/ui/badge/page.tsx", "app/ui/page.tsx"]);
    const button = pages[0].source;
    assert.match(button, /import Example0 from "@krizaka\/ui\/registry\/examples\/button\/primary";/);
    assert.doesNotMatch(button, /"use client"/);
    assert.match(button, /<Example0 \/>/);
    assert.match(pages[1].source, /<h1>Badge \{"<"\}new\{">"\}<\/h1>/, "a title is text, never markup");
    assert.match(pages[2].source, /href="\/ui\/badge"/);
  });
});

describe("nativeApp", () => {
  it("renders every example inside the kit's ThemeProvider, with the fonts, tokens and icons of /native", () => {
    const source = nativeApp(examplesOf(registry(), "native").found);
    assert.match(source, /import Example0 from "@krizaka\/ui\/registry\/examples\/button\/native\/primary";/);
    assert.match(source, /<ThemeProvider defaultMode="dark">/);
    for (const entry of ["@krizaka/ui/native", "@krizaka/tokens/native", "@krizaka/icons/native", "@krizaka/fonts/native", "@krizaka/fonts/native/assets", "@krizaka/query", "@krizaka/query/persist"]) {
      assert.ok(source.includes(`from "${entry}"`), entry);
    }
  });
});

describe("arguments", () => {
  it("defaults to every consumer and reads --only, --dir, --keep and --expect", () => {
    assert.deepEqual(parseArgs([]).only, ["next", "expo", "node"]);
    const options = parseArgs(["--only", "next,node", "--dir", "/tmp/x", "--keep", "--expect", "@krizaka/ui@2.11.0"]);
    assert.deepEqual(options, { only: ["next", "node"], dir: "/tmp/x", keep: true, expect: [{ name: "@krizaka/ui", version: "2.11.0" }] });
  });

  it("refuses an unknown consumer, argument or tag", () => {
    assert.throws(() => parseArgs(["--only", "vite"]), /unknown consumer/);
    assert.throws(() => parseArgs(["--fast"]), /unknown argument/);
    assert.throws(() => parseSpec("ui@2"), /expected @krizaka/);
    assert.deepEqual(parseSpec("@krizaka/charts@0.3.0-beta.1"), { name: "@krizaka/charts", version: "0.3.0-beta.1" });
  });
});

describe("summaryMarkdown", () => {
  it("says pass or fail per consumer, each step, and every version tested", () => {
    const markdown = summaryMarkdown({
      date: "2026-10-12",
      versions: { "@krizaka/ui": "2.10.0", "next (next)": "16.4.0" },
      results: [
        { consumer: "next", ok: true, steps: [{ name: "next build", ok: true, note: "40s" }] },
        { consumer: "node", ok: false, steps: [{ name: "node smoke.mjs", ok: false }] },
      ],
    });
    assert.match(markdown, /\| next \| pass \| ✅ next build \(40s\) \|/);
    assert.match(markdown, /\| node \| \*\*fail\*\* \| ❌ node smoke\.mjs \|/);
    assert.match(markdown, /\| `@krizaka\/ui` \| 2\.10\.0 \|/);
  });
});

describe("entry points (PS2)", () => {
  it("lists the data table, the virtual lists and the native list, and FlashList among the native peers", () => {
    assert.deepEqual(ENTRY_POINTS.next, ["./data-table", "./virtual", "./form", "./form/server", "./date-picker", "./radio-group", "./slider", "./map", "./skip-link"]);
    assert.deepEqual(ENTRY_POINTS.expo, ["./native/list", "./native/form", "./native/map"]);
    assert.deepEqual(EXAMPLE_DEPS, ["zod@^4"]);
    assert.ok(NATIVE_PEERS.includes("@shopify/flash-list"));
    assert.ok(NATIVE_PEERS.includes("@maplibre/maplibre-react-native"));
  });

  it("finds an entry that is not exported, or whose file is missing", () => {
    const dir = tree({
      "package.json": { exports: { "./virtual": { types: "./dist/virtual.d.ts", import: "./dist/virtual.js" }, "./data-table": { import: "./dist/data-table.js" } } },
      "dist/virtual.d.ts": "",
      "dist/virtual.js": "",
    });
    assert.deepEqual(missingEntries(dir, ["./virtual", "./data-table", "./native/list"]), ["./data-table", "./native/list"]);
  });
});
