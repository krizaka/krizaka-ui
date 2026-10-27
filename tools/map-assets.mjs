#!/usr/bin/env node
// The basemap of @krizaka/ui/map on our CDN (Bunny Storage → its pull zone): Protomaps PMTiles extracts (OpenStreetMap
// data, ODbL) and the glyphs of their labels (Noto Sans, SIL OFL). No API key, no metered map service: one file per
// region read by HTTP range requests, cached by the CDN.
//
//   node tools/map-assets.mjs upload <dir> [--env-file <path>] [--dry-run]
//   node tools/map-assets.mjs check [--env-file <path>]
//
// <dir> holds what is published, as it is published under `maps/v1/` of the storage zone:
//   tiles/<region>-<YYYYMMDD>.pmtiles        e.g. tiles/quebec-20261012.pmtiles, tiles/world-20261012.pmtiles
//   fonts/<font stack>/<start>-<end>.pbf     e.g. fonts/Noto Sans Regular/0-255.pbf
// Tile files carry their build date, so a URL never changes content (the CDN may cache it for good); a new extract is a
// new file and a new default in src/map/style.ts.
//
// Credentials (from the environment or --env-file, never printed): MEDIA_STORAGE_API_KEY, MEDIA_STORAGE_ZONE,
// MEDIA_STORAGE_ENDPOINT (default storage.bunnycdn.com), MEDIA_CDN_HOSTNAME (the pull zone). `check` asks the pull
// zone for every published file: 200, a range answered with 206, and CORS for any origin — what MapLibre needs.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

export const ROOT = "maps/v1";

/** `tiles/quebec-20261012.pmtiles` or `fonts/Noto Sans Regular/0-255.pbf` → is it a file we publish? */
export function publishable(rel) {
  return /^tiles\/[a-z0-9-]+-\d{8}\.pmtiles$/.test(rel) || /^fonts\/[A-Za-z0-9 ]+\/\d+-\d+\.pbf$/.test(rel);
}

export const contentType = (rel) => (rel.endsWith(".pmtiles") ? "application/vnd.pmtiles" : "application/x-protobuf");
export const encodePath = (path) => path.split("/").map(encodeURIComponent).join("/");

export function filesOf(dir) {
  const out = [];
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      const full = join(d, name);
      if (statSync(full).isDirectory()) walk(full);
      else out.push(relative(dir, full).split(sep).join("/"));
    }
  };
  walk(dir);
  return out.sort((a, b) => a.localeCompare(b));
}

export function parseEnv(text) {
  const env = {};
  for (const line of text.split(/\r?\n/)) {
    const m = /^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m) env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2");
  }
  return env;
}

function config(argv) {
  const i = argv.indexOf("--env-file");
  const env = { ...process.env, ...(i >= 0 ? parseEnv(readFileSync(argv[i + 1], "utf8")) : {}) };
  const host = (v) => (v ?? "").trim().replace(/^https?:\/\//, "").replace(/\/+$/, "");
  return { key: env.MEDIA_STORAGE_API_KEY ?? "", zone: (env.MEDIA_STORAGE_ZONE ?? "").trim(), endpoint: host(env.MEDIA_STORAGE_ENDPOINT) || "storage.bunnycdn.com", pull: host(env.MEDIA_CDN_HOSTNAME) };
}

async function upload(dir, cfg, dryRun) {
  if (!cfg.key || !cfg.zone || !cfg.pull) throw new Error("MEDIA_STORAGE_API_KEY, MEDIA_STORAGE_ZONE and MEDIA_CDN_HOSTNAME are required");
  const files = filesOf(dir).filter(publishable);
  for (const rel of files) {
    const path = `${ROOT}/${rel}`;
    const size = statSync(join(dir, rel)).size;
    if (dryRun) {
      console.log(`would upload ${path} (${(size / 1e6).toFixed(1)} MB)`);
      continue;
    }
    const res = await fetch(`https://${cfg.endpoint}/${encodeURIComponent(cfg.zone)}/${encodePath(path)}`, {
      method: "PUT",
      headers: { AccessKey: cfg.key, "Content-Type": contentType(rel) },
      body: readFileSync(join(dir, rel)),
    });
    if (!res.ok) throw new Error(`${path}: ${res.status}`);
    console.log(`https://${cfg.pull}/${encodePath(path)}  ${(size / 1e6).toFixed(1)} MB`);
  }
}

async function check(urls) {
  let bad = 0;
  for (const url of urls) {
    const res = await fetch(url, { headers: { Range: "bytes=0-15", Origin: "https://www.krizaka.com" } });
    const cors = res.headers.get("access-control-allow-origin");
    const ok = res.status === 206 && (cors === "*" || cors === "https://www.krizaka.com");
    if (!ok) bad++;
    console.log(`${ok ? "ok " : "BAD"} ${res.status} cors=${cors ?? "-"} ${url}`);
    await res.arrayBuffer();
  }
  return bad;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [command, dir] = process.argv.slice(2);
  const cfg = config(process.argv);
  if (command === "upload") await upload(dir, cfg, process.argv.includes("--dry-run"));
  else if (command === "check") {
    const { MAP_TILES, MAP_GLYPHS } = await import("../packages/ui/src/map/assets.ts").catch(() => ({}));
    const urls = process.argv.slice(3).filter((a) => a.startsWith("https://"));
    const bad = await check(urls.length ? urls : [...Object.values(MAP_TILES ?? {}), (MAP_GLYPHS ?? "").replace("{fontstack}", "Noto Sans Regular").replace("{range}", "0-255")]);
    process.exit(bad ? 1 : 0);
  } else {
    console.error("usage: node tools/map-assets.mjs upload <dir> | check [url…]  [--env-file <path>] [--dry-run]");
    process.exit(2);
  }
}
