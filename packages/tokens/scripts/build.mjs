#!/usr/bin/env node
// Compiles the DTCG sources (src/tokens/*.tokens.json) into dist/: tokens.css, index.js + .d.ts, native.js + .d.ts.
// Zero dependency. The functions are pure and exported for the tests; files are written only when run directly.
//
// Mode convention: `$value` is the dark value (the default); `$extensions["com.krizaka"].light` is the light value.
// A token without that extension is the same in both themes. CSS blocks:
//   `:root, .theme-dark` — themed tokens and aliases (a `var()` must be re-declared under `.theme-dark` to resolve
//                          against the dark values there);
//   `html.light`         — the light values;
//   `:root`              — the invariants: literal values identical in both themes (media overlays, statuses, radii…).

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { parseHsl, toNative } from "./color.mjs";

/** Source files, in output order. */
export const SOURCES = ["color", "radius", "shadow", "motion", "typography"];
const EXT = "com.krizaka";
const PREFIX = "--kz-";
const TYPES = new Set(["color", "dimension", "shadow", "cubicBezier", "fontFamily"]);

/**
 * @typedef {{ color: string, offsetX: string, offsetY: string, blur: string, spread?: string }} ShadowLayer
 * @typedef {string | number[] | string[] | ShadowLayer[]} RawValue
 * @typedef {{
 *   path: string[], name: string, key: string, type: string, description?: string, group?: string,
 *   dark: RawValue, light?: RawValue
 * }} Token
 */

/**
 * Reads the sources from a directory.
 * @param {string} dir
 * @returns {Record<string, unknown>}
 */
export function load(dir) {
  return Object.fromEntries(SOURCES.map((s) => [s, JSON.parse(readFileSync(join(dir, `${s}.tokens.json`), "utf8"))]));
}

/** @param {unknown} v @returns {v is Record<string, any>} */
const isObject = (v) => typeof v === "object" && v !== null && !Array.isArray(v);

/** `["accent", "$root"]` → `accent`; `["text", "on-media"]` → `text-on-media`. @param {string[]} path */
const cssName = (path) => path.filter((p) => p !== "$root").join("-");

/** `text-on-media` → `textOnMedia`, `surface-0` → `surface0`. @param {string} name */
export const camel = (name) => name.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

/** @param {RawValue} v @returns {v is string} */
const isAlias = (v) => typeof v === "string" && /^\{[^}]+\}$/.test(v);

/**
 * Flattens the DTCG tree into tokens, in source order. Groups pass `$type` down; a group's `$description` becomes the
 * heading comment of its tokens (emitted once per run of the same group inside a CSS block).
 * @param {Record<string, unknown>} sources
 * @returns {Token[]}
 */
export function flatten(sources) {
  /** @type {Token[]} */
  const out = [];
  /**
   * @param {Record<string, any>} node
   * @param {string[]} path
   * @param {string | undefined} type
   * @param {string} file
   */
  const walk = (node, path, type, file, group = /** @type {string | undefined} */ (undefined)) => {
    const ownType = node.$type ?? type;
    if ("$value" in node) {
      if (!ownType || !TYPES.has(ownType)) throw new Error(`${file}: ${path.join(".")} has no supported $type`);
      const name = cssName(path);
      const ext = isObject(node.$extensions) ? node.$extensions[EXT] : undefined;
      out.push({ path, name, key: camel(name), type: ownType, description: node.$description, group, dark: node.$value, light: ext?.light });
      return;
    }
    const heading = path.length > 0 && typeof node.$description === "string" ? node.$description : group;
    for (const [k, child] of Object.entries(node)) {
      if (k.startsWith("$") && k !== "$root") continue;
      if (!isObject(child)) throw new Error(`${file}: ${[...path, k].join(".")} is neither a token nor a group`);
      walk(child, [...path, k], ownType, file, heading);
    }
  };
  for (const [file, tree] of Object.entries(sources)) {
    if (!isObject(tree)) throw new Error(`${file}: not a DTCG object`);
    walk(tree, [], undefined, file);
  }
  const seen = new Set();
  for (const t of out) {
    if (seen.has(t.name)) throw new Error(`Duplicate token ${PREFIX}${t.name}`);
    seen.add(t.name);
  }
  return out;
}

/**
 * Validates aliases and mode values; returns a resolver from a token to its raw (alias-free) value.
 * @param {Token[]} tokens
 */
