#!/usr/bin/env node
/* The publish dates of the releases, read ONCE before the build (npm's packuments are megabytes each: reading them while
   the pages are generated, in every worker, made the Documentation site job time out — tests/build-budget.test.mjs).
   Writes the git-ignored lib/release-times.json: { "<package>": { "<version>": "<YYYY-MM-DD>" } }, only for the versions the
   packages' CHANGELOG.md name. A package npm does not answer for is left out (its releases are left out of the changelog,
   never given an invented date). Usage: node scripts/gen-release-times.mjs */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const packages = new URL("../../../packages/", import.meta.url).pathname;
const out = new URL("../lib/release-times.json", import.meta.url);

async function times(name) {
  try {
    const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(name)}`, { signal: AbortSignal.timeout(15000) });
    return res.ok ? ((await res.json()).time ?? {}) : {};
  } catch {
    return {};
  }
}

const result = {};
await Promise.all(
  readdirSync(packages, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map(async (d) => {
      try {
        const { name } = JSON.parse(readFileSync(path.join(packages, d.name, "package.json"), "utf8"));
        const md = readFileSync(path.join(packages, d.name, "CHANGELOG.md"), "utf8");
        const wanted = new Set([...md.matchAll(/^## (\d+\.\d+\.\d+\S*)/gm)].map((m) => m[1]));
        const all = await times(name);
        result[name] = Object.fromEntries(Object.entries(all).filter(([v]) => wanted.has(v)).map(([v, t]) => [v, String(t).slice(0, 10)]));
      } catch {
        /* a package without a changelog */
      }
    }),
);
writeFileSync(out, JSON.stringify(result, null, 1) + "\n");
console.log(`release times: ${Object.values(result).reduce((n, t) => n + Object.keys(t).length, 0)} dated release(s) of ${Object.keys(result).length} package(s)`);
