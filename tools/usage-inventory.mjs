#!/usr/bin/env node
// tools/usage-inventory.mjs — who uses what of @krizaka/ui and @krizaka/motion (krizaka-ui#837, ADR-008).
// Every exported entry (package.json `exports`, plus the native-only components of the registry) with its importers in
// the live consumers, its size against its size-limit budget, its tests, stories, last change, category, status and
// the domain ADR-008 gives it; then a proposed verdict (keep · merge · retire · leave-core · ask) from the data.
// Read-only: it reads checkouts, prints nothing of a consumer but the counts of its imports of @krizaka/*.
//
//   node tools/usage-inventory.mjs           # regenerates docs/inventory/ui-usage.{json,md} PINNED: the consumers at the commits
//                                            # the committed inventory records, its date, its sizes: same inputs, same output
//   node tools/usage-inventory.mjs --latest  # moves the pins: consumers at their main, today's date (the weekly workflow)
//   node tools/usage-inventory.mjs --check   # no checkout: the registry against the committed inventory, and the inventory
//                                            # regenerated from its own facts (a hand edit fails) (CI)
//   node tools/usage-inventory.mjs --budgets [--update]   # the per-domain size ratchet (packages/ui/size-budgets.json)
//   node tools/usage-inventory.mjs --latest --keep-local   # CI: also keeps the local-only consumer (the cockpit) from the committed file, and refuses a partial result
//
// No path comes from the command line. Each consumer is read from the inventory's own clone cache
// (~/.cache/krizaka-inventory/<repo>), fetched at the exact commit the committed inventory records (or at main with
// --latest): never from the codegraph index, which sits on any branch and moves every 30 minutes. A consumer found nowhere
// is recorded as `absent`. Sizes are measured from packages/ui/dist (`pnpm --filter @krizaka/ui build`, or the published
// tarball's dist unpacked there); without a dist, or in a shallow checkout, the committed sizes and dates are carried over.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { gzipSync } from "node:zlib";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const HOME = homedir();
const CACHE = join(HOME, ".cache/krizaka-inventory");
/** git at a fixed path: no lookup through PATH. */
const GIT = "/usr/bin/git";

/** Live consumers (kind: product · site · tool). `ui-site` = ui.krizaka.com's own chrome (examples are not counted). */
export const CONSUMERS = [
  { name: "yomizaka", kind: "product", repo: "yomizaka" },
  { name: "akinaza", kind: "product", repo: "akinaza" },
  { name: "orazaka-web-client", kind: "product", repo: "orazaka-web-client" },
  { name: "krizaka-com", kind: "site", repo: "krizaka-com" },
  { name: "blog", kind: "site", repo: "krizaka-blog" },
  { name: "ui-site", kind: "site", local: join(ROOT, "apps/site") },
  { name: "java-site", kind: "site", repo: "krizaka-build", sub: "site" },
  { name: "ts-site", kind: "site", repo: "krizaka-ts", sub: "site" },
  { name: "motion-lab", kind: "site", repo: "krizaka-lab" },
  // private, on the founder's machine only: read for import names, never cloned
  { name: "cockpit", kind: "tool", local: join(HOME, "Documents/krizaka/tools/cockpit-next") },
];
/** Products that left the organisation (2026-10-29): none is read any more. */
const PAUSED_NAMES = new Set([]);
/** No paused product is counted apart any more. */
export const PAUSED = [...PAUSED_NAMES].map((name) => ({ name, kind: "paused", repo: name }));

/** Where a consumer is read from: its fixed local folder, else the inventory's own clone (never the codegraph index: any branch, any hour). */
export function locate(c, roots = [CACHE]) {
  if (c.local) return c.local;
  const found = join(roots[0], c.repo);
  return c.sub ? join(found, c.sub) : found;
}

/** The commit (full sha) each remote consumer had in the committed inventory: the pin the next run reads. */
export function pinnedHeads(list, prior) {
  const shas = new Map((prior?.consumers ?? []).filter((c) => c.sha).map((c) => [c.name, c.sha]));
  return Object.fromEntries(list.filter((c) => c.repo && shas.has(c.name)).map((c) => [c.name, shas.get(c.name)]));
}

const git = (cwd, ...args) => execFileSync(GIT, args, { cwd, stdio: ["ignore", "ignore", "inherit"] });

/** Puts each remote consumer in the inventory's cache at its pinned commit (main when not pinned, or with --latest). Fixed names, fixed URLs. */
function cloneAt(list, pins) {
  mkdirSync(CACHE, { recursive: true });
  for (const c of list) {
    if (c.local) continue;
    const dir = join(CACHE, c.repo);
    const want = pins[c.name] ?? "main";
    if (!existsSync(join(dir, ".git"))) {
      mkdirSync(dir, { recursive: true });
      git(dir, "init", "--quiet");
      git(dir, "remote", "add", "origin", `https://github.com/krizaka/${c.repo}.git`);
    }
    if (want.length === 40 && gitHead(dir, 40) === want) continue;
    git(dir, "fetch", "--quiet", "--depth", "1", "origin", want);
    git(dir, "checkout", "--quiet", "--force", "FETCH_HEAD");
  }
}
/** Consumers whose use alone does not keep an entry: the motion lab only shows things off. */
export const SHOWCASE = new Set(["motion-lab"]);

/**
 * The functional domains (ADR-008 §3). An entry's domain is its override, else its registry category's default.
 * `cahier` is the sites' register (ADR-004): it never ships to a product.
 */
