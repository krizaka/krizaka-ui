#!/usr/bin/env node
// The central sets of default pictures of the Krizaka family — the single writer of `defaults/v1/` on Bunny (krizaka-com
// scripts/bunny-layout.mjs). Generated, never drawn by hand:
//
//   defaults/v1/<kind>/<id>-<size>.webp   <kind>: person · folder · organisation · shop (256, 512, 1024 square) · banner (960, 1920 wide)
//   defaults/v1/<kind>/<id>.svg           the sets drawn from the code (`defaultAvatarSvg` of @krizaka/ui): silhouette-1…6, folder-1…6, organisation-1…6, shop-1…6
//   defaults/v1/manifest.json             every file with its size and SHA-256 (no other field: nothing private is ever written)
//
// The folders', organisations' and shops' sets and the people's silhouettes are rendered from `packages/ui/src/avatar/default-avatar.ts`.
// The illustrated people and the banners come from the founder's set (a folder of `avatar-NN-<id>.png` and `banner-NN-<id>.png`): only the
// FILE NAMES of that folder are read, and only the PNG pictures — any other file in it holds private facts and is never opened, copied or sent.
// The catalogue the apps read — ids, alt texts in English and French, URLs — is the `defaults` section of the Krizaka org JSON
// (`@krizaka/org`, krizaka-ts); a new picture is a new id here and a line there, a changed picture is a new version folder (`v2`).
//
//   node tools/export-defaults.mjs --out <dir> [--founder <dir>]...                         # write the files, nothing is sent
//   node tools/export-defaults.mjs --out <dir> --founder <dir> --founder <dir> --upload --env-file <path> # and send them to the storage zone
//
// Credentials (environment or --env-file, never printed): MEDIA_STORAGE_API_KEY, MEDIA_STORAGE_ZONE, MEDIA_STORAGE_ENDPOINT.
import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { DEFAULT_AVATAR_TONES, defaultAvatarSvg } from "../packages/ui/src/avatar/default-avatar.ts";
import { config, send } from "./export-brand.mjs";

export const VERSION = "v1";
export const PREFIX = `defaults/${VERSION}`;
export const SQUARE_SIZES = [256, 512, 1024];
export const BANNER_WIDTHS = [960, 1920];
export const KINDS = ["person", "folder", "organisation", "shop", "banner"];
/** The family's own gradient: the central sets are the company's, not a product's. */
export const BRAND = "krizaka";
/** What the code draws: the kind of picture and its set's name (`folder-1`…). A person's silhouette is `silhouette-n`. */
export const DRAWN = [
  { kind: "person", name: "silhouette" },
  { kind: "folder", name: "folder" },
  { kind: "organisation", name: "organisation" },
  { kind: "shop", name: "shop" },
];

const sha = (buf) => createHash("sha256").update(buf).digest("hex");

// ---- pure helpers (tested) ----------------------------------------------------------------------------------------

/** A founder file name that would read as something else in the org JSON (« street » trips the no-address scan) is published under another id. */
export const ID_ALIASES = { "abstract-street-art": "abstract-stripes" };

/** The founder's pictures from the FILE NAMES of its folder: `avatar-01-boom-bap.png` → { kind: "person", id: "boom-bap" }. Only `.png` sources, only these patterns; anything else is ignored, unread. */
export function founderItems(names) {
  return names
    .flatMap((name) => {
      const m = /^(avatar|banner)-(\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)\.png$/.exec(name);
      return m ? [{ kind: m[1] === "avatar" ? "person" : "banner", id: ID_ALIASES[m[3]] ?? m[3], order: Number(m[2]), source: name }] : [];
    })
    .sort((a, b) => a.kind.localeCompare(b.kind) || a.order - b.order);
}

/** The ids of the sets drawn from the code: silhouette-1…6, folder-1…6, organisation-1…6, shop-1…6. */
export function drawnItems(tones = DEFAULT_AVATAR_TONES) {
  return DRAWN.flatMap(({ kind, name }) => Array.from({ length: tones }, (_, i) => ({ kind, id: `${name}-${i + 1}`, tone: i + 1 })));
}

/** The file of a picture: `person/boom-bap-512.webp`, `banner/the-neon-flamingo-1920.webp`, `folder/folder-2.svg`. */
export function fileOf(kind, id, size) {
  return `${kind}/${size === "svg" ? `${id}.svg` : `${id}-${size}.webp`}`;
}

