#!/usr/bin/env node
/* lib/orazaka-nav.json is the Orazaka web client's rail (sections, icons, words), copied from its source at main:
   the home's scene draws it, so the mock cannot drift from the app.

   Usage: node scripts/sync-orazaka-nav.mjs [--check] [--from <orazaka-web-client dir>]
     (none)    rewrites lib/orazaka-nav.json from GitHub (or --from a local checkout).
     --check   exits 1 when the file differs from the app's source; only warns when the source cannot be read (offline). */

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { buildNav } from "./orazaka-nav-lib.mjs";

const RAW = "https://raw.githubusercontent.com/krizaka/orazaka-web-client/main/";
const FILES = { sections: "src/core/config/app-sections.ts", translations: "src/core/context/translations.ts" };
const target = path.resolve(import.meta.dirname, "../lib/orazaka-nav.json");
const args = process.argv.slice(2);
const from = args.includes("--from") ? args[args.indexOf("--from") + 1] : null;

async function read(file) {
  if (from) return readFileSync(path.join(from, file), "utf8");
  const res = await fetch(RAW + file);
  if (!res.ok) throw new Error(`${RAW + file}: ${res.status}`);
  return res.text();
}

let nav;
try {
  nav = buildNav(await read(FILES.sections), await read(FILES.translations));
} catch (error) {
  if (args.includes("--check")) {
    console.warn(`orazaka-nav: source not readable, check skipped (${error.message})`);
    process.exit(0);
  }
  throw error;
}
const next = `${JSON.stringify({ source: `krizaka/orazaka-web-client ${FILES.sections}`, ...nav }, null, 2)}\n`;
if (args.includes("--check")) {
  if (readFileSync(target, "utf8") !== next) {
    console.error("lib/orazaka-nav.json differs from the app's rail: run `node scripts/sync-orazaka-nav.mjs`");
    process.exit(1);
  }
} else {
  writeFileSync(target, next);
  console.log("lib/orazaka-nav.json written");
}