export const DOMAINS = {
  foundations: "Foundations",
  forms: "Forms",
  "data-display": "Data display",
  "navigation-shell": "Navigation & shell",
  feedback: "Feedback & overlays",
  maps: "Geolocation & maps",
  media: "Media",
  commerce: "Commerce",
  identity: "Identity & people",
  conversation: "Conversation & AI",
  "page-blocks": "Page blocks & templates",
  cahier: "Cahier (sites register)",
};
const DOMAIN_ORDER = Object.keys(DOMAINS);
const CATEGORY_DOMAIN = {
  foundations: "foundations",
  actions: "foundations",
  forms: "forms",
  "data-display": "data-display",
  navigation: "navigation-shell",
  layouts: "navigation-shell",
  layout: "navigation-shell",
  overlays: "feedback",
  feedback: "feedback",
  media: "media",
  blocks: "page-blocks",
  templates: "page-blocks",
};
const DOMAIN_OVERRIDES = {
  foundations: [".", "cn", "slot", "theme", "recipes", "sites", "motion", "motion.css", "tailwind.css", "router", "text-style",
    "card", "badge", "chip", "chip-link", "chip-row", "kbd", "separator", "skeleton", "spinner", "loader", "skip-link", "mascots", "marks", "native:txt"],
  forms: ["native/form"],
  "data-display": ["native/list"],
  "navigation-shell": ["native", "nav-bar", "language-switch", "language-switch/server", "site-footer", "page-header"],
  feedback: ["confirm-button"],
  maps: ["map", "native/map"],
  media: ["waveform", "retro-tv", "photo-grid", "native/vertical-video", "native/video-player", "native/media-capture", "native/media-picker"],
  commerce: ["money-input", "price-catalogue-editor", "promo-code-field", "shop", "shop-composer", "shop-gallery", "service-card", "slot-picker",
    "agenda", "opening-hours", "reviews", "pricing-page", "kind-config-editor", "usage", "quota-meter"],
  identity: ["avatar", "avatar/defaults", "profile-card", "account-menu", "account-settings", "verified-badge", "notification-preferences", "auth-layout", "captcha", "achievement"],
  conversation: ["chat", "genui", "proposal", "analysis-report", "markdown", "native/markdown", "engine-flow", "next-actions"],
  "page-blocks": ["blocks.css", "story.css", "marketing-layout", "docs-layout", "docs-nav", "toc", "page-index", "section-backdrop", "glow-card", "number-ticker", "marquee"],
  cahier: ["site-cahier", "doodle", "taped-photo", "stuck", "footnote", "specimen-tag", "bird-plate", "anatomy-plate", "chapter", "margin-layout", "grade-stamp", "speed-lines", "versus-card", "flock", "mascot-quote", "signature", "elephant"],
};
const OVERRIDE = new Map(Object.entries(DOMAIN_OVERRIDES).flatMap(([d, names]) => names.map((n) => [n, d])));
const byText = (a, b) => a.localeCompare(b);

export function domainOf(name, category, parentCategory = null) {
  const own = OVERRIDE.get(name) ?? CATEGORY_DOMAIN[category];
  if (own) return own;
  if (!name.includes("/") || name.startsWith("native/")) return null;
  return OVERRIDE.get(name.split("/")[0]) ?? CATEGORY_DOMAIN[parentCategory] ?? null;
}

const SKIP_DIRS = new Set(["node_modules", ".next", "dist", "build", ".git", "coverage", ".turbo", "out", "storybook-static", ".expo", "android", "ios", ".vercel", ".codegraph", "__screenshots__"]);
const SOURCE_EXT = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs", ".mts", ".cts", ".css", ".mdx"]);
const isSource = (name) => !name.endsWith(".d.ts") && SOURCE_EXT.has(name.slice(name.lastIndexOf(".")));

/** Every source file under `dir`, skipping build output and dependencies. */
export function walk(dir, files = []) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const e of entries) {
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) walk(join(dir, e.name), files);
    } else if (isSource(e.name)) files.push(join(dir, e.name));
  }
  return files;
}

const SPECIFIER = /["'](@krizaka\/(?:ui|motion)[^"'\s]*)["']/g;
/** What may stand right before a specifier for it to be an import (spaces removed). */
const IMPORT_CONTEXT = ["from", "import", "import(", "require(", "mock(", "url("];
const NAMED = /import\s+(?:type\s+)?\{([^}]*)\}\s*from\s*["'](@krizaka\/[\w/-]+)["']/g;

function namesOf(list) {
  const names = [];
  for (const part of list.split(",")) {
    const words = part.trim().split(/\s+/);
    const name = words[0] === "type" ? words[1] : words[0];
    if (name) names.push(name);
  }
  return names;
}

/** The @krizaka/ui and @krizaka/motion specifiers a source imports, and the names it takes from the barrels. */
export function parseImports(source) {
  const specifiers = new Set();
  for (const m of source.matchAll(SPECIFIER)) {
    const before = source.slice(Math.max(0, m.index - 24), m.index).replace(/\s/g, "");
    if (IMPORT_CONTEXT.some((w) => before.endsWith(w))) specifiers.add(m[1]);
  }
  const names = [];
  for (const m of source.matchAll(NAMED)) {
    if (m[2] === "@krizaka/ui" || m[2] === "@krizaka/ui/native" || m[2] === "@krizaka/motion") {
      for (const name of namesOf(m[1])) names.push({ from: m[2], name });
    }
  }
  return { specifiers: [...specifiers], names };
}

/** The entry an import specifier resolves to: the longest `exports` key it matches (`@krizaka/ui/button` → `button`). */
export function entryOf(specifier, keys) {
  const pkg = specifier.startsWith("@krizaka/motion") ? "motion" : "ui";
  const sub = specifier.replace(/^@krizaka\/(?:ui|motion)/, "");
  const key = sub ? `.${sub}` : ".";
  const name = key === "." ? "." : key.slice(2);
  if (keys.has(key)) return { pkg, entry: name };
  const wildcards = [...keys].filter((k) => k.endsWith("/*")).sort((a, b) => b.length - a.length);
  const hit = wildcards.find((k) => key.startsWith(k.slice(0, -1)));
  if (hit) return { pkg, entry: hit.slice(2) };
  return { pkg, entry: name, unknown: true };
}

function between(text, start, open, close) {
  const at = text.indexOf(start);
  if (at < 0) return null;
  const from = text.indexOf(open, at);
  if (from < 0) return null;
  const to = text.indexOf(close, from);
  return to < 0 ? null : text.slice(from + 1, to);
}

/** What a meta.ts says, read as text (the file is data; no compiler needed). */
export function readMeta(text) {
  const str = (field) => new RegExp(`^ {2}${field}: "([^"]*)"`, "m").exec(text)?.[1] ?? null;
  const deprecation = between(text, "\n  deprecated: {", "{", "}");
  const nativeBlock = text.indexOf("\n  native: {");
  const nativeImports = nativeBlock < 0 ? null : between(text.slice(nativeBlock), "imports:", "[", "]");
  return {
    title: str("title"),
    status: str("status"),
    category: str("category"),
    domain: str("domain"),
    adoption: str("adoption"),
    platforms: str("platforms"),
    deprecatedUse: deprecation ? (/\buse: "([^"]+)"/.exec(deprecation)?.[1] ?? null) : null,
    nativeImports: nativeImports ? [...nativeImports.matchAll(/"([^"]+)"/g)].map((m) => m[1]) : [],
  };
}

