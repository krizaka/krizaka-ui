// Appearance as data (ADR-006 §4, krizaka-ui#657): the themes a product's user chooses, the accents that read on every surface a
// product offers, the densities. From `src/appearance/appearance.json` and the compiled brands, it makes
//   - `appearance.css`   — the two optional surface sets (`html.theme-blueprint`, `html.theme-carbone`, dark only) and one
//                          `html[data-accent="<brand>"]` rule per brand and theme (the accent family of that brand), the choices the
//                          Appearance block applies at once;
//   - `appearance`       — the same as data (index.js): the themes with the colours of their miniature, the accents with the
//                          surfaces each reads on (`passes`, computed here with WCAG 2 — text ≥ 4.5:1, the fill ≥ 3:1, the label on the
//                          accent ≥ 4.5:1), and `offered()`'s inputs.
// Pure: the build and its tests call it with data.
import { contrast, parseHsl } from "./color.mjs";

const SURFACES = ["surface-0", "surface-1", "surface-2", "surface-3"];
const ACCENT_ROLES = ["accent", "accent-hover", "accent-soft", "accent-text", "accent-2", "on-accent", "ring", "info", "info-text"];
const hex = (h) => ({ r: Number.parseInt(h.slice(1, 3), 16), g: Number.parseInt(h.slice(3, 5), 16), b: Number.parseInt(h.slice(5, 7), 16), a: 1 });
/** @param {string} v */
export const parseColor = (v) => (v.startsWith("#") ? hex(v) : parseHsl(v));
const kebab = (s) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
const json = (v) => JSON.stringify(v);

/**
 * The surfaces of a theme: the product register's for light and dark, the set's own for Blueprint and Carbone.
 * @param {any} source
 * @param {{ id: string, base: string, set?: string }} theme
 */
export function surfacesOf(source, theme) {
  const mode = theme.base === "light" ? "light" : "dark";
  const own = theme.set ? source.sets[theme.set] : source.base[mode];
  return { mode, surfaces: SURFACES.map((s) => own[s]), text: { primary: own["text-primary"], secondary: own["text-secondary"], muted: own["text-muted"] } };
}

/**
 * Whether an accent reads on a theme: its text role ≥ 4.5:1 on surfaces 0–3, the fill ≥ 3:1 on surfaces 0–2 (a ring, a dot, a
 * border), and the label on the accent ≥ 4.5:1. Numbers returned, so a test can say what failed.
 * @param {Record<string, string>} accent the accent family in the theme's mode (camelCase roles)
 * @param {string[]} surfaces
 */
export function accentContrast(accent, surfaces) {
  const S = surfaces.map(parseColor);
  const min = (fg, list) => Math.min(...list.map((bg) => contrast(parseColor(fg), bg)));
  return { text: min(accent.accentText, S), fill: min(accent.accent, S.slice(0, 3)), label: contrast(parseColor(accent.onAccent), parseColor(accent.accent)) };
}
export const readsOn = (c) => c.text >= 4.5 && c.fill >= 3 && c.label >= 4.5;

/**
 * @param {any} source the parsed appearance.json
 * @param {Record<string, { dark: Record<string, string>, light: Record<string, string> }>} brands the compiled brands' raw values
 */
export function compileAppearance(source, brands) {
  const themes = source.themes.map((t) => {
    if (t.base === "system") return { id: t.id, base: "system", required: true, preview: null };
    const { mode, surfaces, text } = surfacesOf(source, t);
    return { id: t.id, base: mode, ...(t.required ? { required: true } : {}), preview: { surface0: surfaces[0], surface1: surfaces[1], surface2: surfaces[2], text: text.primary, muted: text.muted } };
  });
  /** @type {Record<string, string[]>} */
  const passes = {};
  for (const [id, family] of Object.entries(brands)) {
    passes[id] = source.themes
      .filter((t) => t.base !== "system")
      .filter((t) => {
        const { mode, surfaces } = surfacesOf(source, t);
        return readsOn(accentContrast(family[mode], surfaces));
      })
      .map((t) => t.id);
  }
  const accents = Object.keys(brands).map((id) => ({ id, dark: pick(brands[id].dark), light: pick(brands[id].light) }));
  return { themes, accents, passes, densities: source.densities };
}
/** The accent family of a brand, the roles the Appearance block sets. */
const pick = (family) => Object.fromEntries(ACCENT_ROLES.map((r) => [camel(r), family[camel(r)]]));
const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