export function resolver(tokens) {
  const byPath = new Map(tokens.map((t) => [t.path.join("."), t]));
  /** @param {string} alias */
  const target = (alias) => {
    const t = byPath.get(alias.slice(1, -1));
    if (!t) throw new Error(`Unknown alias ${alias}`);
    return t;
  };
  for (const t of tokens) {
    if (isAlias(t.dark) && t.light !== undefined) throw new Error(`${PREFIX}${t.name}: an alias follows its target's modes`);
    if (isAlias(t.dark) && target(t.dark).type !== t.type) throw new Error(`${PREFIX}${t.name}: alias of another type`);
    if (t.type !== "color") continue;
    for (const v of [t.dark, t.light]) {
      if (v === undefined || isAlias(v)) continue;
      if (typeof v !== "string") throw new Error(`${PREFIX}${t.name}: a colour is an hsl() string`);
      parseHsl(v);
    }
  }
  /**
   * @param {Token} t
   * @param {"dark" | "light"} mode
   * @returns {RawValue}
   */
  const resolve = (t, mode, depth = 0) => {
    if (depth > 8) throw new Error(`${PREFIX}${t.name}: alias cycle`);
    if (isAlias(t.dark)) return resolve(target(t.dark), mode, depth + 1);
    return mode === "light" && t.light !== undefined ? t.light : t.dark;
  };
  return { resolve, target };
}

/** @param {string} family */
const quoteFamily = (family) => (/\s/.test(family) ? `"${family}"` : family);

/**
 * A raw value as CSS; an alias becomes `var(--kz-…)`.
 * @param {string} type
 * @param {RawValue} v
 * @param {(alias: string) => Token} target
 * @returns {string}
 */
function css(type, v, target) {
  if (isAlias(v)) return `var(${PREFIX}${target(v).name})`;
  switch (type) {
    case "shadow":
      return /** @type {ShadowLayer[]} */ (v)
        .map((l) => [l.offsetX, l.offsetY, l.blur, l.spread && l.spread !== "0" && l.spread !== "0px" ? l.spread : "", l.color].filter(Boolean).join(" "))
        .join(", ");
    case "cubicBezier":
      return `cubic-bezier(${/** @type {number[]} */ (v).join(", ")})`;
    case "fontFamily":
      return /** @type {string[]} */ (v).map(quoteFamily).join(", ");
    default:
      return String(v);
  }
}

/**
 * @param {Token[]} tokens
 * @param {string} selector
 * @param {string | null} scheme
 * @param {(t: Token) => RawValue} pick
 * @param {(alias: string) => Token} target
 * @param {string} intro
 */
function block(tokens, selector, scheme, pick, target, intro) {
  const lines = [intro, `${selector} {`];
  if (scheme) lines.push(`  color-scheme: ${scheme};`);
  tokens.forEach((t, i) => {
    if (t.group && t.group !== tokens[i - 1]?.group) lines.push(`${i > 0 || scheme ? "\n" : ""}  /* ${t.group} */`);
    const comment = t.description && !t.group?.startsWith(t.description) ? ` /* ${t.description} */` : "";
    lines.push(`  ${PREFIX}${t.name}: ${css(t.type, pick(t), target)};${comment}`);
  });
  lines.push("}");
  return lines.join("\n");
}

/**
 * Builds every output from the sources.
 * @param {Record<string, unknown>} sources
 */