const LIVE_REPOS = new Set([...CONSUMERS.map((c) => c.repo).filter(Boolean), "krizaka-ui", "orazaka-mobile-client"]);

/** The decisions ADR-006 (appendix A) already took: `merge` rows (target) and the issues that keep an entry. */
export function readPriorAudit(text) {
  const merges = new Map();
  const issues = new Map();
  for (const line of text.split("\n")) {
    const cells = line.split("|").map((c) => c.trim());
    const entry = /^`([^`]+)`$/.exec(cells[1] ?? "")?.[1];
    const decided = /^\*\*(keep|merge|deprecate)\*\*/.exec(cells[4] ?? "")?.[1];
    if (!entry || !decided) continue;
    const reason = cells[5] ?? "";
    if (decided === "merge") merges.set(entry, /into ([\w-]+)/.exec(reason)?.[1] ?? null);
    // Only an issue of a repository that is still in the organisation keeps an entry (the repositories that left are not read).
    const issue = /\b([\w-]+#\d+)/.exec(reason)?.[1];
    if (issue && LIVE_REPOS.has(issue.split("#")[0])) issues.set(entry, issue);
  }
  return { merges, issues };
}

const CHUNK_IMPORT = /(?:from|import) ?"\.\/([\w./-]+\.js)"/g;

/** The gzip size of a dist entry and every chunk it pulls in (the package's own code; dependencies excluded). */
export function closureSize(dist, file, cache = new Map()) {
  if (!existsSync(join(dist, file))) return null;
  const seen = new Set();
  const stack = [file];
  let bytes = 0;
  while (stack.length) {
    const f = stack.pop();
    if (seen.has(f) || !existsSync(join(dist, f))) continue;
    seen.add(f);
    if (!cache.has(f)) {
      const text = readFileSync(join(dist, f), "utf8");
      cache.set(f, { gz: gzipSync(text).length, deps: [...text.matchAll(CHUNK_IMPORT)].map((m) => m[1]) });
    }
    const { gz, deps } = cache.get(f);
    bytes += gz;
    stack.push(...deps);
  }
  return bytes;
}

const UNIT = { B: 1, kB: 1000, KB: 1024, MB: 1e6 };
/** « 8 kB » to bytes: the digits first, then the unit. Parsed by hand (a regex here backtracks, Sonar S8786). */
export const parseLimit = (s) => {
  const text = String(s).trim();
  let end = 0;
  while (end < text.length && ((text[end] >= "0" && text[end] <= "9") || text[end] === ".")) end += 1;
  const amount = Number(text.slice(0, end));
  const unit = text.slice(end).trimStart().split(/\s/, 1)[0];
  return end > 0 && Number.isFinite(amount) && Object.hasOwn(UNIT, unit) ? Math.round(amount * UNIT[unit]) : null;
};

/** The size-limit budget of an entry: the row whose name is `./<entry>` (optionally followed by a comment). */
export function budgets(sizeLimit) {
  const map = new Map();
  for (const row of sizeLimit ?? []) {
    const key = String(row.name).split(" ")[0];
    const entry = key === "." ? "." : key.replace(/^\.\//, "");
    map.set(entry, (map.get(entry) ?? 0) + (parseLimit(row.limit) ?? 0));
  }
  return map;
}

const stripExt = (name) => {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(0, dot) : name;
};

/** The last change and the first commit (YYYY-MM-DD) of each top item under `dir` of this repository, in one git pass. */
function history(dir) {
  const last = new Map();
  const first = new Map();
  let log = "";
  try {
    log = execFileSync(GIT, ["log", "--format=@%cs", "--name-only", "--", dir], { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 28, stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return { last, first };
  }
  let date = null;
  for (const line of log.split("\n")) {
    if (line.startsWith("@")) date = line.slice(1);
    else if (line.startsWith(dir + "/")) {
      const rest = line.slice(dir.length + 1);
      const top = rest.includes("/") ? rest.split("/")[0] : stripExt(rest);
      if (!last.has(top)) last.set(top, date);
      first.set(top, date); // newest first: the last date seen is the first commit
    }
  }
  return { last, first };
}

/** The short commit a checkout is on, read from its .git (no subprocess). */
export function gitHead(path, length = 8) {
  let top = resolve(path);
  while (!existsSync(join(top, ".git")) && dirname(top) !== top) top = dirname(top);
  try {
    let gitDir = join(top, ".git");
    if (statSync(gitDir).isFile()) gitDir = resolve(top, readFileSync(gitDir, "utf8").replace("gitdir:", "").trim());
    const head = readFileSync(join(gitDir, "HEAD"), "utf8").trim();
    if (!head.startsWith("ref: ")) return head.slice(0, length);
    const ref = head.slice(5);
    const common = existsSync(join(gitDir, "commondir")) ? resolve(gitDir, readFileSync(join(gitDir, "commondir"), "utf8").trim()) : gitDir;
    const loose = [join(gitDir, ref), join(common, ref)].find(existsSync);
    if (loose) return readFileSync(loose, "utf8").trim().slice(0, length);
    const packed = readFileSync(join(common, "packed-refs"), "utf8").split("\n").find((l) => l.endsWith(` ${ref}`));
    return packed ? packed.slice(0, length) : null;
  } catch {
    return null;
  }
}

const sum = (values) => values.reduce((a, b) => a + b, 0);

/** Importer files of an entry outside the showcase, web and native together. */
function realUse(e) {
  const web = sum(Object.entries(e.importers).filter(([n]) => !SHOWCASE.has(n)).map(([, c]) => c));
  const native = sum(Object.entries(e.nativeUse ?? {}).filter(([n]) => !SHOWCASE.has(n) && !PAUSED_NAMES.has(n)).map(([, c]) => c));
  return web + native;
}

function unusedVerdict(e, newDays, today) {
  if (e.paused > 0) return { verdict: "leave-core", why: `used only by paused products (${e.pausedBy.join(", ")})` };
  if (e.live > 0) return { verdict: "ask", why: "used only by the motion lab" };
  if (e.domain === "cahier") return { verdict: "ask", why: "unused, Cahier register (sites)" };
  const age = e.created ? (Date.parse(today) - Date.parse(e.created)) / 864e5 : Infinity;
  if (age <= newDays) return { verdict: "ask", why: `unused, new (${e.created}): its adoption issue?` };
  return { verdict: "retire", why: "no live importer, no paused importer, no filed need, no kept entry built on it" };
}

/**
 * The proposed verdict of an entry, from its facts (ADR-008 §2), given the entries already kept (`kept`): « built on »
 * keeps an entry only when the entry built on it is itself kept (ADR-006 §7 rule c).
 */
export function verdict(e, { kept = new Set(), usedSubs = new Set(), decisions = new Map(), newDays = 10, today = new Date().toISOString().slice(0, 10) } = {}) {
  if (e.mergeInto) return { verdict: "merge", into: e.mergeInto, why: "ADR-006 merge (#675), or deprecated in favour of another entry" };
  if (e.status === "deprecated") return { verdict: "retire", why: "already deprecated (#674), removed in 4.0" };
  const real = realUse(e);
  if (real > 0) return { verdict: "keep", why: `${real} live importer file(s)` };
  const decided = decisions.get(e.name);
  if (decided) return { verdict: decided.verdict, why: decided.why };
  const keptBy = e.builtOnBy.filter((d) => kept.has(d));
  if (keptBy.length) return { verdict: "keep", why: `built on by ${keptBy.slice(0, 3).join(", ")}${keptBy.length > 3 ? "…" : ""}` };
  if (e.issue) return { verdict: "keep", why: `filed need ${e.issue}` };
  if (usedSubs.has(e.name)) return { verdict: "keep", why: "a sub-entry of it is imported" };
  return unusedVerdict(e, newDays, today);
}

/** Verdicts for all rows: the kept set grows until nothing changes (an entry kept by use keeps what it is built on). */
export function decideAll(rows, opts = {}) {
  const usedSubs = new Set(rows.filter((r) => r.name.includes("/") && realUse(r) > 0).map((r) => r.name.split("/")[0]));
  let kept = new Set();
  let out = rows;
  for (let i = 0; i < 10; i++) {
    out = rows.map((r) => ({ ...r, ...verdict(r, { ...opts, kept, usedSubs }) }));
    const next = new Set(out.filter((r) => r.verdict === "keep" && r.kind === "entry").map((r) => r.name.split("/")[0]));
    const stable = next.size === kept.size && [...next].every((n) => kept.has(n));
    kept = next;
    if (stable) break;
  }
  return out;
}

const bump = (map, key, by = 1) => map.set(key, (map.get(key) ?? 0) + by);

/** Counts one source file's imports: each entry (and each barrel name) once per file. */
function tally(text, keys, motionKeys, scan) {
  const { specifiers, names } = parseImports(text);
  const ids = new Set(specifiers.map((s) => {
    const { pkg, entry } = entryOf(s, s.startsWith("@krizaka/motion") ? motionKeys : keys);
    return `${pkg}:${entry}`;
  }));
  for (const id of ids) bump(scan.entries, id);
  for (const id of new Set(names.map(({ from, name }) => `${from}#${name}`))) bump(scan.names, id);
}

