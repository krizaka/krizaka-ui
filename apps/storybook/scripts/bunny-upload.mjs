// Mirrors a Storybook build to Bunny Storage, served by the pull zone ui.krizaka.com (study §4.2).
//
//   node scripts/bunny-upload.mjs --dir site/latest --dest latest --dest 2.0.0 --root site/index.html --rules --purge
//   node scripts/bunny-upload.mjs --dir storybook-static --dest latest --dest 0.0.0-dry --root site/index.html --dry-run
//
// --dir      the build to upload (storybook-static/ or the extracted Pages artifact's latest/)
// --dest     a destination folder in the Storage zone: `latest` or a semver version; repeatable
// --root     a file uploaded at the root of the zone (index.html, the redirect to /latest/)
// --rules    upserts the pull zone's Cache-Control edge rules (Bunny Storage keeps no per-file headers)
// --purge    purges the pull zone once everything is uploaded
// --dry-run  lists what would be sent (path, size, Content-Type, Cache-Control) and the rules; no network, no secrets
//
// Environment (not needed for --dry-run): BUNNY_STORAGE_KEY, BUNNY_STORAGE_ZONE, BUNNY_API_KEY, BUNNY_PULLZONE_ID,
// optional BUNNY_STORAGE_HOST (the zone's region endpoint, default storage.bunnycdn.com).
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, extname, join, relative, sep } from "node:path";
import { pathToFileURL } from "node:url";

export const CONCURRENCY = 8;
export const ATTEMPTS = 4;

/** The Content-Type of every extension a Storybook build emits. An unknown extension stops the upload. */
export const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".txt": "text/plain; charset=utf-8",
};

export const CACHE = {
  immutable: "public, max-age=31536000, immutable", // a hashed asset never changes under the same name
  entry: "public, max-age=0, must-revalidate", // index.html, iframe.html, index.json, project.json: always revalidated
  standard: "public, max-age=3600", // unhashed runtime files, fonts, icons
};

/** A Vite chunk: in assets/, the name ends with `-<8 base64url characters>.<ext>` (e.g. Button.stories-C1y4cbCJ.js). */
const HASHED = /^assets\/(?:.+\/)?[^/]+-[\w-]{8}\.[a-z0-9]+$/;
const ENTRY = /(?:^|\/)[^/]+\.(?:html|json)$/;

/** The Cache-Control of a file, from its path relative to the build root (forward slashes). */
export function cacheControlFor(path) {
  if (HASHED.test(path)) return CACHE.immutable;
  if (ENTRY.test(path)) return CACHE.entry;
  return CACHE.standard;
}

export function contentTypeFor(path) {
  return CONTENT_TYPES[extname(path).toLowerCase()];
}

/**
 * The same policy as pull zone edge rules (SetResponseHeader Cache-Control), matched on the URL: Bunny Storage serves
 * no per-file header, so the zone sets it. The URL patterns mirror cacheControlFor (assets/ only holds hashed chunks).
 */
export const RULE_PATTERNS = {
  immutable: ["*/assets/*"],
  entry: ["*.html", "*.json", "*/"],
};

export function edgeRules() {
  const rule = (name, value, triggers) => ({
    Description: `krizaka-ui: Cache-Control ${name}`,
    ActionType: 5, // SetResponseHeader
    ActionParameter1: "Cache-Control",
    ActionParameter2: value,
    TriggerMatchingType: 1, // MatchAll
    Triggers: triggers,
    Enabled: true,
  });
  const url = (patterns, matching) => ({ Type: 0, PatternMatches: patterns, PatternMatchingType: matching }); // Url
  return [
    rule("immutable", CACHE.immutable, [url(RULE_PATTERNS.immutable, 0)]),
    rule("entry", CACHE.entry, [url(RULE_PATTERNS.entry, 0), url(RULE_PATTERNS.immutable, 2)]),
    rule("standard", CACHE.standard, [url([...RULE_PATTERNS.immutable, ...RULE_PATTERNS.entry], 2)]),
  ];
}

const DEST = /^(?:latest|\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)$/;