/** The CSS of the choices: surface sets, then accents. Specificity beats the product register's `:root:is(.brand-x)`. */
export function appearanceCss(source, data) {
  const out = [
    "/* @krizaka/tokens — GÉNÉRÉ depuis src/appearance/appearance.json par scripts/build.mjs : ne pas éditer.\n   Apparence (ADR-006 §4, krizaka-ui#657) : les jeux de surfaces optionnels (Blueprint, Carbone — sombres) et l'accent choisi\n   (`html[data-accent=\"<marque>\"]`). `html.theme-<jeu>` est posé par ThemeProvider (setTheme) ; le clair l'ignore. */",
  ];
  for (const [name, set] of Object.entries(source.sets)) {
    const decls = Object.entries(set)
      .filter(([k]) => k !== "$description")
      .map(([k, v]) => `  --kz-${k}: ${v};`);
    out.push("", `/* ${set.$description} */`, `html.theme-${name}:not(.light), html.theme-${name}:not(.light) .theme-dark {\n  color-scheme: dark;\n${decls.join("\n")}\n}`);
  }
  const family = (f) => ACCENT_ROLES.map((r) => `  --kz-${r}: ${f[camel(r)]};`).join("\n");
  out.push("", "/* L'accent choisi, par marque et par thème (la valeur d'un produit qui n'en choisit pas est la sienne). */");
  for (const a of data.accents) {
    out.push(`html[data-accent="${a.id}"]:not(.light) {\n${family(a.dark)}\n}`, `html.light[data-accent="${a.id}"] {\n${family(a.light)}\n}`);
  }
  return `${out.join("\n")}\n`;
}

/** The data as index.js / index.d.ts source. */
export function appearanceModule(data) {
  const js = `
/**
 * Appearance (ADR-006 §4): the themes a product's user chooses (\`system\`, \`light\`, \`dark\` — required —, \`blueprint\`, \`carbone\`), the colours of
 * each one's miniature, the accents (every brand's family per theme) with the themes each one reads on (\`passes\`, WCAG 2), the densities.
 * \`appearance.css\` applies the surface sets (\`html.theme-<id>\`) and the accent (\`html[data-accent]\`).
 */
export const appearance = Object.freeze(${json(data)});
`;
  const dts = `
export type AppearanceThemeId = ${data.themes.map((t) => json(t.id)).join(" | ")};
export type AppearanceDensity = ${data.densities.map((d) => json(d)).join(" | ")};
/** The colours a theme's miniature is drawn with. */
export interface AppearancePreview { readonly surface0: string; readonly surface1: string; readonly surface2: string; readonly text: string; readonly muted: string }
export interface AppearanceTheme { readonly id: AppearanceThemeId; readonly base: "system" | "light" | "dark"; readonly required?: true; readonly preview: AppearancePreview | null }
export interface AppearanceAccent { readonly id: BrandId; readonly dark: { readonly [R in BrandRole]: string }; readonly light: { readonly [R in BrandRole]: string } }
/** The themes a user chooses, the accents and the themes each reads on, the densities (ADR-006 §4). */
export declare const appearance: {
  readonly themes: readonly AppearanceTheme[];
  readonly accents: readonly AppearanceAccent[];
  /** For each brand's accent, the themes it reads on (text ≥ 4.5:1, fill ≥ 3:1, its label ≥ 4.5:1). */
  readonly passes: { readonly [B in BrandId]: readonly AppearanceThemeId[] };
  readonly densities: readonly AppearanceDensity[];
};
`;
  return { js, dts };
}
