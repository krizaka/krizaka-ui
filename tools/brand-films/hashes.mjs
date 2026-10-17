#!/usr/bin/env node
// After an upload from krizaka-com (scripts/cdn-assets.mjs records each file's hash in its lib/cdn-manifest.json):
// copies the hashes of the square loops into ui.krizaka.com's apps/site/lib/brand-films.ts, the only place this repository
// names them.
//
//   node tools/brand-films/hashes.mjs <krizaka-com>/lib/cdn-manifest.json
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SITE_FILE = resolve(dirname(fileURLToPath(import.meta.url)), "../../apps/site/lib/brand-films.ts");
const PREFIX = "brand-films/loops/";

/** The `<bird>-square-<theme>.<mp4|jpg>` entries of a krizaka-com manifest, as `name → hash`, sorted. */
export function loopHashes(manifest) {
  return Object.fromEntries(
    Object.entries(manifest.files ?? {})
      .filter(([path]) => path.startsWith(PREFIX) && /-square-(dark|light)\.(mp4|jpg)$/.test(path))
      .map(([path, hash]) => [path.slice(PREFIX.length), hash])
      .sort(([a], [b]) => a.localeCompare(b)),
  );
}

/** The site module with its `LOOP_HASHES` replaced. */
export function withHashes(source, hashes) {
  const body = Object.entries(hashes)
    .map(([name, hash]) => `  "${name}": "${hash}",`)
    .join("\n");
  const out = source.replace(/export const LOOP_HASHES: Record<string, string> = \{[^}]*\};/, `export const LOOP_HASHES: Record<string, string> = {\n${body}\n};`);
  if (out === source && body) throw new Error("no LOOP_HASHES block in the site module");
  return out;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const manifest = JSON.parse(readFileSync(resolve(process.argv[2] ?? ""), "utf8"));
  const hashes = loopHashes(manifest);
  writeFileSync(SITE_FILE, withHashes(readFileSync(SITE_FILE, "utf8"), hashes));
  console.log(`${Object.keys(hashes).length} loop files → apps/site/lib/brand-films.ts`);
}
