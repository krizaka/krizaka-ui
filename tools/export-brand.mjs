#!/usr/bin/env node
// The brand exports of the Krizaka family and the default profile pictures, generated from the code of @krizaka/ui —
// never drawn by hand: the marks and logos (KrizakaLogo, OrazakaLogo, OrochiaLogo, YasakiaLogo, YororisLogo through
// ProductLogo) rendered to SVG and PNG, the avatar and social-preview images composed from them, and the default avatars
// of `@krizaka/ui/avatar` (defaultAvatarSvg) rendered to SVG and WebP. They are the media library of Bunny Storage:
//
//   brand/<brand>/…                       logo + mark, SVG, PNG 256/512/1024 on transparent, dark & light, avatar, social preview
//   brand/manifest.json                   every file with its size and SHA-256
//   people/defaults/v1/<brand>/…          the default profile pictures: person-<1-6>, plain-<1-6> × .svg / -256.webp / -512.webp
//   people/defaults/v1/manifest.json
//
//   pnpm turbo run build --filter=@krizaka/ui     # the exports read the built package
//   node tools/export-brand.mjs --out <dir>                             # write the files, nothing is sent
//   node tools/export-brand.mjs --out <dir> --upload --env-file <path>  # and send them to the storage zone
//
// Credentials (environment or --env-file, never printed): MEDIA_STORAGE_API_KEY, MEDIA_STORAGE_ZONE,
// MEDIA_STORAGE_ENDPOINT (default storage.bunnycdn.com), MEDIA_CDN_HOSTNAME. Names are stable (the library is "the latest
// logo"); the default avatars are versioned by folder (`v1`): a changed picture is a new folder, never an overwrite.
// The layout of the zone: krizaka-com scripts/bunny-layout.mjs, AGENTS.md §5.2.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const UI = resolve(HERE, "../packages/ui");
const TOKENS_CSS = resolve(HERE, "../packages/tokens/dist/tokens.css");

export const BRANDS = ["krizaka", "orazaka", "orochia", "yasakia", "yororis"];
export const THEMES = ["dark", "light"];
export const LOGO_SIZES = [256, 512, 1024];
export const AVATAR_SIZES = [500, 1024];
export const SOCIAL = { width: 1280, height: 640 };
/** The page behind the avatar and the social preview: the dark surface of the family. */
const INK = "#0d0d10";

// ---- pure helpers (tested) --------------------------------------------------------------------------------------

/** The `--kz-*` custom properties of a CSS block that starts with <selector> (the first one). */
export function tokensOf(css, selector) {
  const start = css.indexOf(`${selector} {`);
  if (start < 0) throw new Error(`tokens.css has no "${selector}" block`);
  const body = css.slice(start, css.indexOf("\n}", start));
  const out = {};
  for (const m of body.matchAll(/(--kz-[a-z0-9-]+):\s*([^;]+);/g)) out[m[1]] = m[2].trim();
  return out;
}

/** `hsl(240 4% 64%)` or `hsl(0 0% 100% / 0.10)` → `rgba(163, 163, 171, 1)`: what every SVG renderer reads. */
export function hslToRgba(value) {
  const m = /^hsla?\(\s*([\d.]+)(?:deg)?[\s,]+([\d.]+)%[\s,]+([\d.]+)%(?:\s*[/,]\s*([\d.]+)(%?))?\s*\)$/.exec(value.trim());
  if (!m) throw new Error(`not an hsl() colour: ${value}`);
  const h = Number(m[1]);
  const s = Number(m[2]) / 100;
  const l = Number(m[3]) / 100;
  const a = m[4] === undefined ? 1 : m[5] ? Number(m[4]) / 100 : Number(m[4]);
  const k = (n) => (n + h / 30) % 12;
  const f = (n) => Math.round(255 * (l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));
  return `rgba(${f(0)}, ${f(8)}, ${f(4)}, ${a})`;
}

/**
 * A mark as rendered by React, made standalone: the animation stylesheet goes, and each `var(--kz-x, fallback)` — the
 * host's token, which a file on a CDN does not have — becomes that token's value in the given theme.
 */
export function standalone(svg, tokens, size) {
  return svg
    .replace(/<style>[\s\S]*?<\/style>/g, "")
    .replace(/var\((--kz-[a-z0-9-]+),\s*color-mix\([^)]*\)\)/g, (_, name) => {
      if (!tokens[name]) throw new Error(`the theme has no ${name}`);
      return hslToRgba(tokens[name]);
    })
    .replace(/\s(?:width|height)="[^"]*"/g, "")
    .replace("<svg ", `<svg width="${size}" height="${size}" `)
    .replace(/ aria-hidden="true"/, "");
}

