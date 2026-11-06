#!/usr/bin/env node
// tools/inventory.mjs — the final audit of the UI refactor (study §2.1): where does a concept of the @krizaka/ui
// catalogue still have a local implementation? Read-only: it only reads the clones of the products and of the site.
// Why: the catalogue is only worth its name if no product keeps its own copy. Owner: krizaka-ui (lane platform).
// ADR-026 phase D: the concepts' names, endings and modules are lists (CONCEPTS), read by small matchers; no regex over 80 characters.
//
//
//   node tools/inventory.mjs                      # markdown report on stdout (clones under ~/krizaka-com)
//   node tools/inventory.mjs --json               # the same, as JSON (CI, scripts)
//   node tools/inventory.mjs --base ~/src/krizaka --repo krizaka-com=../krizaka-com-p64
//   node tools/inventory.mjs --strict             # exit 1 when a duplicate is left
//
// How a local definition is classified (by name, then by signature):
//   - "adaptateur"  — it bears a catalogue name (Button, Dialog…) but builds on the primitive (imports it);
//   - "composite"   — a product component carrying the concept in its name (AuctionStatusBadge, CostConfirmDialog)
//                     that builds on the primitive or on the product design system, or that §2.2 lists as a product
//                     composite: legitimate (level 2 or 3);
//   - "doublon"     — a local implementation that imports neither: to migrate onto @krizaka/ui;
//   - "signature"   — no catalogue name, but the file re-does what a primitive does (role="dialog", role="switch",
//                     role="tablist", a theme class toggled by hand, cmdk used directly): a duplicate too.
//
// A product that imports the primitives through its own door (`components/ui/index.ts`, which re-exports
// `@krizaka/ui/*` and gives them the product's words) builds on them as much as a direct import does: a name imported
// from the door counts as an import of the module the door takes it from (`doorSources`).
import { existsSync, readFileSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

import { CONCEPTS, COMPOSITES, conceptOf, mentionsPrimitive, NATIVE, PRODUCT_KIT } from "./inventory-concepts.mjs";
import { isDuplicate, issueBody, toMarkdown } from "./inventory-report.mjs";
import { definitions, doorSources, ILLUSTRATION, readDoor, sourceFiles } from "./inventory-source.mjs";

export * from "./inventory-concepts.mjs";
export * from "./inventory-report.mjs";
export * from "./inventory-source.mjs";

/** The clones scanned, relative to the base folder (default ~/krizaka-com). `slug` is the GitHub repository. The products in
    focus only: the repositories of the products that left the organisation are not read. */
export const REPOS = [
  { name: "krizaka-com", path: ".", slug: "krizaka/krizaka-com", prompt: "P2.6 / P3.2 transposés au site", skip: ["products", "company", "sovkora-content", "content", "public"] },
  { name: "verikora-web", path: "products/verikora/apps/web", slug: "krizaka/verikora", prompt: "Verikora web" },
  { name: "verikora-mobile", path: "products/verikora/apps/mobile", slug: "krizaka/verikora", prompt: "Verikora mobile" },
  { name: "folioviv-web", path: "products/folioviv/apps/web", slug: "krizaka/folioviv", prompt: "Folioviv web" },
  { name: "folioviv-mobile", path: "products/folioviv/apps/mobile", slug: "krizaka/folioviv", prompt: "Folioviv mobile" },
  { name: "sovkora-ui-kit", path: "products/sovkora/sovkora-apps/ui/sovkora-ui-kit", slug: "krizaka/sovkora-ui-kit", prompt: "P2.5 (kit Sovkora)" },
  { name: "sovkora-web", path: "products/sovkora/sovkora-apps/ui/sovkora-web", slug: "krizaka/sovkora-web", prompt: "P3.4 (Sovkora web-client)" },
  { name: "sovkora-mobile", path: "products/sovkora/sovkora-apps/ui/sovkora-mobile", slug: "krizaka/sovkora-mobile", prompt: "P6.2 appliqué à Sovkora mobile" },
];

/**
 * Classifies one file: its definitions that bear a concept, then the concepts it re-does without one. `door` lists
 * the package modules the file reaches through the product's door (`doorSources`).
 * @returns {{ symbol: string, concept: string, status: "adaptateur" | "composite" | "doublon" | "signature", why: string }[]}
 */
export function classify(text, door = []) {
  const findings = [];
  const direct = (c) => mentionsPrimitive(text, c.primitives) || NATIVE.test(text);
  const builds = (c) => direct(c) || door.some((spec) => mentionsPrimitive(spec, c.primitives));
  const onKit = PRODUCT_KIT.test(text) || door.some((spec) => PRODUCT_KIT.test(spec));
  const seen = new Set();
  for (const symbol of definitions(text)) {
    const hit = conceptOf(symbol);
    if (!hit) continue;
    const { concept: c, by } = hit;
    seen.add(c.id);
    if (COMPOSITES.has(symbol)) findings.push({ symbol, concept: c.id, status: "composite", why: "listé en §2.2" });
    else if (builds(c)) findings.push({ symbol, concept: c.id, status: by === "name" ? "adaptateur" : "composite", why: direct(c) ? "importe la primitive" : "importe la primitive par la porte du produit" });
    else if (by === "suffix" && onKit) findings.push({ symbol, concept: c.id, status: "composite", why: "sur le design system produit" });
    else findings.push({ symbol, concept: c.id, status: "doublon", why: "n'importe pas la primitive" });
  }
  for (const c of CONCEPTS) {
    if (!c.signature || seen.has(c.id) || builds(c) || !c.signature.test(text)) continue;
    // A portal alone is not a dialog: it needs the dialog semantics too.
    if (c.id === "dialog" && !/role=["']dialog["']|aria-modal=/.test(text)) continue;
    findings.push({ symbol: definitions(text).find((n) => /^[A-Z][a-z]/.test(n)) ?? "—", concept: c.id, status: "signature", why: `signature ${c.signature.source.slice(0, 40)}` });
  }
  return findings;
}

/** Scans every repository. Missing clones are reported, never fatal. */
export function inventory({ base = join(homedir(), "krizaka-com"), overrides = {} } = {}) {
  const repos = [];
  for (const repo of REPOS) {
    const path = overrides[repo.name] ? resolve(overrides[repo.name]) : join(base, repo.path);
    if (!existsSync(path) || !statSync(path).isDirectory()) {
      repos.push({ ...repo, path, missing: true, files: 0, findings: [] });
      continue;
    }
    const files = sourceFiles(path, repo.skip);
    const findings = [];
    const door = readDoor(files);
    for (const file of files) {
      const rel = relative(path, file).split(sep).join("/");
      if (ILLUSTRATION.test(rel)) continue;
      const text = readFileSync(file, "utf8");
      for (const f of classify(text, doorSources(text, file, path, door))) findings.push({ ...f, file: rel });
    }
    repos.push({ ...repo, path, missing: false, files: files.length, findings });
  }
  return { date: new Date().toISOString().slice(0, 10), base, repos };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({
    options: {
      json: { type: "boolean" },
      strict: { type: "boolean" },
      base: { type: "string" },
      repo: { type: "string", multiple: true },
      help: { type: "boolean", short: "h" },
    },
  });
  if (values.help) {
    console.log("Usage: node tools/inventory.mjs [--json] [--strict] [--base <dir>] [--repo <name>=<path>]…");
    process.exit(0);
  }
  const expand = (p) => (p.startsWith("~") ? join(homedir(), p.slice(1)) : isAbsolute(p) ? p : resolve(p));
  const overrides = Object.fromEntries((values.repo ?? []).map((r) => r.split("=")).map(([k, v]) => [k, expand(v)]));
  const report = inventory({ base: values.base ? expand(values.base) : undefined, overrides });
  console.log(values.json ? JSON.stringify(report, null, 2) : toMarkdown(report));
  const total = report.repos.flatMap((r) => r.findings).filter(isDuplicate).length;
  process.exit(values.strict && total > 0 ? 1 : 0);
}