/** Consumers that exist only on the founder's machine: a CI run keeps their last counts from the committed inventory. */
export const LOCAL_ONLY = new Set(["cockpit"]);

/**
 * The scan of a local-only consumer, rebuilt from the committed inventory (its import counts per entry, its file count),
 * so the weekly refresh does not erase what it cannot read. Names taken from the native barrel are not restored: the
 * cockpit takes none.
 */
export function restoredScan(c, prior) {
  const entries = new Map();
  for (const e of prior.entries) if (e.importers?.[c.name] > 0) entries.set(`ui:${e.name}`, e.importers[c.name]);
  const was = prior.consumers.find((p) => p.name === c.name);
  return { ...c, absent: was?.absent ?? false, head: was?.head ?? null, sha: was?.sha ?? null, files: was?.files ?? 0, entries, names: new Map() };
}

function scanConsumer(c, keys, motionKeys, prior = null, restoreLocal = false) {
  const scan = { ...c, absent: !existsSync(c.path), files: 0, entries: new Map(), names: new Map() };
  if (prior && LOCAL_ONLY.has(c.name) && (scan.absent || restoreLocal)) return restoredScan(c, prior);
  if (scan.absent) return scan;
  const files = walk(c.path).filter((f) => !f.includes(join("registry", "examples")));
  for (const f of files) {
    const text = readFileSync(f, "utf8");
    if (text.includes("@krizaka/")) tally(text, keys, motionKeys, scan);
  }
  // This repository's own site (`local` inside it) has no pin: its commit is the one being committed.
  const inRepo = c.local?.startsWith(ROOT);
  return { ...scan, head: inRepo ? null : gitHead(c.path), sha: inRepo ? null : gitHead(c.path, 40), files: files.length };
}