/**
 * The emblem alone, for the `mark` files: the logo's orbit and ring are cut by the crop into stray arcs at the corners,
 * so they go, and the viewBox gains a margin so a stroke never touches the edge of the image.
 */
export function emblem(svg, margin = 0.06) {
  return svg
    .replace(/<circle\b[^>]*\bstroke-dasharray="[^"]*"[^>]*\/>/g, "")
    .replace(/<circle\b[^>]*\bopacity="\.35"[^>]*\/>/g, "")
    .replace(/viewBox="([-\d.]+) ([-\d.]+) ([\d.]+) ([\d.]+)"/, (_, x, y, w, h) => {
      const [X, Y, W, H] = [x, y, w, h].map(Number);
      const mx = W * margin;
      const my = H * margin;
      return `viewBox="${+(X - mx).toFixed(2)} ${+(Y - my).toFixed(2)} ${+(W + 2 * mx).toFixed(2)} ${+(H + 2 * my).toFixed(2)}"`;
    });
}

/** The files of one brand folder, relative to `brand/<brand>/` (the contract of the library). */
export function brandFiles() {
  const files = [];
  for (const kind of ["logo", "mark"]) {
    for (const theme of THEMES) {
      files.push(`${kind}-${theme}.svg`);
      for (const size of LOGO_SIZES) files.push(`${kind}-${theme}-${size}.png`);
    }
  }
  for (const size of AVATAR_SIZES) files.push(`avatar-${size}.png`);
  files.push(`social-preview-${SOCIAL.width}x${SOCIAL.height}.png`);
  return files;
}

/** The files of one brand's default avatars, relative to `people/defaults/v1/<brand>/`. */
export function avatarFiles(kinds, sizes, tones) {
  const files = [];
  for (const kind of kinds) for (let t = 1; t <= tones; t++) files.push(`${kind}-${t}.svg`, ...sizes.map((s) => `${kind}-${t}-${s}.webp`));
  return files;
}

export const contentTypeOf = (name) => ({ svg: "image/svg+xml", png: "image/png", webp: "image/webp", json: "application/json" })[name.split(".").pop()] ?? "application/octet-stream";
const encodePath = (p) => p.split("/").map(encodeURIComponent).join("/");

/** Throws unless <path> is under one of the prefixes this script writes. */
export function assertWritable(path) {
  if (!/^(brand|people\/defaults\/v1)\/[a-z0-9-]+\/[A-Za-z0-9._-]+$|^(brand|people\/defaults\/v1)\/manifest\.json$/.test(path)) {
    throw new Error(`${path} is outside brand/ and people/defaults/v1/ — this script writes only those (see the Bunny layout)`);
  }
  return path;
}

// ---- rendering --------------------------------------------------------------------------------------------------

async function load() {
  const req = createRequire(join(UI, "package.json"));
  const react = req("react");
  const { renderToStaticMarkup } = req("react-dom/server");
  const ui = await import(pathToFileURL(join(UI, "dist/index.js")).href).catch(() => {
    throw new Error("packages/ui/dist is missing: run `pnpm turbo run build --filter=@krizaka/ui` first");
  });
  const avatar = await import(pathToFileURL(join(UI, "dist/avatar.js")).href);
  const sharp = (await import("sharp")).default;
  const css = readFileSync(TOKENS_CSS, "utf8");
  const version = JSON.parse(readFileSync(join(UI, "package.json"), "utf8")).version;
  return { react, renderToStaticMarkup, ProductLogo: ui.ProductLogo, avatar, sharp, version, themes: { dark: tokensOf(css, ":root, .theme-dark"), light: tokensOf(css, "html.light") } };
}

const sha = (buf) => createHash("sha256").update(buf).digest("hex");

