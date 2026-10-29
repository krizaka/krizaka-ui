// The usage inventory (krizaka-ui#837, ADR-008): parsing, resolution, sizes and the verdict rules, on fixtures.
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { CONSUMERS, PAUSED, carryFacts, pinnedHeads, rederive, readDecisions, budgets, checkBudgets, checkInventory, closureSize, decideAll, domainBudgets, domainOf, entryOf, gitHead, locate, lowerBudgets, parseImports, restoredScan, toMarkdown, parseLimit, readMeta, readPriorAudit, verdict, walk } from "./usage-inventory.mjs";

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
  assert.equal(verdict(row({ paused: 3, pausedBy: ["a-product"] }), { today }).verdict, "leave-core");
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

test("locate: a fixed local folder, else the inventory's own cache (never the codegraph index, which sits on any commit), with the site's sub-folder", () => {
  const cache = mkdtempSync(join(tmpdir(), "inv-cache-"));
  assert.equal(locate({ local: "/fixed" }, [cache]), "/fixed");
  assert.equal(locate({ repo: "krizaka-ts", sub: "site" }, [cache]), join(cache, "krizaka-ts", "site"));
  assert.doesNotMatch(locate({ repo: "akinaza" }), /krizaka-index/);
});

test("pinnedHeads: the commit each consumer had in the committed inventory is the one the next run reads", () => {
  const prior = { consumers: [{ name: "akinaza", sha: "a".repeat(40) }, { name: "blog", sha: null }, { name: "krizaka-com", sha: "b".repeat(40) }] };
  const list = [{ name: "akinaza", repo: "akinaza" }, { name: "blog", repo: "krizaka-blog" }, { name: "ui-site", local: "/x" }];
  assert.deepEqual(pinnedHeads(list, prior), { akinaza: "a".repeat(40) });
  assert.deepEqual(pinnedHeads(list, null), {}, "no committed inventory: nothing pinned, the clone takes main");
});

test("carryFacts: what this checkout cannot measure (no dist, shallow history) is carried from the committed row, never zeroed", () => {
  const row = { name: "button", sizeGzip: null, lastChange: "2026-10-29", created: "2026-10-29" };
  const was = { name: "button", sizeGzip: 1200, lastChange: "2026-09-01", created: "2026-01-02" };
  assert.deepEqual(carryFacts(row, was, { hasDist: false, shallow: true }), { name: "button", sizeGzip: 1200, lastChange: "2026-09-01", created: "2026-01-02" });
  assert.deepEqual(carryFacts({ ...row, sizeGzip: 900 }, was, { hasDist: true, shallow: false }), { ...row, sizeGzip: 900 });
  assert.deepEqual(carryFacts(row, undefined, { hasDist: false, shallow: true }), row, "a new entry has nothing to carry");
});