const RELATIVE_IMPORT = /from ["']\.\.\/(?:\.\.\/)?([\w-]+)/g;
const OWN_ENTRY_IMPORT = /from ["']@krizaka\/ui\/([\w-]+)["']/g;

/** Which src/<dir> of the package imports which other src/<dir> (relative imports, or its own entries): « built on ». */
function internalDeps(srcDir, dirs, entryNames) {
  const dependents = new Map();
  const known = new Set([...dirs, ...entryNames]);
  const add = (target, d) => {
    if (target === d || !known.has(target)) return;
    if (!dependents.has(target)) dependents.set(target, new Set());
    dependents.get(target).add(d);
  };
  for (const d of dirs) {
    for (const f of walk(join(srcDir, d)).filter((p) => !/\.(?:test|stories)\./.test(p))) {
      const text = readFileSync(f, "utf8");
      for (const m of text.matchAll(RELATIVE_IMPORT)) add(m[1], d);
      for (const m of text.matchAll(OWN_ENTRY_IMPORT)) add(m[1], d);
    }
  }
  return dependents;
}

/** Files of a scan that take one of `names` from @krizaka/ui/native. */
function nativeCount(scan, names) {
  let n = 0;
  for (const [id, c] of scan.names) {
    const [from, name] = id.split("#");
    if (from === "@krizaka/ui/native" && names.has(name)) n += c;
  }
  return n;
}

function entryRow(key, srcDir) {
  const name = key === "." ? "." : key.slice(2);
  const dir = name.split("/")[0].replace(/\.css$/, "");
  const metaPath = name === "cn" ? join(srcDir, "cn.meta.ts") : join(srcDir, dir, "meta.ts");
  const meta = existsSync(metaPath) ? readMeta(readFileSync(metaPath, "utf8")) : {};
  const sub = name.includes("/");
  return { name, dir, meta: sub ? {} : meta, parentCategory: sub ? (meta.category ?? null) : null, kind: name.endsWith(".css") ? "css" : "entry" };
}

/** The rows: every export key (wildcard registry keys aside), then the native-only components of the registry. */
function collectRows(keys, srcDir) {
  const rows = [...keys].filter((k) => !k.includes("*") && k !== "./package.json").map((k) => entryRow(k, srcDir));
  const nativeMetaDir = join(srcDir, "native/meta");
  const nativeFiles = existsSync(nativeMetaDir) ? readdirSync(nativeMetaDir) : [];
  for (const f of nativeFiles) {
    rows.push({ name: `native:${basename(f, ".ts")}`, dir: "native", meta: readMeta(readFileSync(join(nativeMetaDir, f), "utf8")), kind: "native-only" });
  }
  return rows;
}

/** Per scan, the files that take this web+native component's names from @krizaka/ui/native. */
function nativeUseOf(r, scans) {
  const nativeUse = {};
  if (r.kind !== "entry" || !r.meta.nativeImports?.length) return nativeUse;
  const names = new Set(r.meta.nativeImports);
  for (const scan of scans) {
    const n = nativeCount(scan, names);
    if (n) nativeUse[scan.name] = n;
  }
  return nativeUse;
}

/** Importers of a row across the scans: per consumer, the total, and which paused products use it. */
function usage(r, consumers, paused) {
  const names = new Set(r.meta.nativeImports ?? []);
  const count = r.kind === "native-only" ? (scan) => nativeCount(scan, names) : (scan) => scan.entries.get(`ui:${r.name}`) ?? 0;
  const importers = Object.fromEntries(consumers.map((scan) => [scan.name, count(scan)]).filter(([, n]) => n > 0));
  const pausedBy = paused.filter((scan) => count(scan) > 0).map((scan) => scan.name);
  const nativeUse = nativeUseOf(r, [...consumers, ...paused]);
  const liveNative = sum(Object.entries(nativeUse).filter(([n]) => !PAUSED_NAMES.has(n)).map(([, c]) => c));
  return { importers, nativeUse, live: sum(Object.values(importers)) + liveNative, paused: sum(paused.map(count)), pausedBy };
}

/** Tests and stories of an entry's folder (null where the entry has no folder of its own). */
function coverage(r, ctx) {
  if (r.kind !== "entry" || r.dir === "native" || !ctx.dirs.includes(r.dir)) return { tests: null, stories: null };
  const flat = (s) => s.toLowerCase().replace(/[^a-z\d]/g, "");
  const tests = walk(join(ctx.srcDir, r.dir)).filter((f) => f.includes(".test.")).length;
  const stories = ctx.storyFiles.filter((f) => f.includes(`/src/${r.dir}/`) || flat(basename(f).split(".")[0]) === flat(r.dir)).length;
  return { tests, stories };
}

function describe(r, ctx) {
  const native = r.kind === "native-only";
  const histKey = native ? r.name.slice(7) : r.dir;
  const hist = native ? ctx.nativeHistory : ctx.history;
  const file = r.name === "." ? "index.js" : `${r.name}.js`;
  return {
    pkg: "ui",
    name: r.name,
    kind: r.kind,
    title: r.meta.title ?? null,
    category: r.meta.category ?? null,
    status: r.meta.status ?? null,
    // The registry says it (`domain` in meta.ts, ADR-008 §3); a sub-entry takes its parent's.
    domain: r.meta.domain ?? domainOf(r.name, r.meta.category, r.parentCategory),
    adoption: r.meta.adoption ?? null,
    ...usage(r, ctx.consumers, ctx.paused),
    builtOnBy: [...(ctx.deps.get(r.dir) ?? [])].filter((d) => d !== "test").sort(byText),
    issue: ctx.prior.issues.get(r.name) ?? null,
    mergeInto: ctx.prior.merges.get(r.name) ?? r.meta.deprecatedUse ?? null,
    sizeGzip: ctx.hasDist && r.kind === "entry" ? closureSize(ctx.dist, file, ctx.cache) : null,
    budget: ctx.budget.get(r.name) ?? null,
    ...coverage(r, ctx),
    lastChange: hist.last.get(histKey) ?? null,
    created: hist.first.get(histKey) ?? null,
  };
}

/** Krizaka Motion: its entries, their exported names and their importers outside the lab. */
function motionRows(motionDir, motionPkg, scans) {
  if (!motionPkg) return [];
  return Object.keys(motionPkg.exports ?? {}).map((k) => {
    const entry = k === "." ? "." : k.slice(2);
    const importers = {};
    for (const scan of scans) {
      const n = scan.name === "motion-lab" ? 0 : (scan.entries.get(`motion:${entry}`) ?? 0);
      if (n) importers[scan.name] = n;
    }
    const indexFile = join(motionDir, "src", entry === "." ? "index.ts" : `${entry}/index.ts`);
    const text = existsSync(indexFile) ? readFileSync(indexFile, "utf8") : "";
    const names = [];
    for (const m of text.matchAll(/export \{([^}]*)\}/g)) names.push(...namesOf(m[1]));
    for (const m of text.matchAll(/export (?:const|function|class) (\w+)/g)) names.push(m[1]);
    for (const m of text.matchAll(/export \* from "([^"]+)"/g)) names.push(`* ${m[1]}`);
    return { pkg: "motion", name: entry, exports: names, importers, live: sum(Object.values(importers)), private: motionPkg.private === true };
  });
}

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));

/** The decisions the data cannot derive (docs/inventory/decisions.json): entry name to { verdict, why }. */
export function readDecisions(root = ROOT) {
  const file = join(root, "docs/inventory/decisions.json");
  return new Map(Object.entries(existsSync(file) ? readJson(file).entries : {}));
}

/**
 * What this checkout cannot measure is carried over from the committed row instead of being zeroed: the sizes without a
 * built dist, the dates of the last change and of the first commit in a shallow clone. Otherwise two machines would
 * write two inventories from the same inputs.
 */
export function carryFacts(row, was, { hasDist, shallow }) {
  if (!was) return row;
  return {
    ...row,
    ...(hasDist ? {} : { sizeGzip: was.sizeGzip ?? null }),
    ...(shallow ? { lastChange: was.lastChange ?? null, created: was.created ?? null } : {}),
  };
}