/** All the files to publish: Map<path under the zone, Buffer>. */
export async function build() {
  const k = await load();
  const out = new Map();
  const png = (svg, w, h = w) => k.sharp(Buffer.from(svg), { density: 384 }).resize(w, h, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const markup = (brand, size) => k.renderToStaticMarkup(k.react.createElement(k.ProductLogo, { id: brand, size, animated: false }));

  for (const brand of BRANDS) {
    const dir = `brand/${brand}`;
    const svgs = {};
    for (const theme of THEMES) {
      svgs[`logo-${theme}`] = standalone(markup(brand, 400), k.themes[theme], 400); // ≥ 48 px: the whole logo, orbit and halo
      svgs[`mark-${theme}`] = standalone(emblem(markup(brand, 32)), k.themes[theme], 400); // < 48 px: the family's crop, the emblem alone
    }
    for (const [name, svg] of Object.entries(svgs)) {
      out.set(`${dir}/${name}.svg`, Buffer.from(`${svg}\n`));
      for (const size of LOGO_SIZES) out.set(`${dir}/${name}-${size}.png`, await png(svg, size));
    }
    // The avatar of an account (GitHub, npm, social): the mark on the family's dark surface, full-bleed square — the platform rounds it.
    const markDark = svgs["mark-dark"].replace(/^<svg /, '<svg x="15%" y="15%" ');
    const avatarSvg = (s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 100 100"><rect width="100" height="100" fill="${INK}"/>${markDark.replace(/<svg x="15%" y="15%" width="\d+" height="\d+"/, '<svg x="15" y="15" width="70" height="70"')}</svg>`;
    for (const s of AVATAR_SIZES) out.set(`${dir}/avatar-${s}.png`, await png(avatarSvg(s), s));
    // The social preview: the whole logo, large, on the dark surface lit by the brand's halo.
    const { width: W, height: H } = SOCIAL;
    const logo = svgs["logo-dark"].replace(/^<svg width="400" height="400"/, `<svg x="${(W - 600) / 2}" y="${(H - 600) / 2}" width="600" height="600"`);
    out.set(`${dir}/social-preview-${W}x${H}.png`, await png(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="${INK}"/>${logo}</svg>`, W, H));
  }

  const avatars = k.avatar;
  for (const brand of avatars.DEFAULT_AVATAR_BRANDS) {
    for (const kind of avatars.DEFAULT_AVATAR_KINDS) {
      for (let tone = 1; tone <= avatars.DEFAULT_AVATAR_TONES; tone++) {
        const svg = avatars.defaultAvatarSvg({ brand, kind, tone });
        out.set(`people/defaults/v1/${brand}/${avatars.defaultAvatarFile(kind, tone, "svg")}`, Buffer.from(`${svg}\n`));
        for (const size of avatars.DEFAULT_AVATAR_SIZES) {
          out.set(`people/defaults/v1/${brand}/${avatars.defaultAvatarFile(kind, tone, size)}`, await k.sharp(Buffer.from(svg), { density: 384 }).resize(size, size).webp({ quality: 92 }).toBuffer());
        }
      }
    }
  }

  for (const [root, label] of [["brand", "Brand marks, logos, avatars and social previews"], ["people/defaults/v1", "Default profile pictures"]]) {
    const files = [...out].filter(([p]) => p.startsWith(`${root}/`)).map(([p, b]) => ({ path: p, bytes: b.length, sha256: sha(b) }));
    out.set(`${root}/manifest.json`, Buffer.from(`${JSON.stringify({ about: label, generatedFrom: `@krizaka/ui@${k.version}`, source: "https://github.com/krizaka/krizaka-ui/blob/main/tools/export-brand.mjs", files }, null, 2)}\n`));
  }
  return { files: out, version: k.version };
}

// ---- storage ----------------------------------------------------------------------------------------------------

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
  const cfg = { key: env.MEDIA_STORAGE_API_KEY ?? "", zone: (env.MEDIA_STORAGE_ZONE ?? "").trim(), endpoint: host(env.MEDIA_STORAGE_ENDPOINT) || "storage.bunnycdn.com", pull: host(env.MEDIA_CDN_HOSTNAME) };
  if (!cfg.key || !cfg.zone) throw new Error("MEDIA_STORAGE_API_KEY and MEDIA_STORAGE_ZONE are required to upload");
  return cfg;
}

async function send(cfg, files) {
  const queue = [...files];
  const put = async ([path, body]) => {
    const res = await fetch(`https://${cfg.endpoint}/${encodeURIComponent(cfg.zone)}/${encodePath(assertWritable(path))}`, {
      method: "PUT",
      headers: { AccessKey: cfg.key, "Content-Type": contentTypeOf(path), Checksum: sha(body).toUpperCase() },
      body,
    });
    if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  };
  await Promise.all(Array.from({ length: 8 }, async () => { for (let f = queue.shift(); f; f = queue.shift()) await put(f); }));
  return files.size;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const argv = process.argv.slice(2);
  const outIndex = argv.indexOf("--out");
  if (outIndex < 0 || !argv[outIndex + 1]) {
    console.error("usage: node tools/export-brand.mjs --out <dir> [--upload --env-file <path>]");
    process.exit(2);
  }
  const outDir = resolve(argv[outIndex + 1]);
  const cfg = argv.includes("--upload") ? config(argv) : null;
  const { files, version } = await build();
  for (const [path, body] of files) {
    mkdirSync(dirname(join(outDir, path)), { recursive: true });
    writeFileSync(join(outDir, path), body);
  }
  console.log(`${files.size} file(s) from @krizaka/ui@${version} written to ${outDir}`);
  if (cfg) console.log(`${await send(cfg, files)} file(s) uploaded to ${cfg.pull || cfg.zone}`);
}
