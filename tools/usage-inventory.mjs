#!/usr/bin/env node
// tools/usage-inventory.mjs — who uses what of @krizaka/ui and @krizaka/motion (krizaka-ui#837, ADR-008).
// Every exported entry (package.json `exports`, plus the native-only components of the registry) with its importers in
// the live consumers, its size against its size-limit budget, its tests, stories, last change, category, status and
// the domain ADR-008 gives it; then a proposed verdict (keep · merge · retire · leave-core · ask) from the data.
// Read-only: it reads checkouts, prints nothing of a consumer but the counts of its imports of @krizaka/*.
//
//   node tools/usage-inventory.mjs                       # markdown on stdout (default checkouts, see CONSUMERS)
//   node tools/usage-inventory.mjs --json                # JSON on stdout
//   node tools/usage-inventory.mjs --out docs/inventory  # writes ui-usage.json + ui-usage.md
//   node tools/usage-inventory.mjs --consumer blog=../krizaka-blog --paused orochia=../orochia --motion ../krizaka-motion
//   node tools/usage-inventory.mjs --dist /tmp/package/dist   # measure sizes from a built (or published) dist
//
// A consumer whose checkout is missing is recorded as `absent` (CI has none of them): rerun on a machine that has them.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { gzipSync } from "node:zlib";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const HOME = homedir();
const INDEX = join(HOME, ".krizaka-index");

/** Live consumers (kind: product · site · tool). `docs` = ui.krizaka.com's own chrome (examples are not counted). */
export const CONSUMERS = [
  { name: "yomizaka", kind: "product", path: join(INDEX, "yomizaka") },
  { name: "akinaza", kind: "product", path: join(INDEX, "akinaza") },
  { name: "orazaka-web-client", kind: "product", path: join(INDEX, "orazaka-web-client") },
  { name: "krizaka-com", kind: "site", path: join(INDEX, "krizaka-com") },
  { name: "blog", kind: "site", path: join(INDEX, "krizaka-blog") },
  { name: "ui-site", kind: "site", path: join(ROOT, "apps/site") },
  { name: "java-site", kind: "site", path: join(INDEX, "krizaka-build/site") },
  { name: "ts-site", kind: "site", path: join(INDEX, "krizaka-ts/site") },
  { name: "motion-lab", kind: "site", path: join(INDEX, "krizaka-motion") },
  { name: "cockpit", kind: "tool", path: join(HOME, "Documents/krizaka/tools/cockpit-next") },
];
/** Paused products (Orochia, Yasakia, Yororis, Kachizaka): counted apart, they keep nothing in the core. */
const PAUSED_NAMES = new Set(["orochia", "yasakia", "yororis", "kachizaka"]);
export const PAUSED = ["orochia", "yasakia", "yororis", "kachizaka"].map((name) => ({ name, kind: "paused", path: join(INDEX, name) }));

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
    "card", "badge", "chip", "chip-link", "chip-row", "kbd", "separator", "skeleton", "spinner", "loader", "skip-link", "iso", "mascots", "marks", "native:txt"],
  feedback: ["confirm-button"],
  maps: ["map", "native/map"],
  commerce: ["money-input", "price-catalogue-editor", "promo-code-field", "shop", "shop-composer", "shop-gallery", "service-card", "slot-picker",
    "agenda", "opening-hours", "reviews", "pricing-page", "kind-config-editor", "usage", "quota-meter"],
  identity: ["avatar", "avatar/defaults", "profile-card", "account-menu", "account-settings", "verified-badge", "notification-preferences", "auth-layout", "captcha", "achievement"],
  conversation: ["chat", "genui", "proposal", "analysis-report", "markdown", "native/markdown", "engine-flow", "next-actions"],
  "page-blocks": ["blocks.css", "story.css", "marketing-layout", "docs-layout", "docs-nav", "toc", "page-index", "site-footer", "nav-bar", "language-switch", "language-switch/server", "page-header", "section-backdrop", "glow-card", "number-ticker", "marquee"],
  cahier: ["site-cahier", "doodle", "taped-photo", "stuck", "footnote", "specimen-tag", "bird-plate", "anatomy-plate", "chapter", "margin-layout", "grade-stamp", "speed-lines", "versus-card", "flock", "mascot-quote", "signature", "elephant"],
  media: ["waveform", "retro-tv", "photo-grid", "native/vertical-video", "native/video-player", "native/media-capture", "native/media-picker"],
  forms: ["native/form"],
  "data-display": ["native/list"],
  "navigation-shell": ["native"],
};
// nav-bar / language-switch / site-footer are the family's shell: they move to navigation-shell, not page-blocks.
for (const n of ["nav-bar", "language-switch", "language-switch/server", "site-footer", "page-header"]) {
  DOMAIN_OVERRIDES["page-blocks"].splice(DOMAIN_OVERRIDES["page-blocks"].indexOf(n), 1);
  DOMAIN_OVERRIDES["navigation-shell"].push(n);
}
const OVERRIDE = new Map(Object.entries(DOMAIN_OVERRIDES).flatMap(([d, names]) => names.map((n) => [n, d])));

