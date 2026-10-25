#!/usr/bin/env node
// Compiles the DTCG sources (src/tokens/*.tokens.json) into dist/: tokens.css, index.js + .d.ts, native.js + .d.ts.
// Zero dependency. The functions are pure and exported for the tests; files are written only when run directly.
//
// Mode convention: `$value` is the dark value (the default); `$extensions["com.krizaka"].light` is the light value.
// A token without that extension is the same in both themes. CSS blocks:
//   `:root, .theme-dark` — themed tokens and aliases (a `var()` must be re-declared under `.theme-dark` to resolve
//                          against the dark values there);
//   `html.light`         — the light values;
//   `.theme-light`       — the light values and the aliases, for a subtree that stays light inside a dark page (a
//                          theme preview) — the counterpart of `.theme-dark`. A separate block: re-declaring the
//                          aliases on `html.light` would override a product's `:root` overrides (html.light wins);
//   `:root`              — the invariants: literal values identical in both themes (media overlays, statuses, radii…).

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { appearanceCss, appearanceModule, compileAppearance, parseColor } from "./appearance.mjs";
import { parseHsl, toNative } from "./color.mjs";

/** Source files, in output order. */
export const SOURCES = ["color", "radius", "shadow", "material", "motion", "typography"];
/** The brands (src/brands/<id>.brand.json), in output order: the parent first. */
export const BRANDS = ["krizaka", "orazaka", "orochia", "yasakia", "yororis", "yomizaka", "kachizaka", "akinaza"];
/** The roles a brand sets — all of them, so that a brand never inherits another brand's accent. */
export const BRAND_ROLES = ["accent", "accent-hover", "accent-soft", "accent-text", "accent-2", "on-accent", "ring", "info", "info-text", "brand-gradient-from", "brand-gradient-via", "brand-gradient-to"];
const EXT = "com.krizaka";
const PREFIX = "--kz-";
const TYPES = new Set(["color", "dimension", "shadow", "cubicBezier", "fontFamily", "number", "fontWeight", "duration", "cornerShape", "fontVariantNumeric"]);

/**
 * @typedef {{ color: string, offsetX: string, offsetY: string, blur: string, spread?: string }} ShadowLayer
 * @typedef {string | number[] | string[] | ShadowLayer[]} RawValue
 * @typedef {{
 *   path: string[], name: string, key: string, type: string, description?: string, group?: string,
 *   dark: RawValue, light?: RawValue, compact?: string
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
      const compact = ext?.compact;
      if (compact !== undefined && (ownType !== "dimension" || typeof compact !== "string")) throw new Error(`${file}: ${path.join(".")}: a compact value is a dimension`);
      out.push({ path, name, key: camel(name), type: ownType, description: node.$description, group, dark: node.$value, light: ext?.light, compact });
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
 * `[data-density="compact"]`: the tokens that carry a compact value (`$extensions["com.krizaka"].compact`), tightened on a
 * subtree — a dense table, an admin console. Empty when no token has one.
 * @param {Token[]} tokens
 */
function densityBlock(tokens) {
  const dense = tokens.filter((t) => t.compact !== undefined);
  if (!dense.length) return [];
  return [
    "/* Densité compacte : [data-density=\"compact\"] sur un sous-arbre resserre les contrôles (tableau dense, console). */",
    `[data-density="compact"] {\n${dense.map((t) => `  ${PREFIX}${t.name}: ${t.compact};`).join("\n")}\n}`,
    "",
  ];
}

/**
 * Under `prefers-reduced-motion: reduce` every duration token is 0 ms: a micro-interaction becomes instant.
 * @param {Token[]} tokens
 */
function reducedMotionBlock(tokens) {
  const durations = tokens.filter((t) => t.type === "duration");
  if (!durations.length) return [];
  return [
    "/* Mouvement réduit : les micro-interactions deviennent instantanées. */",
    `@media (prefers-reduced-motion: reduce) {\n  :root {\n${durations.map((t) => `    ${PREFIX}${t.name}: 0ms;`).join("\n")}\n  }\n}`,
    "",
  ];
}