test("rederive: the committed inventory is regenerated from its own facts, and a hand edit of a verdict, a reason or the markdown is caught", () => {
  const entry = (name, importers, extra = {}) => ({ pkg: "ui", name, kind: "entry", title: null, category: null, status: "stable", domain: "forms", adoption: null, importers, nativeUse: {}, live: Object.values(importers).reduce((a, b) => a + b, 0), paused: 0, pausedBy: [], builtOnBy: [], issue: null, mergeInto: null, sizeGzip: 100, budget: 200, tests: 1, stories: 1, lastChange: "2026-10-01", created: "2026-01-01", ...extra });
  const base = { generated: "2026-10-28", package: { name: "@krizaka/ui", version: "1", distMeasured: null }, consumers: [], paused: [], motion: [] };
  const entries = decideAll([entry("button", { akinaza: 4 }), entry("gone", {})], { today: base.generated });
  const inventory = { ...base, entries };
  const markdown = toMarkdown(inventory);
  assert.deepEqual(rederive({ inventory, markdown }), []);
  const edited = { ...inventory, entries: entries.map((e) => (e.name === "gone" ? { ...e, verdict: "keep", why: "hand edit" } : e)) };
  assert.match(rederive({ inventory: edited, markdown: toMarkdown(edited) }).join("\n"), /gone: verdict `keep`.*regenerated `retire`/);
  assert.match(rederive({ inventory, markdown: markdown.replace("button", "buttons") }).join("\n"), /ui-usage\.md is not what the json renders/);
  const moved = { ...inventory, entries: entries.map((e) => (e.name === "button" ? { ...e, live: 99 } : e)) };
  assert.match(rederive({ inventory: moved, markdown: toMarkdown(moved) }).join("\n"), /button: live importers 99.*4/);
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

test("checkInventory fails an entry without a domain, a wrong domain, an experimental one without its adoption issue, and a missing row", () => {
  const entry = (name, domain, extra = {}) => ({ name, kind: "entry", domain, verdict: "keep", status: "beta", ...extra });
  const row = (name, meta, kind = "entry") => ({ name, kind, meta: { title: name, ...meta } });
  const inventory = { entries: [entry("button", "foundations"), entry("tabs", "navigation-shell")] };
  const ok = [row("button", { domain: "foundations", status: "stable" }), row("tabs", { domain: "navigation-shell", status: "beta" })];
  assert.deepEqual(checkInventory({ inventory, rows: ok }), []);

  const bad = checkInventory({
    inventory,
    rows: [
      row("button", { status: "stable" }),
      row("tabs", { domain: "forms", status: "beta" }),
      row("novel", { domain: "forms", status: "experimental" }),
      row("odd", { domain: "widgets", status: "beta", adoption: "akinaza#1" }),
    ],
  });
  const text = bad.join("\n");
  assert.match(text, /button: no `domain`/);
  assert.match(text, /tabs: the inventory says `navigation-shell`, its meta.ts says `forms`/);
  assert.match(text, /novel: experimental, so it names its first consumer's issue/);
  assert.match(text, /odd: `widgets` is not one of the twelve domains/);
  assert.match(text, /odd: only an experimental entry has an `adoption` issue/);
});

test("checkInventory lets an experimental entry with its adoption issue be new, and flags a row whose entry is gone", () => {
  const inventory = { entries: [{ name: "gone", kind: "entry", domain: "forms", verdict: "keep", status: "beta" }] };
  const rows = [{ name: "fresh", kind: "entry", meta: { title: "Fresh", domain: "forms", status: "experimental", adoption: "akinaza#9" } }];
  const text = checkInventory({ inventory, rows }).join("\n");
  assert.doesNotMatch(text, /fresh/);
  assert.match(text, /gone: in docs\/inventory\/ui-usage.json but no longer in the package/);
});

test("parseLimit reads the number and the unit without a regex, and refuses the rest", () => {
  assert.equal(parseLimit("8 kB"), 8000);
  assert.equal(parseLimit("12.5 kB"), 12500);
  assert.equal(parseLimit("900 B"), 900);
  assert.equal(parseLimit("2KB"), 2048);
  assert.equal(parseLimit("1 MB"), 1e6);
  assert.equal(parseLimit("kB"), null);
  assert.equal(parseLimit("8 parsecs"), null);
  assert.equal(parseLimit(undefined), null);
});

test("domainBudgets sums the size-limit rows of the entries that stay, per domain", () => {
  const row = (name, domain) => ({ name, kind: "entry", meta: { domain, category: "actions" } });
  const rows = [row("button", "foundations"), row("card", "foundations"), row("old", "foundations"), row("field", "forms"), row("fresh", "forms")];
  const inventory = { entries: [{ name: "button", verdict: "keep" }, { name: "card", verdict: "ask" }, { name: "old", verdict: "retire" }, { name: "field", verdict: "keep" }] };
  const sizeLimit = [
    { name: "./button", limit: "2 kB" },
    { name: "./card (with a note)", limit: "3 kB" },
    { name: "./old", limit: "9 kB" },
    { name: "./field", limit: "4 kB" },
    { name: "./fresh", limit: "1 kB" },
  ];
  const sums = domainBudgets({ rows, inventory, sizeLimit });
  assert.equal(sums.foundations, 5000);
  assert.equal(sums.forms, 5000, "a new entry counts: it has to fit");
  assert.equal(sums.cahier, 0);
});

test("checkBudgets is a ratchet: over the frozen budget fails, below asks to lock the gain, never raised", () => {
  const frozen = { forms: 5000, media: 1000 };
  assert.deepEqual(checkBudgets({ current: { forms: 5000, media: 1000 }, frozen }), []);
  assert.match(checkBudgets({ current: { forms: 5100, media: 1000 }, frozen }).join(), /forms: .* over its frozen budget/);
  assert.match(checkBudgets({ current: { forms: 4000, media: 1000 }, frozen }).join(), /forms: .* lock the gain/);
  assert.match(checkBudgets({ current: { maps: 10 }, frozen }).join(), /maps: no frozen budget/);
  assert.deepEqual(lowerBudgets({ current: { forms: 6000, media: 500, maps: 10 }, frozen }), { forms: 5000, media: 500, maps: 10 });
});

test("restoredScan rebuilds a local-only consumer's counts from the committed inventory", () => {
  const prior = {
    consumers: [{ name: "cockpit", absent: false, head: null, files: 90 }],
    entries: [{ name: "tree-view", importers: { cockpit: 3, akinaza: 1 } }, { name: "button", importers: { akinaza: 9 } }, { name: "tag-input", importers: { cockpit: 1 } }],
  };
  const scan = restoredScan({ name: "cockpit", kind: "tool" }, prior);
  assert.equal(scan.files, 90);
  assert.equal(scan.absent, false);
  assert.deepEqual([...scan.entries], [["ui:tree-view", 3], ["ui:tag-input", 1]]);
});

test("the weekly workflow scopes its read token to the consumers it clones (zizmor: no token for every repository of the owner)", () => {
  const yml = readFileSync(new URL("../.github/workflows/usage-inventory.yml", import.meta.url), "utf8");
  const scoped = new Set(yml.match(/repositories: \|-\n((?: {12}[\w-]+\n)+)/)?.[1].split("\n").map((l) => l.trim()).filter(Boolean));
  const wanted = [...CONSUMERS, ...PAUSED].filter((c) => c.repo).map((c) => c.repo);
  assert.deepEqual(wanted.filter((r) => !scoped.has(r)), []);
});

test("a decision (docs/inventory/decisions.json) sets the verdict of an unused entry; a live importer wins over it", () => {
  const base = { name: "marquee", status: "stable", importers: {}, nativeUse: {}, pausedBy: [], paused: 0, live: 0, builtOnBy: [], issue: null, mergeInto: null, created: "2026-01-01", domain: "page-blocks" };
  const decisions = new Map([["marquee", { verdict: "leave-core", why: "leaves for the lab" }]]);
  assert.deepEqual(verdict(base, { decisions, today: "2026-10-29" }), { verdict: "leave-core", why: "leaves for the lab" });
  assert.equal(verdict({ ...base, importers: { akinaza: 2 }, live: 2 }, { decisions, today: "2026-10-29" }).verdict, "keep");
  assert.equal(verdict(base, { today: "2026-10-29" }).verdict, "retire", "without the decision the data alone says retire");
});

test("the committed inventory is exactly what its own facts regenerate (no hand edit), and the weekly run moves the pins", () => {
  const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
  const inventory = JSON.parse(read("docs/inventory/ui-usage.json"));
  assert.deepEqual(rederive({ inventory, markdown: read("docs/inventory/ui-usage.md"), decisions: readDecisions() }), []);
  assert.match(read(".github/workflows/usage-inventory.yml"), /usage-inventory\.mjs --latest --keep-local/);
  assert.match(read(".github/workflows/usage-inventory.yml"), /fetch-depth: 0/);
});
