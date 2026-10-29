#!/usr/bin/env node
// tools/devx-check.mjs — « Krizaka UI stays light and pleasant to import » (krizaka-ui#837, ADR-008, founder 2026-10-29).
// Three measures, each against packages/ui/devx-budget.json (a ratchet: it only goes down):
//   1. the import cost of a typical page: the gzip of the union of the dist files its entries pull in;
//   2. the cold type-check time of a file that imports the same entries (tsc --noEmit, no incremental cache);
//   3. the hygiene that makes the two possible: every entry deep-importable with its types, `sideEffects` declared
//      (so a bundler can tree-shake), the typical page's entries all still exported.
//
//   node tools/devx-check.mjs            # needs packages/ui/dist (pnpm --filter @krizaka/ui build)
//   node tools/devx-check.mjs --static   # hygiene only, no dist (unit tests, a quick look)
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const UI = join(ROOT, "packages/ui");
const CHUNK_IMPORT = /(?:from|import) ?"\.\/([\w./-]+\.js)"/g;

/** The gzip bytes of the union of the dist files the entries pull in (a shared chunk is counted once). */
export function unionGzip(dist, files) {
  const seen = new Set();
  const stack = [...files];
  let bytes = 0;
  while (stack.length) {
    const f = stack.pop();
    if (seen.has(f) || !existsSync(join(dist, f))) continue;
    seen.add(f);
    const text = readFileSync(join(dist, f), "utf8");
    bytes += gzipSync(text).length;
    stack.push(...[...text.matchAll(CHUNK_IMPORT)].map((m) => m[1]));
  }
  return bytes;
}

/** `dist/<name>.js` of an export key (`./data-table` gives `data-table.js`), read from the exports map. */
export function distFileOf(pkg, entry) {
  const target = pkg.exports?.[`./${entry}`]?.import;
  return typeof target === "string" ? target.replace(/^\.\/dist\//, "") : null;
}

/** The static rules: no dist needed. Returns the list of problems (empty when fine). */
export function hygiene(pkg, budget) {
  const problems = [];
  if (pkg.sideEffects === undefined) problems.push("package.json declares no `sideEffects`: a bundler cannot tree-shake");
  for (const [key, value] of Object.entries(pkg.exports ?? {})) {
    if (key.includes("*") || typeof value === "string" || key.endsWith(".css")) continue;
    if (!value?.types || !value?.import) problems.push(`export ${key} lacks its types or its import: a deep import must be typed`);
  }
  for (const entry of budget.typicalPage.entries) {
    if (distFileOf(pkg, entry) === null) problems.push(`the typical page imports "${entry}", which @krizaka/ui no longer exports (update devx-budget.json)`);
  }
  return problems;
}

/** The typical page as a TypeScript file: one deep import per entry, each used so the type-check reads it. */
export function fixture(entries) {
  return entries.map((e, i) => `import * as e${i} from "@krizaka/ui/${e}";\nexport const u${i} = e${i};`).join("\n") + "\n";
}

/** Cold type-check seconds of the fixture against the built declarations. */
function coldTypecheck(entries) {
  const dir = mkdtempSync(join(tmpdir(), "kz-devx-"));
  try {
    writeFileSync(join(dir, "page.ts"), fixture(entries));
    const paths = { "@krizaka/ui/*": [join(UI, "dist/*.d.ts")] };
    writeFileSync(join(dir, "tsconfig.json"), JSON.stringify({
      compilerOptions: { target: "ES2022", module: "ESNext", moduleResolution: "Bundler", jsx: "react-jsx", strict: true, noEmit: true, skipLibCheck: true, incremental: false, types: [], baseUrl: ".", paths, typeRoots: [join(ROOT, "node_modules/@types"), join(UI, "node_modules/@types")] },
      files: ["page.ts"],
    }));
    const tsc = join(UI, "node_modules/.bin/tsc");
    const start = process.hrtime.bigint();
    const run = spawnSync(tsc, ["-p", dir], { cwd: UI, encoding: "utf8" });
    const seconds = Number(process.hrtime.bigint() - start) / 1e9;
    return { seconds, ok: run.status === 0, output: `${run.stdout}${run.stderr}`.trim().split("\n").slice(0, 8).join("\n") };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function main() {
  const pkg = JSON.parse(readFileSync(join(UI, "package.json"), "utf8"));
  const budget = JSON.parse(readFileSync(join(UI, "devx-budget.json"), "utf8"));
  const problems = hygiene(pkg, budget);
  const lines = [];
  if (!process.argv.includes("--static") && !problems.length) {
    const dist = join(UI, "dist");
    if (!existsSync(dist)) {
      process.stderr.write("devx check: packages/ui/dist is missing (pnpm --filter @krizaka/ui build)\n");
      process.exit(1);
    }
    const bytes = unionGzip(dist, budget.typicalPage.entries.map((e) => distFileOf(pkg, e)));
    lines.push(`typical page (${budget.typicalPage.entries.length} entries): ${(bytes / 1000).toFixed(1)} kB gzip, budget ${(budget.typicalPage.gzipBytes / 1000).toFixed(1)} kB`);
    if (bytes > budget.typicalPage.gzipBytes) problems.push(`the typical page costs ${bytes} B gzip, over its budget of ${budget.typicalPage.gzipBytes} B`);
    const tc = coldTypecheck(budget.typicalPage.entries);
    lines.push(`cold type-check: ${tc.seconds.toFixed(1)} s, budget ${budget.typecheck.seconds} s`);
    if (!tc.ok) problems.push(`the typical page does not type-check against dist:\n${tc.output}`);
    if (tc.seconds > budget.typecheck.seconds) problems.push(`the cold type-check takes ${tc.seconds.toFixed(1)} s, over its budget of ${budget.typecheck.seconds} s`);
  }
  for (const l of lines) process.stdout.write(`devx check: ${l}\n`);
  if (problems.length) {
    process.stderr.write(`devx check failed:\n- ${problems.join("\n- ")}\n`);
    process.exit(1);
  }
  process.stdout.write("devx check: ok\n");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