/** The roles of the type scale: the family a step is set in (`--kz-font-display`, `--kz-font-text`, `--kz-font-mono`). */
export const TYPE_ROLES = ["display", "text", "mono"];

/**
 * The type scale (`type.<step>` of typography.tokens.json): each step's size, line height, weight and tracking, and the
 * role whose family sets it (`$extensions["com.krizaka"].role`). Every step has the four values, a description and a role.
 * @param {Record<string, unknown>} sources
 */
export function typeScale(sources) {
  const tree = /** @type {Record<string, any>} */ (sources.typography)?.type;
  if (!isObject(tree)) return [];
  return Object.entries(tree)
    .filter(([k]) => !k.startsWith("$"))
    .map(([name, step]) => {
      const role = step.$extensions?.[EXT]?.role;
      if (!TYPE_ROLES.includes(role)) throw new Error(`type.${name}: $extensions["${EXT}"].role must be one of ${TYPE_ROLES.join(", ")}`);
      if (typeof step.$description !== "string") throw new Error(`type.${name}: no $description`);
      for (const k of ["size", "line-height", "weight", "tracking"]) if (!isObject(step[k]) || !("$value" in step[k])) throw new Error(`type.${name}: no ${k}`);
      const size = String(step.size.$value);
      const tracking = String(step.tracking.$value);
      if (!/^\d+(\.\d+)?px$/.test(size)) throw new Error(`type.${name}: the size is in px`);
      if (!/^-?\d+(\.\d+)?em$/.test(tracking)) throw new Error(`type.${name}: the tracking is in em`);
      return {
        name,
        role,
        description: step.$description,
        size,
        lineHeight: Number(step["line-height"].$value),
        weight: Number(step.weight.$value),
        tracking,
      };
    });
}

/**
 * Builds every output from the sources.
 * @param {Record<string, unknown>} sources
 */
export function compile(sources, brandSources = {}, appearanceSource = null) {
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
    block(plain(themed), ".theme-light", "light", (t) => /** @type {RawValue} */ (t.light ?? t.dark), target,
      "/* `.theme-light` : les valeurs claires, alias compris, sur un sous-arbre — un aperçu reste clair dans une page\n   sombre (pendant de `.theme-dark`). */"),
    "",
    block(invariant, ":root", null, (t) => t.dark, target,
      "/* Invariants : identiques dans les deux thèmes. Tout ce qui se pose SUR un média les utilise. */"),
    "",
    ...densityBlock(tokens),
    ...reducedMotionBlock(tokens),
  ].join("\n");

  // index — CSS references and raw values (aliases resolved), keyed in camelCase.
  const refs = Object.fromEntries(tokens.map((t) => [t.key, `var(${PREFIX}${t.name})`]));
  /** @param {"dark" | "light"} mode */
  const raw = (mode) => Object.fromEntries(tokens.map((t) => [t.key, css(t.type, resolve(t, mode), target)]));
  const values = { dark: raw("dark"), light: raw("light") };
  const header = "// @krizaka/tokens — GÉNÉRÉ depuis src/tokens/*.tokens.json par scripts/build.mjs : ne pas éditer.\n";
  const scale = typeScale(sources);
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