/** Throws unless <path> is under the prefix this script writes: a kind folder with a picture, or the manifest. */
export function assertWritable(path) {
  const kinds = KINDS.join("|");
  if (!new RegExp(`^${PREFIX}/(?:(?:${kinds})/[a-z0-9]+(?:-[a-z0-9]+)*(?:\\.svg|-\\d+\\.webp)|manifest\\.json)$`).test(path)) {
    throw new Error(`${path} is outside ${PREFIX}/ — this script writes only the default sets (see the Bunny layout)`);
  }
  return path;
}

/** The manifest: paths, sizes and hashes of the files, and nothing else. */
export function manifestOf(files, uiVersion) {
  const list = [...files].filter(([p]) => p !== `${PREFIX}/manifest.json`).map(([path, body]) => ({ path, bytes: body.length, sha256: sha(body) }));
  return {
    about: "Default pictures of the Krizaka family (people, folders, organisations, shops, banners): generated, versioned, immutable. The catalogue is the `defaults` section of the Krizaka org JSON.",
    generatedFrom: `@krizaka/ui@${uiVersion}`,
    source: "https://github.com/krizaka/krizaka-ui/blob/main/tools/export-defaults.mjs",
    files: list,
  };
}

// ---- rendering ---------------------------------------------------------------------------------------------------

/** The files of the sets drawn from the code: an SVG and the square WebPs of each. */
async function drawnFiles(sharp, out) {
  for (const item of drawnItems()) {
    const svg = defaultAvatarSvg({ brand: BRAND, kind: item.kind, tone: item.tone });
    out.set(`${PREFIX}/${fileOf(item.kind, item.id, "svg")}`, Buffer.from(`${svg}\n`));
    for (const size of SQUARE_SIZES) out.set(`${PREFIX}/${fileOf(item.kind, item.id, size)}`, await sharp(Buffer.from(svg), { density: 384 }).resize(size, size).webp({ quality: 92 }).toBuffer());
  }
}

/** The WebPs of one picture of the founder's set: squares for a person, 3:1 widths for a banner. */
async function founderFiles(sharp, out, source, item) {
  const banner = item.kind === "banner";
  for (const size of banner ? BANNER_WIDTHS : SQUARE_SIZES) {
    const resize = banner ? { width: size, height: Math.round(size / 3), fit: "cover" } : { width: size, height: size, fit: "cover" };
    out.set(`${PREFIX}/${fileOf(item.kind, item.id, size)}`, await sharp(source).resize(resize).webp({ quality: banner ? 86 : 88 }).toBuffer());
  }
}

/** All the files: Map<path under the zone, Buffer>. `founderDirs` are optional (without them only the drawn sets are built). */
export async function build({ founderDirs = [] } = {}) {
  const sharp = (await import("sharp")).default;
  const out = new Map();
  const uiVersion = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../packages/ui/package.json"), "utf8")).version;
  await drawnFiles(sharp, out);
  for (const dir of founderDirs) {
    for (const item of founderItems(readdirSync(dir))) await founderFiles(sharp, out, readFileSync(join(dir, item.source)), item);
  }
  out.set(`${PREFIX}/manifest.json`, Buffer.from(`${JSON.stringify(manifestOf(out, uiVersion), null, 2)}\n`));
  return { files: out, version: uiVersion };
}

// ---- storage -----------------------------------------------------------------------------------------------------

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const argv = process.argv.slice(2);
  const args = (name) => argv.flatMap((a, i) => (a === name && argv[i + 1] ? [argv[i + 1]] : []));
  const arg = (name) => args(name)[0];
  if (!arg("--out")) {
    console.error("usage: node tools/export-defaults.mjs --out <dir> [--founder <dir>] [--upload --env-file <path>]");
    process.exit(2);
  }
  const outDir = resolve(arg("--out"));
  const cfg = argv.includes("--upload") ? config(argv) : null;
  const { files, version } = await build({ founderDirs: args("--founder").map((d) => resolve(d)) });
  for (const [path, body] of files) {
    mkdirSync(dirname(join(outDir, path)), { recursive: true });
    writeFileSync(join(outDir, path), body);
  }
  console.log(`${files.size} file(s) from @krizaka/ui@${version} written to ${outDir}`);
  if (cfg) console.log(`${await send(cfg, files, assertWritable)} file(s) uploaded to the storage zone`);
}