const isShallow = () => {
  try {
    return execFileSync(GIT, ["rev-parse", "--is-shallow-repository"], { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim() === "true";
  } catch {
    return true;
  }
};

export function buildInventory(opts) {
  const uiDir = join(ROOT, "packages/ui");
  const pkg = readJson(join(uiDir, "package.json"));
  const keys = new Set(Object.keys(pkg.exports));
  const motionPkg = opts.motion && existsSync(join(opts.motion, "package.json")) ? readJson(join(opts.motion, "package.json")) : null;
  const motionKeys = new Set(Object.keys(motionPkg?.exports ?? { ".": 1 }));
  const srcDir = join(uiDir, "src");
  const dirs = readdirSync(srcDir).filter((d) => statSync(join(srcDir, d)).isDirectory());
  const adr006 = join(ROOT, "docs/adr/ADR-006-krizaka-ui-2027.md");
  const dist = join(uiDir, "dist");
  const consumers = opts.consumers.map((c) => scanConsumer(c, keys, motionKeys, opts.prior, opts.restoreLocal));
  const paused = opts.paused.map((c) => scanConsumer(c, keys, motionKeys));
  const ctx = {
    srcDir,
    dirs,
    consumers,
    paused,
    prior: existsSync(adr006) ? readPriorAudit(readFileSync(adr006, "utf8")) : { merges: new Map(), issues: new Map() },
    history: history("packages/ui/src"),
    nativeHistory: history("packages/ui/src/native/meta"),
    budget: budgets(pkg["size-limit"]),
    dist,
    hasDist: existsSync(dist),
    cache: new Map(),
    deps: internalDeps(srcDir, dirs, [...keys].map((k) => k.slice(2))),
    storyFiles: [...walk(srcDir), ...walk(join(ROOT, "apps/storybook/src"))].filter((f) => f.includes(".stories.")),
  };
  const today = opts.today ?? opts.prior?.generated ?? new Date().toISOString().slice(0, 10);
  const was = new Map((opts.prior?.entries ?? []).map((e) => [e.name, e]));
  const shallow = isShallow();
  const carried = (row) => carryFacts(row, was.get(row.name), { hasDist: ctx.hasDist, shallow });
  const head = (c) => ({ name: c.name, kind: c.kind, absent: c.absent, head: c.head ?? null, sha: c.sha ?? null, files: c.files });
  return {
    generated: today,
    package: { name: pkg.name, version: pkg.version, distMeasured: ctx.hasDist ? `packages/ui/dist (@krizaka/ui@${pkg.version})` : (opts.prior?.package?.distMeasured ?? null) },
    consumers: consumers.map(head),
    paused: paused.map(head),
    entries: decideAll(collectRows(keys, srcDir).map((r) => carried(describe(r, ctx))), { today, decisions: readDecisions() }),
    motion: motionRows(opts.motion, motionPkg, [...consumers, ...paused]),
  };
}

const NOT_KEPT = new Set(["retire", "merge", "leave-core"]);

export function summarise(inv) {
  const verdicts = {};
  const domains = {};
  const keptByDomain = {};
  for (const e of inv.entries) {
    verdicts[e.verdict] = (verdicts[e.verdict] ?? 0) + 1;
    const d = e.domain ?? "none";
    domains[d] = (domains[d] ?? 0) + 1;
    if (NOT_KEPT.has(e.verdict)) continue;
    keptByDomain[d] ??= { entries: 0, gzip: 0, budget: 0 };
    keptByDomain[d].entries += 1;
    keptByDomain[d].gzip += e.sizeGzip ?? 0;
    keptByDomain[d].budget += e.budget ?? 0;
  }
  return { verdicts, domains, keptByDomain };
}

const kb = (b) => (b == null ? "—" : (b / 1000).toFixed(1));
const SHORT = { yomizaka: "Yo", akinaza: "Ak", "orazaka-web-client": "Oz", "krizaka-com": "www", blog: "blog", "ui-site": "ui", "java-site": "java", "ts-site": "ts", "motion-lab": "motion", cockpit: "cockpit" };
const counts = (obj) => Object.entries(obj ?? {}).map(([k, v]) => `${SHORT[k] ?? k} ${v}`).join(" ");
const listOf = (obj) => Object.entries(obj).map(([k, v]) => k + " " + v).join(" · ");
const consumerLabel = (c) => (c.absent ? `${c.name} (absent)` : `${c.name} ${c.head ?? ""}`.trim());

function entryLine(e) {
  const nativeCounts = counts(e.nativeUse);
  const used = (counts(e.importers) || "—") + (nativeCounts ? ` (native: ${nativeCounts})` : "");
  const verdictCell = `**${e.verdict}**` + (e.into ? ` → \`${e.into}\`` : "");
  const cells = [
    `\`${e.name}\``,
    DOMAINS[e.domain] ?? "**none**",
    e.status ?? "—",
    used,
    e.pausedBy.join(", ") || "—",
    e.builtOnBy.length || "—",
    `${kb(e.sizeGzip)} / ${kb(e.budget)}`,
    e.tests ?? "—",
    e.stories ?? "—",
    e.lastChange ?? "—",
    verdictCell,
    e.why,
  ];
  return `| ${cells.join(" | ")} |`;
}

export function toMarkdown(inv) {
  const s = summarise(inv);
  const domainRows = Object.entries(s.keptByDomain)
    .sort(([a], [b]) => DOMAIN_ORDER.indexOf(a) - DOMAIN_ORDER.indexOf(b))
    .map(([d, v]) => `| ${DOMAINS[d] ?? d} | ${v.entries} | ${kb(v.gzip)} | ${kb(v.budget)} |`);
  const rows = [...inv.entries].sort((a, b) => DOMAIN_ORDER.indexOf(a.domain) - DOMAIN_ORDER.indexOf(b.domain) || a.name.localeCompare(b.name));
  const lines = [
    `# @krizaka/ui usage inventory — ${inv.generated}`,
    "",
    "Generated by `pnpm inventory:usage` (krizaka-ui#837, ADR-008). Do not edit by hand.",
    `Package: ${inv.package.name}@${inv.package.version}; sizes measured from ${inv.package.distMeasured ?? "no dist (sizes not measured)"}.`,
    "",
    `Consumers: ${inv.consumers.map(consumerLabel).join(" · ")}.`,
    `Paused (counted apart): ${inv.paused.map(consumerLabel).join(" · ")}.`,
    "",
    `Verdicts: ${listOf(s.verdicts)}.`,
    "",
    "Sizes: the gzip of an entry's own file and every chunk it pulls in (shared chunks are counted in each entry, so a sum",
    "over-counts); the budget is the entry's size-limit row in packages/ui/package.json (size-limit measures differently: compare",
    "an entry with itself over time, not with its budget).",
    "",
    "| Domain | Entries not retired | gzip sum (kB) | size-limit budgets sum (kB) |",
    "| :-- | --: | --: | --: |",
    ...domainRows,
    "",
    "| Entry | Domain | Status | Live importers (files) | Paused | Built on by | gzip kB / budget | Tests | Stories | Last change | Verdict | Why |",
    "| :-- | :-- | :-- | :-- | :-- | --: | :-- | --: | --: | :-- | :-- | :-- |",
    ...rows.map(entryLine),
  ];
  if (inv.motion.length) {
    lines.push("", "## @krizaka/motion (the lab)", "", "| Entry | Exports | Importers outside the lab |", "| :-- | :-- | :-- |");
    for (const m of inv.motion) lines.push(`| \`${m.name}\` | ${m.exports.join(", ") || "—"} | ${counts(m.importers) || "—"} |`);
  }
  return lines.join("\n") + "\n";
}

/**
 * The guards that need no consumer checkout (ADR-008 §8.2.2), on the committed inventory and the registry's own rows.
 * Returns the problems as sentences; an empty list is a pass.
 */
export function checkInventory({ inventory, rows }) {
  const known = new Map(inventory.entries.map((e) => [e.name, e]));
  const problems = rows.flatMap((r) => rowProblems(r, known.get(r.name)));
  const live = new Set(rows.map((r) => r.name));
  for (const e of inventory.entries) {
    if (!live.has(e.name)) problems.push(`${e.name}: in docs/inventory/ui-usage.json but no longer in the package (run \`pnpm inventory:usage\`)`);
    if (e.verdict === "keep" && e.status === "deprecated") problems.push(`${e.name}: a \`keep\` row that is deprecated`);
  }
  return problems;
}

/**
 * The inventory regenerated from its own facts (ADR-008 §8.2.2, « generated data is never hand-edited »): the verdicts,
 * the reasons and the live counts are recomputed from the committed importers, status, budget and dates; the markdown is
 * rendered again from the json. Any difference is a hand edit (or a generator change not regenerated).
 */
export function rederive({ inventory, markdown, decisions = new Map() }) {
  const problems = [];
  const bare = inventory.entries.map(({ verdict: _v, into: _i, why: _w, ...facts }) => facts);
  const again = new Map(decideAll(bare, { today: inventory.generated, decisions }).map((e) => [e.name, e]));
  for (const e of inventory.entries) {
    const r = again.get(e.name);
    if (e.verdict !== r.verdict || (e.into ?? null) !== (r.into ?? null) || e.why !== r.why) {
      problems.push(`${e.name}: verdict \`${e.verdict}\` (${e.why}), regenerated \`${r.verdict}\` (${r.why}): never hand-edit docs/inventory, run \`pnpm inventory:usage\``);
    }
    const live = sum(Object.values(e.importers)) + sum(Object.entries(e.nativeUse ?? {}).filter(([n]) => !PAUSED_NAMES.has(n)).map(([, c]) => c));
    if (e.live !== live) problems.push(`${e.name}: live importers ${e.live}, its own importers add up to ${live}: never hand-edit docs/inventory`);
  }
  if (markdown !== toMarkdown(inventory)) problems.push("docs/inventory/ui-usage.md is not what the json renders: never hand-edit it, run `pnpm inventory:usage`");
  return problems;
}

const STATIC_FACTS = ["domain", "status", "category", "title", "adoption", "builtOnBy", "issue", "mergeInto", "budget", "tests", "stories"];

/** The facts of the registry itself (no consumer, no dist, no git history), recomputed and compared with the committed rows. */
function staticProblems(inventory) {
  const uiDir = join(ROOT, "packages/ui");
  const pkg = readJson(join(uiDir, "package.json"));
  const keys = new Set(Object.keys(pkg.exports));
  const srcDir = join(uiDir, "src");
  const dirs = readdirSync(srcDir).filter((d) => statSync(join(srcDir, d)).isDirectory());
  const adr006 = join(ROOT, "docs/adr/ADR-006-krizaka-ui-2027.md");
  const none = { last: new Map(), first: new Map() };
  const ctx = {
    srcDir, dirs, consumers: [], paused: [], history: none, nativeHistory: none, dist: "", hasDist: false, cache: new Map(),
    prior: existsSync(adr006) ? readPriorAudit(readFileSync(adr006, "utf8")) : { merges: new Map(), issues: new Map() },
    budget: budgets(pkg["size-limit"]),
    deps: internalDeps(srcDir, dirs, [...keys].map((k) => k.slice(2))),
    storyFiles: [...walk(srcDir), ...walk(join(ROOT, "apps/storybook/src"))].filter((f) => f.includes(".stories.")),
  };
  const fresh = new Map(collectRows(keys, srcDir).map((r) => describe(r, ctx)).map((e) => [e.name, e]));
  const problems = [];
  for (const e of inventory.entries) {
    const f = fresh.get(e.name);
    if (!f) continue; // reported by checkInventory
    for (const k of STATIC_FACTS) {
      if (JSON.stringify(e[k] ?? null) !== JSON.stringify(f[k] ?? null)) problems.push(`${e.name}: \`${k}\` is ${JSON.stringify(e[k] ?? null)} in docs/inventory, ${JSON.stringify(f[k] ?? null)} in the package: never hand-edit it, run \`pnpm inventory:usage\``);
    }
  }
  return problems;
}

/** The domain and adoption rules of one registry row against its inventory row (undefined when the row is new). */
function rowProblems(r, row) {
  const { domain, adoption, status, title } = r.meta;
  const experimental = status === "experimental";
  const problems = [];
  const hasOwnMeta = r.kind === "entry" && !r.name.includes("/") && !r.name.endsWith(".css") && r.name !== "." && title;
  if (hasOwnMeta && !domain) problems.push(`${r.name}: no \`domain\` in its meta.ts`);
  if (domain && !(domain in DOMAINS)) problems.push(`${r.name}: \`${domain}\` is not one of the twelve domains`);
  if (experimental && !/^[\w.-]+#\d+$/.test(adoption ?? "")) problems.push(`${r.name}: experimental, so it names its first consumer's issue (\`adoption: "<repo>#<n>"\`)`);
  if (!experimental && adoption) problems.push(`${r.name}: only an experimental entry has an \`adoption\` issue`);
  if (!row && !(experimental && adoption)) problems.push(`${r.name}: missing from docs/inventory/ui-usage.json (run \`pnpm inventory:usage\`), unless it is experimental with an adoption issue`);
  if (row && domain && row.domain !== domain) problems.push(`${r.name}: the inventory says \`${row.domain}\`, its meta.ts says \`${domain}\` (run \`pnpm inventory:usage\`)`);
  return problems;
}

const BUDGETS_FILE = "packages/ui/size-budgets.json";

/**
 * The size budget of each domain (ADR-008 §5): the sum of the size-limit rows of its entries that stay (verdict keep or
 * ask; an entry not in the inventory yet counts, so a new one has to fit). Bytes.
 */
export function domainBudgets({ rows, inventory, sizeLimit }) {
  const verdicts = new Map(inventory.entries.map((e) => [e.name, e.verdict]));
  const domains = new Map(rows.map((r) => [r.name, r.meta.domain ?? domainOf(r.name, r.meta.category, r.parentCategory)]));
  const out = Object.fromEntries(Object.keys(DOMAINS).map((d) => [d, 0]));
  for (const [entry, bytes] of budgets(sizeLimit)) {
    const domain = domains.get(entry);
    const verdict = verdicts.get(entry);
    if (!domain || verdict === "retire" || verdict === "merge" || verdict === "leave-core") continue;
    out[domain] += bytes;
  }
  return out;
}

/** The ratchet: a domain over its frozen budget fails; a domain below it asks for the budget to be lowered. */
export function checkBudgets({ current, frozen }) {
  const problems = [];
  for (const [domain, bytes] of Object.entries(current)) {
    const limit = frozen[domain];
    if (limit === undefined) problems.push(`${domain}: no frozen budget (run \`node tools/usage-inventory.mjs --budgets --update\`)`);
    else if (bytes > limit) problems.push(`${domain}: size-limit rows add up to ${kbOf(bytes)} kB, over its frozen budget of ${kbOf(limit)} kB: shrink something in the domain, or an ADR raises the budget (never silently)`);
    else if (bytes < limit) problems.push(`${domain}: ${kbOf(bytes)} kB, under its frozen ${kbOf(limit)} kB: lock the gain with \`node tools/usage-inventory.mjs --budgets --update\``);
  }
  return problems;
}
const kbOf = (bytes) => (bytes / 1000).toFixed(1);

/** `--update` only ever lowers a budget; a domain without one is recorded at its current sum. */
export function lowerBudgets({ current, frozen }) {
  return Object.fromEntries(Object.entries(current).map(([d, bytes]) => [d, frozen[d] === undefined ? bytes : Math.min(bytes, frozen[d])]));
}

function budgetsCommand(update) {
  const pkg = readJson(join(ROOT, "packages/ui/package.json"));
  const rows = collectRows(new Set(Object.keys(pkg.exports)), join(ROOT, "packages/ui/src"));
  const inventory = readJson(join(ROOT, "docs/inventory/ui-usage.json"));
  const current = domainBudgets({ rows, inventory, sizeLimit: pkg["size-limit"] });
  const file = join(ROOT, BUDGETS_FILE);
  const frozen = existsSync(file) ? readJson(file).domains : {};
  if (update) {
    writeFileSync(file, JSON.stringify({ unit: "bytes", note: "ADR-008 §5: only goes down. node tools/usage-inventory.mjs --budgets --update", domains: lowerBudgets({ current, frozen }) }, null, 2) + "\n");
    process.stdout.write(`${BUDGETS_FILE} written\n`);
    return;
  }
  const problems = checkBudgets({ current, frozen });
  if (problems.length) {
    process.stderr.write(`domain size budgets: ${problems.length} problem(s)\n${problems.map((p) => `  - ${p}`).join("\n")}\n`);
    process.exit(1);
  }
  process.stdout.write(`domain size budgets: ${Object.keys(current).length} domains within ${BUDGETS_FILE}\n`);
}

function check() {
  const pkg = readJson(join(ROOT, "packages/ui/package.json"));
  const rows = collectRows(new Set(Object.keys(pkg.exports)), join(ROOT, "packages/ui/src"));
  const inventory = readJson(join(ROOT, "docs/inventory/ui-usage.json"));
  const markdown = readFileSync(join(ROOT, "docs/inventory/ui-usage.md"), "utf8");
  const problems = [...checkInventory({ inventory, rows }), ...rederive({ inventory, markdown, decisions: readDecisions() }), ...staticProblems(inventory)];
  if (problems.length) {
    const list = problems.map((p) => "  - " + p).join("\n");
    process.stderr.write(`usage inventory: ${problems.length} problem(s)\n${list}\n`);
    process.exit(1);
  }
  process.stdout.write(`usage inventory: ${rows.length} entries checked against docs/inventory/ui-usage.json\n`);
}

function main() {
  const { values } = parseArgs({ options: { latest: { type: "boolean" }, "keep-local": { type: "boolean" }, check: { type: "boolean" }, budgets: { type: "boolean" }, update: { type: "boolean" } } });
  if (values.budgets) return budgetsCommand(values.update);
  if (values.check) return check();
  const committed = join(ROOT, "docs/inventory/ui-usage.json");
  const prior = existsSync(committed) ? readJson(committed) : null;
  // Pinned unless --latest: the consumers at the commits the inventory records, its date, its carried sizes.
  cloneAt([...CONSUMERS, ...PAUSED], values.latest ? {} : pinnedHeads([...CONSUMERS, ...PAUSED], prior));
  const at = (c) => ({ ...c, path: locate(c) });
  const consumers = CONSUMERS.map(at);
  const inv = buildInventory({
    prior,
    today: values.latest ? new Date().toISOString().slice(0, 10) : undefined,
    restoreLocal: values["keep-local"] || !values.latest,
    consumers,
    paused: PAUSED.map(at),
    motion: consumers.find((c) => c.name === "motion-lab").path,
  });
  const missing = [...inv.consumers, ...inv.paused].filter((c) => c.absent).map((c) => c.name);
  if (values["keep-local"] && missing.length) {
    process.stderr.write(`usage inventory: not readable here: ${missing.join(", ")}: refusing to write a partial inventory\n`);
    process.exit(1);
  }
  const out = join(ROOT, "docs/inventory");
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, "ui-usage.json"), JSON.stringify(inv, null, 2) + "\n");
  writeFileSync(join(out, "ui-usage.md"), toMarkdown(inv));
  const verdicts = summarise(inv).verdicts;
  process.stdout.write(`docs/inventory/ui-usage.{json,md}: ${inv.entries.length} entries, ${listOf(verdicts)}\n`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