/** The type scale: each step's role (the family), size, line height, weight and tracking — \`text-<name>\` in @krizaka/tailwind. */
export const typeScale = Object.freeze(${json(scale)});
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
/** The role of a step of the type scale: the family it is set in. */
export type TypeRole = "display" | "text" | "mono";
/** A step of the type scale. */
export interface TypeStep {
  readonly name: ${scale.map((t) => json(t.name)).join(" | ") || "string"};
  readonly role: TypeRole;
  readonly description: string;
  /** \`72px\`. */
  readonly size: string;
  /** Unitless: \`1.05\`. */
  readonly lineHeight: number;
  readonly weight: number;
  /** \`-0.03em\`. */
  readonly tracking: string;
}
/** The type scale: each step's role (the family), size, line height, weight and tracking — \`text-<name>\` in @krizaka/tailwind. */
export declare const typeScale: readonly TypeStep[];
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
  const spring = tokens.find((t) => t.name === "ease-spring");
  /** @type {Record<string, number>} */
  const durations = Object.fromEntries(
    tokens.filter((t) => t.type === "duration").map((t) => [camel(cssName(t.path.slice(1))), Number.parseFloat(String(resolve(t, "dark")))]),
  );
  const motion = { ease: resolve(ease, "dark"), spring: spring ? resolve(spring, "dark") : resolve(ease, "dark"), duration: durations };
  const nativeScale = Object.fromEntries(scale.map((t) => {
    const size = Number.parseFloat(t.size);
    return [camel(t.name), { role: t.role, fontSize: size, lineHeight: Math.round(size * t.lineHeight), fontWeight: String(t.weight), letterSpacing: Math.round(size * Number.parseFloat(t.tracking) * 100) / 100 }];
  }));
  const dark = theme("dark");
  // Shadows as React Native `boxShadow` strings (RN ≥ 0.76, the new architecture; react-native-web passes them to CSS):
  // the same ink-tinted layers as the web, per theme, colours resolved to rgba().
  const shadowTokens = tokens.filter((t) => t.type === "shadow");
  /** @param {"dark" | "light"} mode */
  const nativeShadows = (mode) =>
    Object.fromEntries(
      shadowTokens.map((t) => [
        camel(cssName(t.path.slice(1))),
        /** @type {ShadowLayer[]} */ (resolve(t, mode))
          .map((l) => [l.offsetX, l.offsetY, l.blur, l.spread ?? "0", toNative(parseHsl(l.color))].join(" "))
          .join(", "),
      ]),
    );
  const cutSize = tokens.find((t) => t.name === "cut-size");
  const cut = { size: cutSize ? Number.parseFloat(String(resolve(cutSize, "dark"))) : 10 };

  const nativeJs = `${header}
/** Colour roles per theme, resolved for React Native (\`#rrggbb\`, \`rgba()\` when translucent). */
export const themes = Object.freeze({ dark: Object.freeze(${json(dark)}), light: Object.freeze(${json(theme("light"))}) });

/** Corner radii, in dp. */
export const radius = Object.freeze(${json(radius)});

/** Font families: the first family of each web stack (React Native takes a single name). */
export const typography = Object.freeze(${json(typography)});

/**
 * Motion: the cubic-bezier control points (\`Easing.bezier(...motion.ease)\`), the short spring of what answers the hand
 * (\`motion.spring\`) and the micro-interaction durations in ms (\`motion.duration.fast\`) — 0 when the system reduces motion.
 */
export const motion = Object.freeze({ ease: Object.freeze(${JSON.stringify(motion.ease)}), spring: Object.freeze(${JSON.stringify(motion.spring)}), duration: Object.freeze(${JSON.stringify(motion.duration)}) });

/**
 * The type scale in dp: fontSize, lineHeight and letterSpacing absolute (React Native has no em), fontWeight as a string,
 * and the role whose family sets it — with @krizaka/fonts: \`{ ...typeScale.bodyMd, fontFamily: fontFamily(role, weight) }\`.
 */
export const typeScale = Object.freeze(${json(nativeScale)});

/**
 * The shadows per theme as React Native \`boxShadow\` strings (RN ≥ 0.76): \`raised\` (a button, a card), \`floating\`
 * (a menu, a popover), \`overlay\` (a sheet, a toast) — ink-tinted, several layers, as on the web.
 */
export const shadows = Object.freeze({ dark: Object.freeze(${json(nativeShadows("dark"))}), light: Object.freeze(${json(nativeShadows("light"))}) });

/** The griffe (BRAND.md §6.1): the size of the 45° cut corner of a control, in dp. */
export const cut = Object.freeze(${json(cut)});
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
/** Motion: the ease and the spring (cubic-bezier control points) and the micro-interaction durations, in ms. */
export declare const motion: {
  readonly ease: readonly [number, number, number, number];
  readonly spring: readonly [number, number, number, number];
  readonly duration: ${literalType(motion.duration)};
};
/** A step of the type scale, in dp. */
export interface NativeTypeStep {
  readonly role: "display" | "text" | "mono";
  readonly fontSize: number;
  readonly lineHeight: number;
  readonly fontWeight: "400" | "500" | "600" | "700" | "800";
  readonly letterSpacing: number;
}
/** The type scale in dp (React Native): fontSize, lineHeight and letterSpacing absolute, the role whose family sets it. */
export declare const typeScale: { readonly [K in ${Object.keys(nativeScale).map((k) => json(k)).join(" | ") || "string"}]: NativeTypeStep };
/** The shadows of one theme, as React Native \`boxShadow\` strings. */
export type Shadows = ${stringType(nativeShadows("dark"))};
/** The shadows per theme as React Native \`boxShadow\` strings (RN ≥ 0.76). */
export declare const shadows: { readonly dark: Shadows; readonly light: Shadows };
/** The griffe: the size of the 45° cut corner of a control, in dp. */
export declare const cut: { readonly size: number };
`;

  const brands = compileBrands(tokens, brandSources);
  const brandsJs = brands.ids.length
    ? `\n/** The brand themes: the accent family of each Krizaka brand, raw CSS per theme (aliases resolved). */
export const brands = Object.freeze(${json(brands.values)});
/** The marks' emblem gradients: [offset, colour] stops, the same in both themes (raw CSS). */
export const marks = Object.freeze(${json(brands.marks)});\n`
    : "";
  const brandsDts = `\n/** A Krizaka brand. */
export type BrandId = ${brands.ids.length ? brands.ids.map((b) => json(b)).join(" | ") : "never"};
/** The roles a brand theme sets. */
export type BrandRole = ${BRAND_ROLES.map((r) => json(camel(r))).join(" | ")};
/** The brand themes: the accent family of each Krizaka brand, raw CSS per theme (aliases resolved). */
export declare const brands: { readonly [B in BrandId]: { readonly dark: { readonly [R in BrandRole]: string }; readonly light: { readonly [R in BrandRole]: string } } };
/** A gradient stop of a mark: [offset, colour]. */
export type MarkStop = readonly [offset: string, color: string];
/** The marks' emblem gradients: [offset, colour] stops, the same in both themes (raw CSS). */
export declare const marks: { readonly [B in BrandId]: readonly MarkStop[] };\n`;
  const brandsNativeJs = brands.ids.length
    ? `\n/** The brand themes as ThemeProvider overrides (\`overrides={brands.orazaka}\`): the accent family per theme. */
export const brands = Object.freeze(${json(brands.native)});
/** The marks' emblem gradients: [offset, #rrggbb] stops, the same in both themes. */
export const marks = Object.freeze(${json(brands.marksNative)});\n`
    : "";
  const brandsNativeDts = `\n/** A Krizaka brand. */
export type BrandId = ${brands.ids.length ? brands.ids.map((b) => json(b)).join(" | ") : "never"};
/** The colour roles a brand theme sets, per theme. */
export type BrandTheme = { readonly dark: { readonly [R in ${BRAND_ROLES.map((r) => json(camel(r))).join(" | ")}]: string }; readonly light: { readonly [R in ${BRAND_ROLES.map((r) => json(camel(r))).join(" | ")}]: string } };
/** The brand themes as ThemeProvider overrides (\`overrides={brands.orazaka}\`): the accent family per theme. */
export declare const brands: { readonly [B in BrandId]: BrandTheme };
/** A gradient stop of a mark: [offset, #rrggbb]. */
export type MarkStop = readonly [offset: string, color: string];
/** The marks' emblem gradients: [offset, #rrggbb] stops, the same in both themes. */
export declare const marks: { readonly [B in BrandId]: readonly MarkStop[] };\n`;

  // Every frozen constant is pure: a bundler drops the ones an app does not import (a mark needs `marks`, not `themes`).
  /** @param {string} js */
  const pure = (js) => js.replaceAll("Object.freeze(", "/* @__PURE__ */ Object.freeze(");
  const appearance = appearanceSource && brands.ids.length ? compileAppearance(appearanceSource, brands.values) : null;
  const appearanceMod = appearance ? appearanceModule(appearance) : { js: "", dts: "" };
  // The same data for React Native: hex colours, the brands' native families.
  const appearanceNative = appearance
    ? {
        ...appearance,
        themes: appearance.themes.map((/** @type {any} */ t) => ({ ...t, preview: t.preview && Object.fromEntries(Object.entries(t.preview).map(([k, v]) => [k, toNative(parseColor(v))])) })),
        accents: appearance.accents.map((/** @type {any} */ a) => ({ id: a.id, ...brands.native[a.id] })),
      }
    : null;
  /** @type {Record<string, string>} */
  const files = {
    "tokens.css": tokensCss,
    "index.js": pure(indexJs + brandsJs + appearanceMod.js),
    "index.d.ts": indexDts + brandsDts + appearanceMod.dts,
    "native.js": pure(nativeJs + brandsNativeJs + (appearanceNative ? `\n/** Appearance (ADR-006 §4): the themes with their miniature's colours, the accents per theme, what each reads on, the densities. */\nexport const appearance = Object.freeze(${json(appearanceNative)});\n` : "")),
    "native.d.ts": nativeDts + brandsNativeDts + (appearance ? `\n${appearanceMod.dts.replace(/export type AppearanceThemeId[\s\S]*?export declare const appearance: \{[\s\S]*?\n\};\n/, nativeAppearanceDts(appearance))}` : ""),
    ...(appearance ? { "appearance.css": appearanceCss(appearanceSource, appearance) } : {}),
    ...brands.css,
  };
  return { tokens, brands: brands.ids, files };
}

