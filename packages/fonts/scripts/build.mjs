#!/usr/bin/env node
// Builds dist/ from src/families.json (written by hand) and src/faces.json (written by scripts/subset.py with the
// files): fonts.css (the @font-face rules and their metric-matched fallbacks), index.js (the families as data: roles,
// files, licences, fallbacks, the words of the documentation), native.js (the React Native names) and native-assets.js
// (the font files for expo-font). Zero dependency. The functions are pure and exported for the tests.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** The role → the token it fills (@krizaka/tokens). The text role is `--kz-font-sans`, aliased `--kz-font-text`. */
export const TOKENS = { display: "--kz-font-display", text: "--kz-font-sans", mono: "--kz-font-mono" };
/** The order of the roles everywhere (CSS, data, docs). */
export const ROLES = /** @type {const} */ (["display", "text", "mono"]);
const LICENSE = { name: "SIL Open Font License 1.1", spdx: "OFL-1.1", url: "https://openfontlicense.org" };

/**
 * @typedef {{ role: "display" | "text" | "mono", family: string, slug: string, nativeName: string, category: string,
 *   designer: string, upstream: Record<string, string>, axes: Record<string, number | number[]>, nativeWeights: number[],
 *   fallback: string, stack: string[], description: string, why: string, use: string[], avoid: string[] }} Family
 * @typedef {{ unitsPerEm: number, ascent: number, descent: number, lineGap: number, capHeight: number, xHeight: number, avgWidth: number }} Metrics
 * @typedef {{ file: string, bytes: number, sha256: string }} FileEntry
 * @typedef {{ version: string, metrics: Metrics, web: (FileEntry & { subset: string, unicodeRange: string })[],
 *   native: (FileEntry & { weight: number, name: string })[] }} Face
 * @typedef {{ families: Family[], subsets: Record<string, string>, fallbacks: Record<string, { local: string[], unitsPerEm: number, avgWidth: number }>, rules: string[] }} Source
 */

/** @returns {{ source: Source, faces: Record<string, Face> }} */
export function load(root = ROOT) {
  const source = JSON.parse(readFileSync(join(root, "src/families.json"), "utf8"));
  const { faces } = JSON.parse(readFileSync(join(root, "src/faces.json"), "utf8"));
  return { source, faces };
}

/** @param {number} n */
const pct = (n) => `${(n * 100).toFixed(2)}%`;
/** @param {string} family */
const quote = (family) => (/[\s\d]/.test(family) ? `"${family}"` : family);

/**
 * The overrides that make the fallback face occupy the same room as the web font (the method of next/font and
 * Capsize): scale the fallback so its average advance matches, then set its vertical metrics to the font's. The text
 * does not move when the web font arrives — CLS 0.
 * @param {Metrics} metrics
 * @param {{ unitsPerEm: number, avgWidth: number }} fallback
 */
export function fallbackMetrics(metrics, fallback) {
  const sizeAdjust = metrics.avgWidth / metrics.unitsPerEm / (fallback.avgWidth / fallback.unitsPerEm);
  return {
    sizeAdjust: pct(sizeAdjust),
    ascentOverride: pct(metrics.ascent / metrics.unitsPerEm / sizeAdjust),
    descentOverride: pct(Math.abs(metrics.descent) / metrics.unitsPerEm / sizeAdjust),
    lineGapOverride: pct(metrics.lineGap / metrics.unitsPerEm / sizeAdjust),
  };
}

/** @param {Family} family @param {Face} face */
function weights(family, face) {
  const wght = family.axes.wght;
  if (!Array.isArray(wght)) throw new Error(`${family.family}: the web file keeps a weight range`);
  if (!face) throw new Error(`${family.family}: no face in src/faces.json — run scripts/subset.py`);
  return /** @type {[number, number]} */ (wght);
}

/**
 * Everything dist/ holds, from the sources.
 * @param {Source} source
 * @param {Record<string, Face>} faces
 */