export function compile(sources) {
  const tokens = flatten(sources);
  const { resolve, target } = resolver(tokens);
  const themed = tokens.filter((t) => t.light !== undefined || isAlias(t.dark));
  const light = tokens.filter((t) => t.light !== undefined);
  const invariant = tokens.filter((t) => !themed.includes(t));
  /** @param {Token[]} list */
  const plain = (list) => list.map((t) => ({ ...t, group: undefined }));

  const tokensCss = [
    "/* @krizaka/tokens — GÉNÉRÉ depuis src/tokens/*.tokens.json par scripts/build.mjs : ne pas éditer. */",
    "",
    block(themed, ":root, .theme-dark", "dark", (t) => t.dark, target,
      "/* Dark : la valeur par défaut. `.theme-dark` reprend exactement les mêmes valeurs : un lecteur, un éditeur ou un\n   média reste sombre dans les deux thèmes sans une seule classe `light:` dans son sous-arbre. */"),
    "",
    block(plain(light), "html.light", "light", (t) => /** @type {RawValue} */ (t.light), target, "/* Light. */"),
    "",
    block(invariant, ":root", null, (t) => t.dark, target,
      "/* Invariants : identiques dans les deux thèmes. Tout ce qui se pose SUR un média les utilise. */"),
    "",
  ].join("\n");

  // index — CSS references and raw values (aliases resolved), keyed in camelCase.
  const refs = Object.fromEntries(tokens.map((t) => [t.key, `var(${PREFIX}${t.name})`]));
  /** @param {"dark" | "light"} mode */
  const raw = (mode) => Object.fromEntries(tokens.map((t) => [t.key, css(t.type, resolve(t, mode), target)]));
  const values = { dark: raw("dark"), light: raw("light") };
  const header = "// @krizaka/tokens — GÉNÉRÉ depuis src/tokens/*.tokens.json par scripts/build.mjs : ne pas éditer.\n";
  /** @param {unknown} o */
  const json = (o) => JSON.stringify(o, null, 2);
  /** @param {Record<string, string | number>} o @param {string} indent */
  const literalType = (o, indent = "  ") =>
    `{\n${Object.entries(o).map(([k, v]) => `${indent}readonly ${/^[a-z_$][\w$]*$/i.test(k) ? k : json(k)}: ${json(v)};`).join("\n")}\n${indent.slice(2)}}`;
  /** @param {Record<string, unknown>} o @param {string} indent */
  const stringType = (o, indent = "  ") => `{\n${Object.keys(o).map((k) => `${indent}readonly ${k}: string;`).join("\n")}\n${indent.slice(2)}}`;

  const indexJs = `${header}
/** Every token as a CSS reference, \`var(--kz-…)\`: follows the active theme. */
export const tokens = Object.freeze(${json(refs)});

/** The raw CSS values per theme (aliases resolved), for canvas, charts and e-mails. */
export const values = Object.freeze({ dark: Object.freeze(${json(values.dark)}), light: Object.freeze(${json(values.light)}) });
`;
  const indexDts = `${header}
/** Every token as a CSS reference, \`var(--kz-…)\`: follows the active theme. */
export declare const tokens: ${literalType(refs)};
/** A token's camelCase name. */
export type TokenName = keyof typeof tokens;
/** Raw CSS values of one theme. */
export type TokenValues = { readonly [K in TokenName]: string };
/** The raw CSS values per theme (aliases resolved), for canvas, charts and e-mails. */
export declare const values: { readonly dark: TokenValues; readonly light: TokenValues };
`;

  // native — resolved colours (hex, rgba when translucent), radii in dp, the first font family, the easing curve.
  const colors = tokens.filter((t) => t.type === "color");
  /** @param {"dark" | "light"} mode */
  const theme = (mode) =>
    Object.fromEntries(colors.map((t) => [t.key, toNative(parseHsl(/** @type {string} */ (resolve(t, mode))))]));
  /**
   * @template {string | number} V
   * @param {string} group
   * @param {(t: Token) => V} map
   * @returns {Record<string, V>}
   */
  const byGroup = (group, map) =>
    Object.fromEntries(tokens.filter((t) => t.path[0] === group).map((t) => [camel(cssName(t.path.slice(1))), map(t)]));
  const radius = byGroup("radius", (t) => {
    const v = /** @type {string} */ (resolve(t, "dark"));
    if (!/^\d+(\.\d+)?px$/.test(v)) throw new Error(`${PREFIX}${t.name}: native radius needs px`);
    return Number.parseFloat(v);
  });
  const typography = byGroup("font", (t) => /** @type {string[]} */ (resolve(t, "dark"))[0]);
  const ease = /** @type {Token} */ (tokens.find((t) => t.name === "ease"));
  const motion = { ease: resolve(ease, "dark") };
  const dark = theme("dark");

  const nativeJs = `${header}
/** Colour roles per theme, resolved for React Native (\`#rrggbb\`, \`rgba()\` when translucent). */
export const themes = Object.freeze({ dark: Object.freeze(${json(dark)}), light: Object.freeze(${json(theme("light"))}) });

/** Corner radii, in dp. */
export const radius = Object.freeze(${json(radius)});

/** Font families: the first family of each web stack (React Native takes a single name). */
export const typography = Object.freeze(${json(typography)});

/** Motion: the cubic-bezier control points (\`Easing.bezier(...motion.ease)\`). */
export const motion = Object.freeze({ ease: Object.freeze(${JSON.stringify(motion.ease)}) });
`;
  const nativeDts = `${header}
/** The colour roles of one theme. */
export type Theme = ${stringType(dark)};
export type ThemeName = "dark" | "light";
/** Colour roles per theme, resolved for React Native (\`#rrggbb\`, \`rgba()\` when translucent). */
export declare const themes: { readonly dark: Theme; readonly light: Theme };
/** Corner radii, in dp. */
export declare const radius: ${literalType(radius)};
/** Font families: the first family of each web stack (React Native takes a single name). */
export declare const typography: ${literalType(typography)};
/** Motion: the cubic-bezier control points (\`Easing.bezier(...motion.ease)\`). */
export declare const motion: { readonly ease: readonly [number, number, number, number] };
`;

  return {
    tokens,
    files: { "tokens.css": tokensCss, "index.js": indexJs, "index.d.ts": indexDts, "native.js": nativeJs, "native.d.ts": nativeDts },
  };
}

/**
 * Writes the outputs.
 * @param {Record<string, string>} files
 * @param {string} outDir
 */
export function write(files, outDir) {
  mkdirSync(outDir, { recursive: true });
  for (const [name, content] of Object.entries(files)) writeFileSync(join(outDir, name), content);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const { tokens, files } = compile(load(join(root, "src/tokens")));
  write(files, join(root, "dist"));
  console.log(`@krizaka/tokens: ${tokens.length} tokens → dist/{${Object.keys(files).join(",")}}`);
}