/**
 * Compiles the brand themes. A brand is a DTCG file of colour tokens that must set exactly the accent family
 * (BRAND_ROLES) of the platform's tokens; its aliases point inside the brand, or to a platform token the brand does
 * not set (`brand-gradient-to` → `{surface.0}`: the section ends on the page surface, whatever the app makes of it). Outputs, per brand, `brands/<id>.css`
 * (the app's theme: the same selectors as tokens.css, imported after it) and one `brands/scoped.css` (every brand as a
 * `.brand-<id>` class, for a page that shows several brands: the site, the catalogue). A brand also carries its mark's
 * emblem gradient (`$extensions["com.krizaka"].mark`: [offset, hsl()] stops, one value for both themes) → `marks`.
 * @param {Token[]} base
 * @param {Record<string, unknown>} brandSources
 */
export function compileBrands(base, brandSources) {
  const roles = new Set(BRAND_ROLES);
  const baseNames = new Map(base.map((t) => [t.name, t]));
  /** @type {Record<string, string>} */
  const css = {};
  /** @type {Record<string, { dark: Record<string, string>, light: Record<string, string> }>} */
  const values = {};
  /** @type {Record<string, { dark: Record<string, string>, light: Record<string, string> }>} */
  const native = {};
  /** @type {Record<string, [string, string][]>} */
  const marks = {};
  /** @type {Record<string, [string, string][]>} */
  const marksNative = {};
  const ids = Object.keys(brandSources);
  /** @type {string[]} */
  const scoped = ["/* @krizaka/tokens — GÉNÉRÉ depuis src/brands/*.brand.json par scripts/build.mjs : ne pas éditer.\n   Chaque marque en classe `.brand-<id>` : pour une page qui montre plusieurs marques (le site, le catalogue). */"];
  for (const id of ids) {
    const tokens = flatten({ [id]: brandSources[id] });
    for (const t of tokens) {
      if (!baseNames.has(t.name)) throw new Error(`brand ${id}: ${PREFIX}${t.name} is not a platform token`);
      if (t.type !== "color" || baseNames.get(t.name)?.type !== "color") throw new Error(`brand ${id}: ${PREFIX}${t.name} is not a colour`);
      if (!roles.has(t.name)) throw new Error(`brand ${id}: ${PREFIX}${t.name} is not a brand role (${BRAND_ROLES.join(", ")})`);
    }
    const missing = BRAND_ROLES.filter((r) => !tokens.some((t) => t.name === r));
    if (missing.length) throw new Error(`brand ${id}: missing ${missing.map((r) => PREFIX + r).join(", ")}`);
    const own = new Set(tokens.map((t) => t.name));
    const { resolve, target } = resolver([...tokens, ...base.filter((t) => !own.has(t.name))]);
    const ordered = BRAND_ROLES.map((r) => /** @type {Token} */ (tokens.find((t) => t.name === r)));
    /** @param {"dark" | "light"} mode @param {boolean} aliases */
    const decls = (mode, aliases) =>
      ordered
        .filter((t) => aliases || !isAlias(t.dark))
        .map((t) => `  ${PREFIX}${t.name}: ${isAlias(t.dark) ? `var(${PREFIX}${target(/** @type {string} */ (t.dark)).name})` : String(mode === "light" ? (t.light ?? t.dark) : t.dark)};`)
        .join("\n");
    const description = isObject(brandSources[id]) && typeof brandSources[id].$description === "string" ? brandSources[id].$description : id;
    css[`brands/${id}.css`] = [
      `/* @krizaka/tokens — GÉNÉRÉ depuis src/brands/${id}.brand.json par scripts/build.mjs : ne pas éditer.`,
      `   ${description}`,
      `   Importé après tokens.css (ou @krizaka/tailwind) : l'identité ${id} sur toute l'app, dans les deux thèmes. */`,
      "",
      `:root, .theme-dark {\n${decls("dark", true)}\n}`,
      "",
      `html.light {\n${decls("light", false)}\n}`,
      "",
      `.theme-light {\n${decls("light", true)}\n}`,
      "",
    ].join("\n");
    const cls = `.brand-${id}`;
    scoped.push(
      "",
      `${cls} {\n${decls("dark", true)}\n}`,
      `html.light ${cls}, html .theme-light ${cls}, html ${cls}.theme-light {\n${decls("light", true)}\n}`,
      `html .theme-dark ${cls}, html ${cls}.theme-dark {\n${decls("dark", true)}\n}`,
    );
    /** @param {"dark" | "light"} mode */
    const raw = (mode) => Object.fromEntries(ordered.map((t) => [t.key, /** @type {string} */ (resolve(t, mode))]));
    values[id] = { dark: raw("dark"), light: raw("light") };
    /** @param {"dark" | "light"} mode */
    const hex = (mode) => Object.fromEntries(ordered.map((t) => [t.key, toNative(parseHsl(/** @type {string} */ (resolve(t, mode))))]));
    native[id] = { dark: hex("dark"), light: hex("light") };
    const source = /** @type {Record<string, any>} */ (brandSources[id]);
    const mark = isObject(source?.$extensions) ? source.$extensions[EXT]?.mark : undefined;
    if (!Array.isArray(mark) || mark.length < 2) throw new Error(`brand ${id}: $extensions["${EXT}"].mark must list the mark's gradient stops`);
    for (const stop of mark) {
      if (!Array.isArray(stop) || stop.length !== 2 || !/^\d+(\.\d+)?%$/.test(String(stop[0])) || typeof stop[1] !== "string") throw new Error(`brand ${id}: a mark stop is ["<n>%", "hsl(...)"]`);
      parseHsl(stop[1]);
    }
    marks[id] = mark.map(([offset, color]) => [offset, color]);
    marksNative[id] = mark.map(([offset, color]) => [offset, toNative(parseHsl(color))]);
  }
  if (ids.includes("yasakia")) {
    // Deprecated alias (Yazakia was renamed Yasakia, 2026-10): `brands/yazakia.css` and `.brand-yazakia` stay for one minor version.
    css["brands/yazakia.css"] = css["brands/yasakia.css"].replace("/* @krizaka/tokens", "/* DEPRECATED — renamed Yasakia (import brands/yasakia.css); kept for one minor version.\n   @krizaka/tokens");
    const dark = scoped.filter((b) => b.includes(".brand-yasakia"));
    scoped.push("", "/* DEPRECATED — `.brand-yazakia` is `.brand-yasakia` (Yazakia was renamed Yasakia); kept for one minor version. */", ...dark.map((b) => b.replaceAll("yasakia", "yazakia")));
  }
  if (ids.length) css["brands/scoped.css"] = `${scoped.join("\n")}\n`;
  return { ids, css, values, native, marks, marksNative };
}