export function parseArgs(argv) {
  const options = { dir: undefined, dests: [], root: undefined, dryRun: false, purge: false, rules: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const value = () => {
      const next = argv[++i];
      if (next === undefined || next.startsWith("--")) throw new Error(`${arg} needs a value`);
      return next;
    };
    if (arg === "--dir") options.dir = value();
    else if (arg === "--dest") options.dests.push(value());
    else if (arg === "--root") options.root = value();
    else if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--purge") options.purge = true;
    else if (arg === "--rules") options.rules = true;
    else throw new Error(`unknown argument: ${arg}`);
  }
  if (!options.dir) throw new Error("--dir is required");
  if (options.dests.length === 0) throw new Error("at least one --dest is required");
  for (const dest of options.dests) if (!DEST.test(dest)) throw new Error(`--dest must be "latest" or a version: ${dest}`);
  return options;
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

/** Every upload of the run: each build file under each destination, then the root file. */
export function plan({ dir, dests, root }) {
  const files = walk(dir).map((file) => ({ file, path: relative(dir, file).split(sep).join("/") }));
  if (!files.some((f) => f.path === "index.html")) throw new Error(`${dir} has no index.html: not a Storybook build`);
  const uploads = dests.flatMap((dest) =>
    files.map(({ file, path }) => ({ file, key: `${dest}/${path}`, contentType: contentTypeFor(path), cacheControl: cacheControlFor(path) })),
  );
  if (root) uploads.push({ file: root, key: basename(root), contentType: contentTypeFor(root), cacheControl: CACHE.entry });
  const unknown = uploads.filter((u) => !u.contentType).map((u) => u.key);
  if (unknown.length) throw new Error(`no Content-Type for: ${unknown.join(", ")} (add the extension to CONTENT_TYPES)`);
  return uploads;
}

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

/** fetch with retries: network errors, 429 and 5xx are retried with an exponential backoff; 4xx fail at once. */
export async function request(url, init, { attempts = ATTEMPTS, delay = 500, fetchImpl = fetch } = {}) {
  for (let attempt = 1; ; attempt++) {
    let failure;
    try {
      const response = await fetchImpl(url, init);
      if (response.ok) return response;
      failure = new Error(`${init.method} ${url} → ${response.status} ${await response.text().catch(() => "")}`.trim());
      if (response.status !== 429 && response.status < 500) throw Object.assign(failure, { final: true });
    } catch (error) {
      if (error.final) throw error;
      failure ??= error;
    }
    if (attempt >= attempts) throw failure;
    await sleep(delay * 2 ** (attempt - 1));
  }
}

export async function pool(items, limit, task) {
  let next = 0;
  const worker = async () => {
    while (next < items.length) await task(items[next++]);
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
}

function env(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

async function upload(uploads) {
  const key = env("BUNNY_STORAGE_KEY");
  const zone = env("BUNNY_STORAGE_ZONE");
  const host = process.env.BUNNY_STORAGE_HOST || "storage.bunnycdn.com";
  let done = 0;
  await pool(uploads, CONCURRENCY, async (u) => {
    const body = readFileSync(u.file);
    // Bunny Storage takes the body as octet-stream and serves the type from the extension (checked by plan()).
    const headers = {
      AccessKey: key,
      "Content-Type": "application/octet-stream",
      Checksum: createHash("sha256").update(body).digest("hex").toUpperCase(),
    };
    await request(`https://${host}/${zone}/${u.key}`, { method: "PUT", headers, body });
    if (++done % 50 === 0 || done === uploads.length) console.log(`uploaded ${done}/${uploads.length}`);
  });
}

async function syncRules() {
  const zoneId = env("BUNNY_PULLZONE_ID");
  const headers = { AccessKey: env("BUNNY_API_KEY"), "Content-Type": "application/json", Accept: "application/json" };
  const zone = await (await request(`https://api.bunny.net/pullzone/${zoneId}`, { method: "GET", headers })).json();
  for (const rule of edgeRules()) {
    const existing = (zone.EdgeRules ?? []).find((r) => r.Description === rule.Description);
    const body = JSON.stringify({ ...rule, ...(existing ? { Guid: existing.Guid } : {}) });
    await request(`https://api.bunny.net/pullzone/${zoneId}/edgerules/addOrUpdate`, { method: "POST", headers, body });
    console.log(`${existing ? "updated" : "added"} edge rule "${rule.Description}"`);
  }
}

async function purge() {
  const zoneId = env("BUNNY_PULLZONE_ID");
  await request(`https://api.bunny.net/pullzone/${zoneId}/purgeCache`, { method: "POST", headers: { AccessKey: env("BUNNY_API_KEY") } });
  console.log(`purged pull zone ${zoneId}`);
}

export async function main(argv) {
  const options = parseArgs(argv);
  if (!statSync(options.dir, { throwIfNoEntry: false })?.isDirectory()) throw new Error(`${options.dir} is not a directory`);
  const uploads = plan(options);
  if (options.dryRun) {
    for (const u of uploads) console.log(`PUT ${u.key}  ${statSync(u.file).size} B  ${u.contentType}  ${u.cacheControl}`);
    if (options.rules) for (const r of edgeRules()) console.log(`RULE ${r.Description}: ${JSON.stringify(r.Triggers)}`);
    if (options.purge) console.log("PURGE pull zone");
    const counts = Object.groupBy(uploads, (u) => u.cacheControl);
    console.log(`dry run: ${uploads.length} files to ${options.dests.join(", ")}${options.root ? " + root" : ""}`);
    for (const [policy, list] of Object.entries(counts)) console.log(`  ${list.length} × ${policy}`);
    return;
  }
  await upload(uploads);
  if (options.rules) await syncRules();
  if (options.purge) await purge();
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(`bunny-upload: ${error.message}`);
    process.exit(1);
  });
}