export function compile(source, faces) {
  const families = ROLES.map((role) => {
    const family = source.families.find((f) => f.role === role);
    if (!family) throw new Error(`src/families.json: no ${role} family`);
    const face = faces[role];
    const [min, max] = weights(family, face);
    const fallback = source.fallbacks[family.fallback];
    if (!fallback) throw new Error(`${family.family}: unknown fallback ${family.fallback}`);
    for (const w of family.nativeWeights) if (!face.native.some((n) => n.weight === w)) throw new Error(`${family.family}: no native file for ${w}`);
    const fallbackFamily = `${family.family} Fallback`;
    return {
      role,
      family: family.family,
      fallbackFamily,
      stack: [family.family, fallbackFamily, ...family.stack].map(quote).join(", "),
      token: TOKENS[role],
      category: family.category,
      designer: family.designer,
      version: face.version.replace(/^Version /, "").split(";")[0],
      weights: { min, max },
      license: { ...LICENSE, file: `licenses/${family.nativeName}-OFL.txt` },
      upstream: family.upstream,
      description: family.description,
      why: family.why,
      use: family.use,
      avoid: family.avoid,
      metrics: face.metrics,
      fallback: { local: fallback.local, ...fallbackMetrics(face.metrics, fallback) },
      web: face.web.map(({ subset, file, bytes, unicodeRange }) => ({ subset, path: file, bytes, unicodeRange })),
      native: face.native.map(({ weight, name, file, bytes }) => ({ weight, name, path: file, bytes })),
    };
  });

  const header = "@krizaka/fonts — GÉNÉRÉ depuis src/families.json et src/faces.json par scripts/build.mjs : ne pas éditer.";
  const css = [
    `/* ${header}`,
    "   Les trois familles Krizaka (SIL OFL 1.1, licences dans licenses/), auto-hébergées, en sous-ensembles latin et",
    "   latin-ext (le navigateur ne charge latin-ext que si la page en a besoin), font-display: swap ; chaque famille a",
    "   un repli local aux métriques ajustées (« … Fallback ») : le texte ne bouge pas quand la police arrive. */",
    ...families.flatMap((f) => [
      "",
      `/* ${f.family} — ${f.role} (${f.token}) */`,
      ...f.web.map((w) =>
        [
          "@font-face {",
          `  font-family: ${quote(f.family)};`,
          "  font-style: normal;",
          `  font-weight: ${f.weights.min} ${f.weights.max};`,
          "  font-display: swap;",
          `  src: url("../${w.path}") format("woff2");`,
          `  unicode-range: ${w.unicodeRange};`,
          "}",
        ].join("\n"),
      ),
      [
        "@font-face {",
        `  font-family: ${quote(f.fallbackFamily)};`,
        `  src: ${f.fallback.local.map((l) => `local(${quote(l)})`).join(", ")};`,
        `  size-adjust: ${f.fallback.sizeAdjust};`,
        `  ascent-override: ${f.fallback.ascentOverride};`,
        `  descent-override: ${f.fallback.descentOverride};`,
        `  line-gap-override: ${f.fallback.lineGapOverride};`,
        "}",
      ].join("\n"),
    ]),
    "",
  ].join("\n");

  const json = (/** @type {unknown} */ v) => JSON.stringify(v, null, 2);
  const pure = (/** @type {string} */ js) => js.replaceAll("Object.freeze(", "/* @__PURE__ */ Object.freeze(");
  const preload = families.map((f) => /** @type {{ path: string }} */ (f.web.find((w) => w.subset === "latin")).path);

  const indexJs = pure(`// ${header}

/** The three Krizaka families — display, text, mono — as data: files, weights, licence, fallback, and how to use them. */
export const fonts = Object.freeze(${json(families)});

/** The usage rules of the Krizaka typography (ui.krizaka.com/foundations/typography). */
export const rules = Object.freeze(${json(source.rules)});

/** The files worth preloading: the latin subset of each family (paths inside the package). */
export const preload = Object.freeze(${json(preload)});

/** The CSS font stack of a role: \`fontStack("display")\` → \`"Plus Jakarta Sans", "Plus Jakarta Sans Fallback", …\`. */
export function fontStack(role) {
  const font = fonts.find((f) => f.role === role);
  if (!font) throw new Error(\`@krizaka/fonts: unknown role \${role}\`);
  return font.stack;
}
`);
  const indexDts = `// ${header}

export type FontRole = "display" | "text" | "mono";
export interface FontFile { readonly subset: string; readonly path: string; readonly bytes: number; readonly unicodeRange: string }
export interface NativeFontFile { readonly weight: number; readonly name: string; readonly path: string; readonly bytes: number }
export interface Font {
  readonly role: FontRole;
  /** The CSS family name, declared by \`@krizaka/fonts/css\`. */
  readonly family: string;
  /** The metric-matched local fallback declared next to it. */
  readonly fallbackFamily: string;
  /** The full CSS stack: the family, its fallback, then system faces. */
  readonly stack: string;
  /** The @krizaka/tokens property this family fills. */
  readonly token: "--kz-font-display" | "--kz-font-sans" | "--kz-font-mono";
  readonly category: string;
  readonly designer: string;
  readonly version: string;
  /** The weight range of the web (variable) files. */
  readonly weights: { readonly min: number; readonly max: number };
  readonly license: { readonly name: string; readonly spdx: "OFL-1.1"; readonly url: string; readonly file: string };
  readonly upstream: { readonly [key: string]: string };
  readonly description: string;
  readonly why: string;
  readonly use: readonly string[];
  readonly avoid: readonly string[];
  readonly metrics: { readonly unitsPerEm: number; readonly ascent: number; readonly descent: number; readonly lineGap: number; readonly capHeight: number; readonly xHeight: number; readonly avgWidth: number };
  readonly fallback: { readonly local: readonly string[]; readonly sizeAdjust: string; readonly ascentOverride: string; readonly descentOverride: string; readonly lineGapOverride: string };
  /** WOFF2 files, one per subset (paths inside the package: \`@krizaka/fonts/<path>\`). */
  readonly web: readonly FontFile[];
  /** Static TrueType files for React Native, one per weight. */
  readonly native: readonly NativeFontFile[];
}
/** The three Krizaka families — display, text, mono — as data: files, weights, licence, fallback, and how to use them. */
export declare const fonts: readonly Font[];
/** The usage rules of the Krizaka typography (ui.krizaka.com/foundations/typography). */
export declare const rules: readonly string[];
/** The files worth preloading: the latin subset of each family (paths inside the package). */
export declare const preload: readonly string[];
/** The CSS font stack of a role. */
export declare function fontStack(role: FontRole): string;
`;

  /** @type {Record<string, Record<string, string>>} */
  const nativeNames = Object.fromEntries(families.map((f) => [f.role, Object.fromEntries(f.native.map((n) => [n.weight, n.name]))]));
  const allNative = families.flatMap((f) => f.native);
  const nativeJs = pure(`// ${header}

/** The React Native font names, per role and weight: the keys of \`fontAssets\` (\`@krizaka/fonts/native/assets\`). */
export const nativeFonts = Object.freeze(${json(nativeNames)});

/**
 * The font name for a role and a weight on React Native (static files: one name per weight), the nearest weight the
 * package ships: \`fontFamily("display", 800)\` → \`"PlusJakartaSans-ExtraBold"\`. Pass it as \`fontFamily\`, without
 * \`fontWeight\` (Android would synthesise a second bold).
 */
export function fontFamily(role, weight = 400) {
  const names = nativeFonts[role];
  if (!names) throw new Error(\`@krizaka/fonts/native: unknown role \${role}\`);
  const available = Object.keys(names).map(Number);
  const nearest = available.reduce((best, w) => (Math.abs(w - weight) < Math.abs(best - weight) || (Math.abs(w - weight) === Math.abs(best - weight) && w > best) ? w : best));
  return names[nearest];
}
`);
  const nativeDts = `// ${header}

export type FontRole = "display" | "text" | "mono";
export type NativeFontName = ${allNative.map((n) => json(n.name)).join(" | ")};
/** The React Native font names, per role and weight: the keys of \`fontAssets\` (\`@krizaka/fonts/native/assets\`). */
export declare const nativeFonts: {
${families.map((f) => `  readonly ${f.role}: { ${f.native.map((n) => `readonly ${n.weight}: ${json(n.name)}`).join("; ")} };`).join("\n")}
};
/** The font name for a role and a weight on React Native: the nearest weight the package ships. */
export declare function fontFamily(role: FontRole, weight?: number): NativeFontName;
`;
  const assetsJs = `// ${header}
// Metro (Expo, React Native) resolves each \`require\` to a bundled asset; this module is for React Native only.

/** Every font file, by its React Native name: \`useFonts(fontAssets)\` (expo-font) loads the three families. */
export const fontAssets = {
${allNative.map((n) => `  ${json(n.name)}: require(${json(`../${n.path}`)}),`).join("\n")}
};
`;
  const assetsDts = `// ${header}

import type { NativeFontName } from "./native";
/** Every font file, by its React Native name: \`useFonts(fontAssets)\` (expo-font) loads the three families. */
export declare const fontAssets: { readonly [K in NativeFontName]: number };
`;

  return {
    families,
    files: {
      "fonts.css": css,
      "index.js": indexJs,
      "index.d.ts": indexDts,
      "native.js": nativeJs,
      "native.d.ts": nativeDts,
      "native-assets.js": assetsJs,
      "native-assets.d.ts": assetsDts,
    },
  };
}

/** @param {Record<string, string>} files @param {string} outDir */
export function write(files, outDir) {
  for (const [name, content] of Object.entries(files)) {
    mkdirSync(dirname(join(outDir, name)), { recursive: true });
    writeFileSync(join(outDir, name), content);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { source, faces } = load();
  const { families, files } = compile(source, faces);
  write(files, join(ROOT, "dist"));
  console.log(`@krizaka/fonts: ${families.map((f) => f.family).join(", ")} → dist/{${Object.keys(files).join(",")}}`);
}