/**
 * Reads the brand sources from a directory, in BRANDS order.
 * @param {string} dir
 * @returns {Record<string, unknown>}
 */
export function loadBrands(dir) {
  return Object.fromEntries(BRANDS.map((b) => [b, JSON.parse(readFileSync(join(dir, `${b}.brand.json`), "utf8"))]));
}

/**
 * Writes the outputs.
 * @param {Record<string, string>} files
 * @param {string} outDir
 */
export function write(files, outDir) {
  for (const [name, content] of Object.entries(files)) {
    mkdirSync(dirname(join(outDir, name)), { recursive: true });
    writeFileSync(join(outDir, name), content);
  }
}

/**
 * Reads the appearance source (`src/appearance/appearance.json`).
 * @param {string} dir
 */
export function loadAppearance(dir) {
  return JSON.parse(readFileSync(join(dir, "appearance.json"), "utf8"));
}

/** The declarations of the native `appearance`: the same themes, accents as native brand themes. @param {any} data */
function nativeAppearanceDts(data) {
  /** @param {unknown} o */
  const json = (o) => JSON.stringify(o);
  return `export type AppearanceThemeId = ${data.themes.map((/** @type {{ id: string }} */ t) => json(t.id)).join(" | ")};
export type AppearanceDensity = ${data.densities.map((/** @type {string} */ d) => json(d)).join(" | ")};
export interface AppearancePreview { readonly surface0: string; readonly surface1: string; readonly surface2: string; readonly text: string; readonly muted: string }
export interface AppearanceTheme { readonly id: AppearanceThemeId; readonly base: "system" | "light" | "dark"; readonly required?: true; readonly preview: AppearancePreview | null }
export interface AppearanceAccent extends BrandTheme { readonly id: BrandId }
/** Appearance (ADR-006 §4): the themes with their miniature's colours, the accents per theme, what each reads on, the densities. */
export declare const appearance: {
  readonly themes: readonly AppearanceTheme[];
  readonly accents: readonly AppearanceAccent[];
  readonly passes: { readonly [B in BrandId]: readonly AppearanceThemeId[] };
  readonly densities: readonly AppearanceDensity[];
};
`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const { tokens, brands, files } = compile(load(join(root, "src/tokens")), loadBrands(join(root, "src/brands")), loadAppearance(join(root, "src/appearance")));
  write(files, join(root, "dist"));
  console.log(`@krizaka/tokens: ${tokens.length} tokens, ${brands.length} brands → dist/{${Object.keys(files).join(",")}}`);
}