export function domainOf(name, category, parentCategory = null) {
  const parent = name.includes("/") && !name.startsWith("native/") ? name.split("/")[0] : null;
  return OVERRIDE.get(name) ?? CATEGORY_DOMAIN[category] ?? (parent ? (OVERRIDE.get(parent) ?? CATEGORY_DOMAIN[parentCategory]) : null) ?? null;
}

const SKIP_DIRS = new Set(["node_modules", ".next", "dist", "build", ".git", "coverage", ".turbo", "out", "storybook-static", ".expo", "android", "ios", ".vercel", ".codegraph", "__screenshots__"]);
const SOURCE = /\.(?:[cm]?[jt]sx?|css|mdx)$/;

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
    } else if (SOURCE.test(e.name) && !e.name.endsWith(".d.ts")) files.push(join(dir, e.name));
  }
  return files;
}

const IMPORT = /(?:\bfrom\s*|\bimport\s*\(?\s*|\brequire\s*\(\s*|@import\s+(?:url\(\s*)?|\bvi\.mock\s*\(\s*|\bjest\.mock\s*\(\s*)["'](@krizaka\/(?:ui|motion)(?:\/[^"'\s]*)?)["']/g;
const NAMED = /import\s+(?:type\s+)?\{([^}]*)\}\s*from\s*["'](@krizaka\/(?:ui|motion)(?:\/native)?)["']/g;

/** The @krizaka/ui and @krizaka/motion specifiers a source imports, and the names it takes from the barrels. */
export function parseImports(source) {
  const specifiers = new Set();
  for (const m of source.matchAll(IMPORT)) specifiers.add(m[1]);
  const names = [];
  for (const m of source.matchAll(NAMED)) {
    for (const part of m[1].split(",")) {
      const name = part.trim().replace(/^type\s+/, "").split(/\s+as\s+/)[0].trim();
      if (name) names.push({ from: m[2], name });
    }
  }
  return { specifiers: [...specifiers], names };
}

/** The entry an import specifier resolves to: the longest `exports` key it matches (`@krizaka/ui/button` → `button`). */
export function entryOf(specifier, keys) {
  const pkg = specifier.startsWith("@krizaka/motion") ? "motion" : "ui";
  const sub = specifier.replace(/^@krizaka\/(?:ui|motion)/, "") || "";
  const key = sub ? `.${sub}` : ".";
  if (keys.has(key)) return { pkg, entry: key === "." ? "." : key.slice(2) };
  for (const k of [...keys].filter((k) => k.endsWith("/*")).sort((a, b) => b.length - a.length)) {
    if (key.startsWith(k.slice(0, -1))) return { pkg, entry: k.slice(2) };
  }
  return { pkg, entry: key === "." ? "." : key.slice(2), unknown: true };
}

/** What a meta.ts says, read as text (the file is data; no compiler needed). */
export function readMeta(text) {
  const str = (field) => text.match(new RegExp(`^  ${field}: "([^"]*)"`, "m"))?.[1] ?? null;
  const deprecated = /^  deprecated: \{/m.test(text);
  const use = deprecated ? text.match(/^  deprecated: \{[^}]*\buse: "([^"]+)"/m)?.[1] ?? null : null;
  const nativeImports = text.match(/^  native: \{[\s\S]*?imports: \[([^\]]*)\]/m)?.[1];
  return {
    title: str("title"),
    status: str("status"),
    category: str("category"),
    platforms: str("platforms"),
    deprecatedUse: use,
    nativeImports: nativeImports ? [...nativeImports.matchAll(/"([^"]+)"/g)].map((m) => m[1]) : [],
  };
}

/** The decisions ADR-006 (appendix A) already took: `merge` rows (target) and the issues that keep an entry. */
export function readPriorAudit(text) {
  const merges = new Map();
  const issues = new Map();
  for (const line of text.split("\n")) {
    const m = line.match(/^\| `([^`]+)` \|.*\| \*\*(keep|merge|deprecate)\*\*[^|]*\| ([^|]*)\|/);
    if (!m) continue;
    const [, entry, verdict, reason] = m;
    if (verdict === "merge") merges.set(entry, reason.match(/into ([\w-]+)/)?.[1] ?? null);
    const issue = reason.match(/\b([\w-]+#\d+)/)?.[1];
    if (issue) issues.set(entry, issue);
  }
  return { merges, issues };
}

/** The gzip size of a dist entry and every chunk it pulls in (the package's own code; dependencies excluded). */
export function closureSize(dist, file, cache = new Map()) {
  if (!existsSync(join(dist, file))) return null;
  const seen = new Set();
  const stack = [file];
  let bytes = 0;
  while (stack.length) {
    const f = stack.pop();
    if (seen.has(f)) continue;
    seen.add(f);
    const path = join(dist, f);
    if (!existsSync(path)) continue;
    if (!cache.has(f)) {
      const text = readFileSync(path, "utf8");
      const deps = [...text.matchAll(/(?:from|import)\s*["']\.\/([^"']+\.js)["']/g)].map((m) => m[1]);
      cache.set(f, { gz: gzipSync(text).length, deps });
    }
    const { gz, deps } = cache.get(f);
    bytes += gz;
    stack.push(...deps);
  }
  return bytes;
}

const parseLimit = (s) => {
  const m = String(s).match(/([\d.]+)\s*(B|kB|KB|MB)/);
  if (!m) return null;
  return Math.round(Number(m[1]) * { B: 1, kB: 1000, KB: 1024, MB: 1e6 }[m[2]]);
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

/** The last change (YYYY-MM-DD) of each top directory under `dir`, from one `git log` pass. */
function lastChanges(repo, dir, created = new Map()) {
  const out = new Map();
  try {
    const log = execFileSync("git", ["-C", repo, "log", "--format=@%cs", "--name-only", "--", dir], { encoding: "utf8", maxBuffer: 1 << 28 });
    let date = null;
    for (const line of log.split("\n")) {
      if (line.startsWith("@")) date = line.slice(1);
      else if (line.startsWith(dir + "/")) {
        const rest = line.slice(dir.length + 1);
        const top = rest.includes("/") ? rest.split("/")[0] : rest.replace(/\.[^.]+$/, "");
        if (!out.has(top)) out.set(top, date);
        created.set(top, date); // the log runs newest first: the last date seen is the first commit
      }
    }
  } catch {
    /* not a git checkout */
  }
  return out;
}

function gitHead(path) {
  try {
    return execFileSync("git", ["-C", path, "log", "-1", "--format=%h %cs"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return null;
  }
}

/** Consumers whose use alone does not keep an entry: the motion lab only shows things off. */
export const SHOWCASE = new Set(["motion-lab"]);

/**
 * The proposed verdict of an entry, from its facts (ADR-008 §2), given the entries already kept (`kept`): « built on »
 * keeps an entry only when the entry built on it is itself kept (ADR-006 §7 rule c).
 */
export function verdict(e, { kept = new Set(), newDays = 10, today = new Date().toISOString().slice(0, 10) } = {}) {
  const real = Object.entries(e.importers).filter(([n]) => !SHOWCASE.has(n)).reduce((a, [, c]) => a + c, 0)
    + Object.entries(e.nativeUse ?? {}).filter(([n]) => !SHOWCASE.has(n) && !PAUSED_NAMES.has(n)).reduce((a, [, c]) => a + c, 0);
  if (e.mergeInto) return { verdict: "merge", into: e.mergeInto, why: "ADR-006 merge (#675), or deprecated in favour of another entry" };
  if (e.status === "deprecated") return { verdict: "retire", why: "already deprecated (#674), removed in 4.0" };
  if (real > 0) return { verdict: "keep", why: `${real} live importer file(s)` };
  const keptBy = e.builtOnBy.filter((d) => kept.has(d));
  if (keptBy.length) return { verdict: "keep", why: `built on by ${keptBy.slice(0, 3).join(", ")}${keptBy.length > 3 ? "…" : ""}` };
  if (e.issue) return { verdict: "keep", why: `filed need ${e.issue}` };
  if (e.paused > 0) return { verdict: "leave-core", why: `used only by paused products (${e.pausedBy.join(", ")})` };
  if (e.live > 0) return { verdict: "ask", why: "used only by the motion lab" };
  const age = e.created ? (Date.parse(today) - Date.parse(e.created)) / 864e5 : Infinity;
  if (e.domain === "cahier") return { verdict: "ask", why: "unused, Cahier register (sites)" };
  if (age <= newDays) return { verdict: "ask", why: `unused, new (${e.created}): its adoption issue?` };
  return { verdict: "retire", why: "no live importer, no paused importer, no filed need, no kept entry built on it" };
}

/** Verdicts for all rows: the kept set grows until nothing changes (an entry kept by use keeps what it is built on). */
export function decideAll(rows, opts = {}) {
  let kept = new Set();
  let out = rows;
  for (let i = 0; i < 10; i++) {
    out = rows.map((r) => ({ ...r, ...verdict(r, { ...opts, kept }) }));
    const next = new Set(out.filter((r) => r.verdict === "keep" && r.kind === "entry").map((r) => r.name.split("/")[0]));
    if (next.size === kept.size && [...next].every((n) => kept.has(n))) break;
    kept = next;
  }
  return out;
}

function scanConsumer(c, keys, motionKeys) {
  if (!existsSync(c.path)) return { ...c, absent: true, files: 0, entries: new Map(), names: new Map() };
  const entries = new Map();
  const names = new Map();
  const files = walk(c.path).filter((f) => !f.includes(`${join("registry", "examples")}`));
  for (const f of files) {
    const text = readFileSync(f, "utf8");
    if (!text.includes("@krizaka/ui") && !text.includes("@krizaka/motion")) continue;
    const { specifiers, names: taken } = parseImports(text);
    const seen = new Set();
    for (const s of specifiers) {
      const { pkg, entry } = entryOf(s, s.startsWith("@krizaka/motion") ? motionKeys : keys);
      const id = `${pkg}:${entry}`;
      if (seen.has(id)) continue;
      seen.add(id);
      entries.set(id, (entries.get(id) ?? 0) + 1);
    }
    const seenNames = new Set();
    for (const { from, name } of taken) {
      const id = `${from}#${name}`;
      if (seenNames.has(id)) continue;
      seenNames.add(id);
      names.set(id, (names.get(id) ?? 0) + 1);
    }
  }
  return { ...c, absent: false, head: gitHead(c.path), files: files.length, entries, names };
}

/** Which src/<dir> of the package imports which other src/<dir> (relative imports): « built on ». */
function internalDeps(srcDir, dirs) {
  const dependents = new Map();
  for (const d of dirs) {
    const files = walk(join(srcDir, d)).filter((f) => !/\.(test|stories)\./.test(f));
    for (const f of files) {
      const text = readFileSync(f, "utf8");
      for (const m of text.matchAll(/from\s*["'](\.\.\/(?:\.\.\/)?)([\w-]+)(?:\/[^"']*)?["']/g)) {
        const target = m[2];
        if (target === d || !dirs.includes(target)) continue;
        if (!dependents.has(target)) dependents.set(target, new Set());
        dependents.get(target).add(d);
      }
      // the package's own entries, kept external by tsup (router)
      for (const m of text.matchAll(/from\s*["']@krizaka\/ui\/([\w-]+)["']/g)) {
        if (m[1] === d) continue;
        if (!dependents.has(m[1])) dependents.set(m[1], new Set());
        dependents.get(m[1]).add(d);
      }
    }
  }
  return dependents;
}

export function buildInventory(opts) {
  const uiDir = join(ROOT, "packages/ui");
  const pkg = JSON.parse(readFileSync(join(uiDir, "package.json"), "utf8"));
  const keys = new Set(Object.keys(pkg.exports));
  const motionPkg = opts.motion && existsSync(join(opts.motion, "package.json")) ? JSON.parse(readFileSync(join(opts.motion, "package.json"), "utf8")) : null;
  const motionKeys = new Set(Object.keys(motionPkg?.exports ?? { ".": 1 }));
  const srcDir = join(uiDir, "src");
  const dirs = readdirSync(srcDir).filter((d) => statSync(join(srcDir, d)).isDirectory());
  const prior = existsSync(join(ROOT, "docs/adr/ADR-006-krizaka-ui-2027.md"))
    ? readPriorAudit(readFileSync(join(ROOT, "docs/adr/ADR-006-krizaka-ui-2027.md"), "utf8"))
    : { merges: new Map(), issues: new Map() };
  const createdAt = new Map();
  const nativeCreatedAt = new Map();
  const changed = lastChanges(ROOT, "packages/ui/src", createdAt);
  const nativeChanged = lastChanges(ROOT, "packages/ui/src/native", nativeCreatedAt);
  const budget = budgets(pkg["size-limit"]);
  const dist = opts.dist ?? join(uiDir, "dist");
  const hasDist = existsSync(dist);
  const cache = new Map();
  const deps = internalDeps(srcDir, dirs);
  const storyFiles = [...walk(srcDir), ...walk(join(ROOT, "apps/storybook/src"))].filter((f) => /\.stories\./.test(f));
  const flat = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

  const consumers = opts.consumers.map((c) => scanConsumer(c, keys, motionKeys));
  const paused = opts.paused.map((c) => scanConsumer(c, keys, motionKeys));

  /** Rows: every export key (wildcard registry keys aside), then the native-only components of the registry. */
  const rows = [];
  for (const key of keys) {
    if (key.includes("*") || key === "./package.json") continue;
    const name = key === "." ? "." : key.slice(2);
    const dir = name.split("/")[0].replace(/\.css$/, "");
    const metaPath = join(srcDir, dir, "meta.ts");
    const meta = existsSync(metaPath) && !name.includes("/") ? readMeta(readFileSync(metaPath, "utf8")) : {};
    const parentCategory = name.includes("/") && existsSync(metaPath) ? readMeta(readFileSync(metaPath, "utf8")).category : null;
    rows.push({ pkg: "ui", name, dir, meta, parentCategory, kind: name.endsWith(".css") ? "css" : "entry" });
  }
  const nativeMetaDir = join(srcDir, "native/meta");
  for (const f of existsSync(nativeMetaDir) ? readdirSync(nativeMetaDir) : []) {
    const n = basename(f, ".ts");
    rows.push({ pkg: "ui", name: `native:${n}`, dir: "native", meta: readMeta(readFileSync(join(nativeMetaDir, f), "utf8")), kind: "native-only" });
  }

  const today = opts.today ?? new Date().toISOString().slice(0, 10);
  const out = rows.map((r) => {
    const importers = {};
    const pausedBy = [];
    let live = 0;
    let pausedCount = 0;
    const count = (scan) => {
      if (r.kind === "native-only") {
        const names = new Set(r.meta.nativeImports);
        let n = 0;
        for (const [id, c] of scan.names) if (id.startsWith("@krizaka/ui/native#") && names.has(id.split("#")[1])) n += c;
        return n;
      }
      return scan.entries.get(`ui:${r.name}`) ?? 0;
    };
    for (const scan of consumers) {
      const n = count(scan);
      if (n) importers[scan.name] = n;
      if (n) live += n;
    }
    for (const scan of paused) {
      const n = count(scan);
      if (n) {
        pausedBy.push(scan.name);
        pausedCount += n;
      }
    }
    // a web+native component (`native.imports`) also counts the files that take its names from @krizaka/ui/native
    const nativeUse = {};
    if (r.kind === "entry" && r.meta?.nativeImports?.length) {
      const names = new Set(r.meta.nativeImports);
      for (const scan of [...consumers, ...paused]) {
        let n = 0;
        for (const [id, c] of scan.names) if (id.startsWith("@krizaka/ui/native#") && names.has(id.split("#")[1])) n += c;
        if (n) nativeUse[scan.name] = n;
      }
    }
    const file = r.name === "." ? "index.js" : `${r.name}.js`;
    const size = hasDist && r.kind === "entry" ? closureSize(dist, file, cache) : null;
    const tests = r.kind === "entry" && dirs.includes(r.dir) && r.dir !== "native" ? walk(join(srcDir, r.dir)).filter((f) => /\.test\./.test(f)).length : null;
    const stories = r.kind === "entry" && r.dir !== "native" && r.name !== "." ? storyFiles.filter((f) => f.includes(`/src/${r.dir}/`) || flat(basename(f).split(".")[0]) === flat(r.dir)).length : null;
    const builtOnBy = [...(deps.get(r.dir) ?? [])].filter((d) => d !== "test").sort();
    const row = {
      pkg: r.pkg,
      name: r.name,
      kind: r.kind,
      title: r.meta.title ?? null,
      category: r.meta.category ?? null,
      status: r.meta.status ?? null,
      domain: domainOf(r.name, r.meta.category, r.parentCategory),
      importers,
      nativeUse,
      live,
      paused: pausedCount,
      pausedBy,
      builtOnBy,
      issue: prior.issues.get(r.name) ?? null,
      mergeInto: prior.merges.get(r.name) ?? r.meta.deprecatedUse ?? null,
      sizeGzip: size,
      budget: budget.get(r.name) ?? null,
      tests,
      stories,
      lastChange: r.kind === "native-only" ? (nativeChanged.get(r.name.slice(7)) ?? changed.get("native") ?? null) : (changed.get(r.dir) ?? null),
      created: r.kind === "native-only" ? (nativeCreatedAt.get(r.name.slice(7)) ?? null) : (createdAt.get(r.dir) ?? null),
    };
    // the same component taken from @krizaka/ui/native (other files) is a live use too
    row.live += Object.entries(nativeUse).filter(([n]) => consumers.some((c) => c.name === n)).reduce((s, [, c]) => s + c, 0);
    return row;
  });
  const decided = decideAll(out, { today });

  // Krizaka Motion: its entries and their importers (the lab is private: no one can import it yet).
  const motion = motionPkg
    ? [...motionKeys].map((k) => {
        const entry = k === "." ? "." : k.slice(2);
        const importers = {};
        for (const scan of [...consumers, ...paused]) {
          if (scan.name === "motion-lab") continue;
          const n = scan.entries.get(`motion:${entry}`) ?? 0;
          if (n) importers[scan.name] = n;
        }
        const indexFile = [join(opts.motion, "src", entry === "." ? "index.ts" : `${entry}/index.ts`)].find(existsSync);
        const exportsText = indexFile ? readFileSync(indexFile, "utf8") : "";
        const names = [...exportsText.matchAll(/export\s+(?:\{([^}]*)\}|(?:const|function|class)\s+(\w+)|\*\s+from\s+["']([^"']+)["'])/g)].flatMap((m) =>
          m[1] ? m[1].split(",").map((s) => s.trim().replace(/^type\s+/, "").split(/\s+as\s+/).pop()).filter(Boolean) : [m[2] ?? `* ${m[3]}`],
        );
        return { pkg: "motion", name: entry, exports: names, importers, live: Object.values(importers).reduce((a, b) => a + b, 0), private: motionPkg.private === true };
      })
    : [];

  return {
    generated: today,
    package: { name: pkg.name, version: pkg.version, distMeasured: hasDist ? opts.distLabel ?? relative(ROOT, dist) : null },
    consumers: consumers.map((c) => ({ name: c.name, kind: c.kind, absent: c.absent, head: c.head ?? null, files: c.files })),
    paused: paused.map((c) => ({ name: c.name, absent: c.absent, head: c.head ?? null, files: c.files })),
    entries: decided,
    motion,
  };
}

export function summarise(inv) {
  const by = (key) => inv.entries.reduce((m, e) => ((m[e[key] ?? "none"] = (m[e[key] ?? "none"] ?? 0) + 1), m), {});
  const domainSizes = {};
  for (const e of inv.entries) {
    if (e.verdict === "retire" || e.verdict === "merge" || e.verdict === "leave-core") continue;
    const d = (domainSizes[e.domain ?? "none"] ??= { entries: 0, gzip: 0, budget: 0 });
    d.entries += 1;
    d.gzip += e.sizeGzip ?? 0;
    d.budget += e.budget ?? 0;
  }
  return { verdicts: by("verdict"), domains: by("domain"), keptByDomain: domainSizes };
}

const kb = (b) => (b == null ? "—" : `${(b / 1000).toFixed(1)}`);
const short = { yomizaka: "Yo", akinaza: "Ak", "orazaka-web-client": "Oz", "krizaka-com": "www", blog: "blog", "ui-site": "ui", "java-site": "java", "ts-site": "ts", "motion-lab": "motion", cockpit: "cockpit" };

export function toMarkdown(inv) {
  const s = summarise(inv);
  const lines = [
    `# @krizaka/ui usage inventory — ${inv.generated}`,
    "",
    `Generated by \`node tools/usage-inventory.mjs --out docs/inventory\` (krizaka-ui#837, ADR-008). Do not edit by hand.`,
    `Package: ${inv.package.name}@${inv.package.version}; sizes: gzip of the entry and its chunks (dependencies excluded) from ${inv.package.distMeasured ?? "no dist (sizes not measured)"}.`,
    "",
    `Consumers: ${inv.consumers.map((c) => `${c.name}${c.absent ? " (absent)" : ` ${c.head ?? ""}`}`).join(" · ")}.`,
    `Paused (counted apart): ${inv.paused.map((c) => `${c.name}${c.absent ? " (absent)" : ""}`).join(" · ")}.`,
    "",
    `Verdicts: ${Object.entries(s.verdicts).map(([k, v]) => `${k} ${v}`).join(" · ")}.`,
    "",
    "Sizes: the gzip of an entry's own file and every chunk it pulls in (shared chunks are counted in each entry, so a sum",
    "over-counts); the budget is the entry's size-limit row in packages/ui/package.json (size-limit measures differently: compare",
    "an entry with itself over time, not with its budget).",
    "",
    "| Domain | Entries not retired | gzip sum (kB) | size-limit budgets sum (kB) |",
    "| :-- | --: | --: | --: |",
    ...Object.entries(s.keptByDomain).sort(([a], [b]) => Object.keys(DOMAINS).indexOf(a) - Object.keys(DOMAINS).indexOf(b)).map(([d, v]) => `| ${DOMAINS[d] ?? d} | ${v.entries} | ${kb(v.gzip)} | ${kb(v.budget)} |`),
    "",
    "| Entry | Domain | Status | Live importers (files) | Paused | Built on by | gzip kB / budget | Tests | Stories | Last change | Verdict | Why |",
    "| :-- | :-- | :-- | :-- | :-- | --: | :-- | --: | --: | :-- | :-- | :-- |",
  ];
  const order = Object.keys(DOMAINS);
  const rows = [...inv.entries].sort((a, b) => order.indexOf(a.domain) - order.indexOf(b.domain) || a.name.localeCompare(b.name));
  for (const e of rows) {
    const imp = Object.entries(e.importers).map(([k, v]) => `${short[k] ?? k} ${v}`).join(" ") || "—";
    const nat = Object.keys(e.nativeUse ?? {}).length ? ` (native: ${Object.entries(e.nativeUse).map(([k, v]) => `${short[k] ?? k} ${v}`).join(" ")})` : "";
    lines.push(
      `| \`${e.name}\` | ${DOMAINS[e.domain] ?? "**none**"} | ${e.status ?? "—"} | ${imp}${nat} | ${e.pausedBy.join(", ") || "—"} | ${e.builtOnBy.length || "—"} | ${kb(e.sizeGzip)} / ${kb(e.budget)} | ${e.tests ?? "—"} | ${e.stories ?? "—"} | ${e.lastChange ?? "—"} | **${e.verdict}**${e.into ? ` → \`${e.into}\`` : ""} | ${e.why} |`,
    );
  }
  if (inv.motion.length) {
    lines.push("", "## @krizaka/motion (the lab)", "", "| Entry | Exports | Importers outside the lab |", "| :-- | :-- | :-- |");
    for (const m of inv.motion) lines.push(`| \`${m.name}\` | ${m.exports.join(", ") || "—"} | ${Object.entries(m.importers).map(([k, v]) => `${k} ${v}`).join(" ") || "—"} |`);
  }
  return lines.join("\n") + "\n";
}

function parsePairs(list, kind) {
  return (list ?? []).map((s) => {
    const [name, path] = s.split("=");
    return { name, kind, path: resolve(path) };
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({
    options: {
      json: { type: "boolean" },
      out: { type: "string" },
      dist: { type: "string" },
      "dist-label": { type: "string" },
      motion: { type: "string" },
      consumer: { type: "string", multiple: true },
      paused: { type: "string", multiple: true },
    },
  });
  const override = (base, pairs) => base.map((c) => pairs.find((p) => p.name === c.name) ? { ...c, path: pairs.find((p) => p.name === c.name).path } : c);
  const consumerPairs = parsePairs(values.consumer, "site");
  const pausedPairs = parsePairs(values.paused, "paused");
  const motionPath = values.motion ? resolve(values.motion) : CONSUMERS.find((c) => c.name === "motion-lab").path;
  const consumers = override(CONSUMERS, consumerPairs).map((c) => (c.name === "motion-lab" ? { ...c, path: motionPath } : c));
  const inv = buildInventory({
    consumers,
    paused: override(PAUSED, pausedPairs),
    motion: motionPath,
    dist: values.dist ? resolve(values.dist) : undefined,
    distLabel: values["dist-label"],
  });
  if (values.out) {
    mkdirSync(values.out, { recursive: true });
    writeFileSync(join(values.out, "ui-usage.json"), JSON.stringify(inv, null, 2) + "\n");
    writeFileSync(join(values.out, "ui-usage.md"), toMarkdown(inv));
    const s = summarise(inv);
    console.log(`wrote ${values.out}/ui-usage.{json,md}: ${inv.entries.length} entries, ${Object.entries(s.verdicts).map(([k, v]) => `${k} ${v}`).join(", ")}`);
  } else console.log(values.json ? JSON.stringify(inv, null, 2) : toMarkdown(inv));
}
