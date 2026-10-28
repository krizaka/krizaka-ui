// The usage inventory (krizaka-ui#837, ADR-008): parsing, resolution, sizes and the verdict rules, on fixtures.
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { budgets, closureSize, decideAll, domainOf, entryOf, gitHead, locate, parseImports, readMeta, readPriorAudit, verdict, walk } from "./usage-inventory.mjs";

test("parseImports finds every @krizaka/ui and @krizaka/motion specifier, and the names taken from the barrels", () => {
  const src = [
    'import { Button } from "@krizaka/ui/button";',
    'import "@krizaka/ui/blocks.css";',
    '@import "@krizaka/ui/motion.css";',
    'const Map = dynamic(() => import("@krizaka/ui/map"));',
    'vi.mock("@krizaka/ui/router", () => ({}));',
    'import { Screen, type Txt, Card as C } from "@krizaka/ui/native";',
    'import { orbit } from "@krizaka/motion/core";',
    'const s = "@krizaka/ui/not-an-import";',
  ].join("\n");
  const { specifiers, names } = parseImports(src);
  assert.deepEqual(specifiers.sort(), ["@krizaka/motion/core", "@krizaka/ui/blocks.css", "@krizaka/ui/button", "@krizaka/ui/map", "@krizaka/ui/motion.css", "@krizaka/ui/native", "@krizaka/ui/router"]);
  assert.deepEqual(names.filter((n) => n.from === "@krizaka/ui/native").map((n) => n.name), ["Screen", "Txt", "Card"]);
});

test("entryOf resolves a specifier to its export key, wildcards included, and flags an unknown one", () => {
  const keys = new Set([".", "./button", "./shop", "./shop/hero", "./registry/*"]);
  assert.deepEqual(entryOf("@krizaka/ui", keys), { pkg: "ui", entry: "." });
  assert.deepEqual(entryOf("@krizaka/ui/shop/hero", keys), { pkg: "ui", entry: "shop/hero" });
  assert.deepEqual(entryOf("@krizaka/ui/registry/button.json", keys), { pkg: "ui", entry: "registry/*" });
  assert.equal(entryOf("@krizaka/ui/gone", keys).unknown, true);
  assert.equal(entryOf("@krizaka/motion/core", new Set(["./core"])).pkg, "motion");
});

test("readMeta reads the registry fields as text", () => {
  const meta = readMeta(`export const meta = {\n  title: "Tabs",\n  status: "deprecated",\n  deprecated: { since: "3.55.0", removedIn: "4.0.0", use: "list", reason: "x" },\n  category: "navigation",\n  platforms: "both",\n  native: {\n    imports: ["Tabs", "TabBar"],\n  },\n};`);
  assert.equal(meta.title, "Tabs");
  assert.equal(meta.status, "deprecated");
  assert.equal(meta.category, "navigation");
  assert.equal(meta.deprecatedUse, "list");
  assert.deepEqual(meta.nativeImports, ["Tabs", "TabBar"]);
});

test("readPriorAudit takes ADR-006's merges and the issues that keep an entry", () => {
  const { merges, issues } = readPriorAudit([
    "| `chip-row` | — | — | **merge** (#675) | into chip (`Chip.Group`) |",
    "| `glossary-term` | — | — | **keep** | keep: akinaza#260 |",
    "| `button` | Oz 76 | www 8 | **keep** | keep: products |",
  ].join("\n"));
  assert.equal(merges.get("chip-row"), "chip");
  assert.equal(issues.get("glossary-term"), "akinaza#260");
  assert.equal(issues.has("button"), false);
});

test("domainOf: an override first, then the category, then the parent entry", () => {
  assert.equal(domainOf("map", "data-display"), "maps");
  assert.equal(domainOf("field", "forms"), "forms");
  assert.equal(domainOf("shop/hero", null, "blocks"), "commerce");
  assert.equal(domainOf("doodle", "blocks"), "cahier");
  assert.equal(domainOf("nav-bar", "navigation"), "navigation-shell");
  assert.equal(domainOf("mystery", null), null);
});

test("closureSize sums the gzip of an entry and the chunks it imports, once each", () => {
  const dist = mkdtempSync(join(tmpdir(), "inv-dist-"));
  writeFileSync(join(dist, "a.js"), 'import "./chunk-1.js";\nimport { x } from "./chunk-2.js";\nexport { x };');
  writeFileSync(join(dist, "chunk-1.js"), 'import "./chunk-2.js";\nconsole.log(1);');
  writeFileSync(join(dist, "chunk-2.js"), "export const x = 2;");
  const size = closureSize(dist, "a.js");
  assert.ok(size > 0);
  assert.equal(closureSize(dist, "missing.js"), null);
  const one = closureSize(dist, "chunk-2.js");
  assert.ok(size > one, "the closure counts more than one chunk");
});

test("budgets reads size-limit rows by entry, comments after the name ignored", () => {
  const b = budgets([{ name: ".", limit: "8 kB" }, { name: "./native (a guard)", limit: "75 kB" }, { name: "./button", limit: "3.5 kB" }]);
  assert.equal(b.get("."), 8000);
  assert.equal(b.get("native"), 75000);
  assert.equal(b.get("button"), 3500);
});

const row = (over) => ({ name: "x", kind: "entry", status: "beta", domain: "forms", importers: {}, nativeUse: {}, live: 0, paused: 0, pausedBy: [], builtOnBy: [], issue: null, mergeInto: null, created: "2026-01-01", ...over });

test("verdict: use keeps, a merge or a deprecation wins, paused-only leaves the core, new or Cahier asks, the rest retires", () => {
  const today = "2026-10-28";
  assert.equal(verdict(row({ importers: { yomizaka: 2 }, live: 2 }), { today }).verdict, "keep");
  assert.equal(verdict(row({ importers: { yomizaka: 2 }, live: 2, mergeInto: "chip" }), { today }).verdict, "merge");
  assert.equal(verdict(row({ status: "deprecated" }), { today }).verdict, "retire");
  assert.equal(verdict(row({ paused: 3, pausedBy: ["orochia"] }), { today }).verdict, "leave-core");
  assert.equal(verdict(row({ issue: "akinaza#260" }), { today }).verdict, "keep");
  assert.equal(verdict(row({ created: "2026-10-25" }), { today }).verdict, "ask");
  assert.equal(verdict(row({ domain: "cahier" }), { today }).verdict, "ask");
  assert.equal(verdict(row({ importers: { "motion-lab": 1 }, live: 1 }), { today }).verdict, "ask", "the lab alone keeps nothing");
  assert.equal(verdict(row({}), { today }).verdict, "retire");
});

test("decideAll: « built on » keeps an entry only when what is built on it is kept", () => {
  const today = "2026-10-28";
  const rows = [
    row({ name: "card", importers: { akinaza: 4 }, live: 4 }),
    row({ name: "slot", builtOnBy: ["card"] }),
    row({ name: "glyph", builtOnBy: ["gone"] }),
    row({ name: "gone", status: "deprecated" }),
  ];
  const v = Object.fromEntries(decideAll(rows, { today }).map((r) => [r.name, r.verdict]));
  assert.deepEqual(v, { card: "keep", slot: "keep", glyph: "retire", gone: "retire" });
  const subs = decideAll([row({ name: "text-style" }), row({ name: "text-style/server", importers: { akinaza: 3 }, live: 3, mergeInto: "text-style" })], { today });
  assert.equal(subs[0].verdict, "keep", "a parent whose sub-entry is imported is used");
});

test("walk skips dependencies and build output", () => {
  const dir = mkdtempSync(join(tmpdir(), "inv-walk-"));
  for (const d of ["src", "node_modules/x", ".next/server", "dist"]) mkdirSync(join(dir, d), { recursive: true });
  writeFileSync(join(dir, "src/a.tsx"), "");
  writeFileSync(join(dir, "src/a.d.ts"), "");
  writeFileSync(join(dir, "node_modules/x/b.js"), "");
  writeFileSync(join(dir, ".next/server/c.js"), "");
  writeFileSync(join(dir, "dist/d.js"), "");
  assert.deepEqual(walk(dir).map((f) => f.slice(dir.length)), ["/src/a.tsx"]);
});

test("locate: a fixed local folder, else the index clone, else the inventory's cache, with the site's sub-folder", () => {
  const index = mkdtempSync(join(tmpdir(), "inv-index-"));
  const cache = mkdtempSync(join(tmpdir(), "inv-cache-"));
  mkdirSync(join(index, "akinaza"));
  assert.equal(locate({ local: "/fixed" }, [index, cache]), "/fixed");
  assert.equal(locate({ repo: "akinaza" }, [index, cache]), join(index, "akinaza"));
  assert.equal(locate({ repo: "krizaka-ts", sub: "site" }, [index, cache]), join(cache, "krizaka-ts", "site"));
});

test("gitHead reads the commit from .git without running git (loose ref, packed ref, detached)", () => {
  const repo = mkdtempSync(join(tmpdir(), "inv-git-"));
  mkdirSync(join(repo, ".git/refs/heads"), { recursive: true });
  writeFileSync(join(repo, ".git/HEAD"), "ref: refs/heads/main\n");
  writeFileSync(join(repo, ".git/refs/heads/main"), "0123456789abcdef\n");
  assert.equal(gitHead(repo), "01234567");
  writeFileSync(join(repo, ".git/HEAD"), "ref: refs/heads/other\n");
  writeFileSync(join(repo, ".git/packed-refs"), "# pack-refs\nfedcba9876543210 refs/heads/other\n");
  assert.equal(gitHead(repo), "fedcba98");
  writeFileSync(join(repo, ".git/HEAD"), "aaaaaaaabbbb\n");
  assert.equal(gitHead(repo), "aaaaaaaa");
  mkdirSync(join(repo, "site"));
  assert.equal(gitHead(join(repo, "site")), "aaaaaaaa", "a folder of a checkout reads the checkout's commit");
  assert.equal(gitHead(mkdtempSync(join(tmpdir(), "inv-nogit-"))), null);
});
