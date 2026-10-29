// The look presets of a shop page (ADR-007 §4, krizaka-ui#745), as data: `src/presets/shop/<id>.preset.json` → CSS scoped by
// `[data-shop-preset="<id>"]` (both modes) and the same data for the composer. A preset names only tokens — an accent of the
// brands (`akinaza`, or `akinaza:accent-2` for the copper), a paper, the roles of the fonts, a density, a photo treatment — and
// never a colour: a raw colour in a source is refused. The visitor's dark / light choice is kept: a preset defines both modes.
// Pure: the build and its tests call it with data.

/** The trades with a preset. No café, restaurant or bar (ADR-006 §5, row 23): Akinaza is for service shops. */
export const SHOP_TRADES = ["salon", "pets", "coaching", "workshop", "cleaning", "consulting"];
export const SHOP_PAPERS = ["plain", "seyes", "kraft", "washi"];
export const SHOP_GRADES = ["none", "warm", "cool"];
/** The brands whose accent a shop may wear: the products that are live. */
export const SHOP_ACCENT_BRANDS = ["krizaka", "orazaka", "yomizaka", "akinaza"];
const KEYS = new Set(["id", "version", "name", "trades", "paper", "accent", "accents", "faces", "density", "photo", "variants"]);
/** The look presets (`look-<name>`, trade-agnostic, akinaza#478): the keys they add to a trade preset's. */
export const LOOK_KEYS = new Set(["surface", "motion", "mascots", "closing", "transition"]);
/** The surface under the page: `paper` and `ink` are two steps of the product surfaces, `warm` a tint of the accent, `contrast` the page with strong rules, `deep` the night's (a tinted dusk in light), `dusk` that tint in both modes. */
export const SHOP_SURFACES = ["paper", "ink", "warm", "contrast", "deep", "dusk"];
export const SHOP_MOTIONS = ["still", "soft", "paper", "lively"];
export const SHOP_FRAMES = ["none", "polaroid"];
export const SHOP_CLOSINGS = ["stamp", "pigeon", "photo", "mark"];
export const SHOP_TRANSITIONS = ["channel", "crossfade", "slide"];
export const SHOP_TITLE_FACES = ["display", "product-display", "poster"];
const isLook = (/** @type {string} */ id) => /^look-[a-z]+$/.test(id);
/** The title face `display` is Young Serif (one weight); `product-display` is Plus Jakarta Sans (the product register's). */
export const YOUNG_SERIF = '"Young Serif", "Young Serif Fallback", Georgia, "Times New Roman", serif';
const GRADE_FILTER = { none: "none", warm: "sepia(0.1) saturate(1.08) contrast(1.02)", cool: "saturate(0.94) hue-rotate(-5deg) brightness(1.02)" };
const RADIUS = { none: "0", xs: "4px" };
const RAW_COLOUR = /#[0-9a-f]{3,8}\b|\b(?:rgb|hsl|hwb|lab|lch|oklab|oklch|color)a?\(/i;

/** @param {string} v */
const hslParts = (v) => {
  const m = /^hsl\(\s*(-?[\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*(?:\/\s*([\d.]+)\s*)?\)$/.exec(v.trim());
  if (!m) throw new Error(`Not an hsl() colour: ${v}`);
  return { h: Number(m[1]), s: Number(m[2]), l: Number(m[3]) };
};
/** @param {{ h: number, s: number, l: number }} p @param {number} [a] */
const hsl = (p, a) => {
  const alpha = a === undefined ? "" : ` / ${a}`;
  return `hsl(${p.h} ${p.s}% ${Math.round(p.l * 10) / 10}%${alpha})`;
};

/**
 * The accent family a reference names, in one mode: `akinaza` is the brand's accent; `akinaza:accent-2` makes its second colour
 * (the copper) the accent, its hover one step toward the text, its text the colour itself.
 * @param {Record<string, { dark: Record<string, string>, light: Record<string, string> }>} brands
 * @param {string} ref
 * @param {"dark" | "light"} mode
 */
export function accentFamily(brands, ref, mode) {
  const [id, role = "accent"] = ref.split(":");
  const b = brands[/** @type {string} */ (id)]?.[mode];
  if (!b) throw new Error(`accent ${ref}: no brand ${id}`);
  if (role === "accent") return { accent: b.accent, accentHover: b.accentHover, accentSoft: b.accentSoft, accentText: b.accentText, onAccent: b.onAccent, ring: b.accent, accent2: b.accent2 };
  if (role !== "accent-2") throw new Error(`accent ${ref}: the role is accent or accent-2`);
  const p = hslParts(b.accent2);
  const step = mode === "dark" ? 6 : -6;
  return { accent: b.accent2, accentHover: hsl({ ...p, l: p.l + step }), accentSoft: hsl(p, mode === "dark" ? 0.12 : 0.08), accentText: b.accent2, onAccent: b.onAccent, ring: b.accent2, accent2: b.accent };
}

/** @param {any} p @param {string} where */
function checkShape(p, where) {
  const allowed = isLook(String(p.id)) ? new Set([...KEYS, ...LOOK_KEYS]) : KEYS;
  for (const k of Object.keys(p)) if (!allowed.has(k)) throw new Error(`${where}: unknown key "${k}"`);
  for (const k of allowed) if (!(k in p)) throw new Error(`${where}: missing "${k}"`);
  if (!/^[a-z]+-[a-z]+$/.test(p.id)) throw new Error(`${where}: the id is trade-name`);
  if (!Number.isInteger(p.version) || p.version < 1) throw new Error(`${where}: version`);
  if (RAW_COLOUR.test(JSON.stringify(p))) throw new Error(`${where}: a preset names tokens, never a raw colour`);
}

/** @param {any} p @param {string} where */
function checkTrade(p, where) {
  if (isLook(p.id)) {
    if (JSON.stringify(p.trades) !== JSON.stringify(SHOP_TRADES)) throw new Error(`${where}: a look is trade-agnostic, its trades are all of ${SHOP_TRADES.join(", ")}`);
    return;
  }
  const known = Array.isArray(p.trades) && p.trades.length > 0 && p.trades.every((/** @type {string} */ t) => SHOP_TRADES.includes(t));
  if (!known) throw new Error(`${where}: trades are ${SHOP_TRADES.join(", ")}`);
  if (!p.id.startsWith(`${p.trades[0]}-`)) throw new Error(`${where}: the id starts with its trade`);
}

/** @param {any} p @param {string} where */
function checkLook(p, where) {
  if (!SHOP_PAPERS.includes(p.paper)) throw new Error(`${where}: paper is ${SHOP_PAPERS.join(", ")}`);
  if (!SHOP_TITLE_FACES.includes(p.faces?.title) || (p.faces.title === "poster" && !isLook(p.id)) || !["mono", "cahier"].includes(p.faces?.note)) throw new Error(`${where}: faces`);
  if (!["compact", "airy"].includes(p.density)) throw new Error(`${where}: density`);
  if (!SHOP_GRADES.includes(p.photo?.grade) || ![0, 1].includes(p.photo?.grain) || !(p.photo?.radius in RADIUS)) throw new Error(`${where}: photo`);
  if (isLook(p.id)) checkOwn(p, where);
  if (!isLook(p.id) && "frame" in p.photo) throw new Error(`${where}: photo.frame is a look's`);
  for (const [type, variant] of Object.entries(p.variants)) if (!/^[a-z]+$/.test(type) || !/^[a-z-]+$/.test(String(variant))) throw new Error(`${where}: variants`);
}

/** What a look adds: surface, motion, mascots, photo frame, closing call, TV transition. @param {any} p @param {string} where */
function checkOwn(p, where) {
  const ok = SHOP_SURFACES.includes(p.surface) && SHOP_MOTIONS.includes(p.motion) && ["off", "on"].includes(p.mascots) && SHOP_FRAMES.includes(p.photo?.frame) && SHOP_CLOSINGS.includes(p.closing) && SHOP_TRANSITIONS.includes(p.transition);
  if (!ok) throw new Error(`${where}: surface ${SHOP_SURFACES.join("|")}, motion ${SHOP_MOTIONS.join("|")}, mascots off|on, photo.frame ${SHOP_FRAMES.join("|")}, closing ${SHOP_CLOSINGS.join("|")}, transition ${SHOP_TRANSITIONS.join("|")}`);
}

/** @param {any} p @param {string[]} brandIds @param {string} where */
function checkAccents(p, brandIds, where) {
  if (!Array.isArray(p.accents) || !p.accents.includes(p.accent) || new Set(p.accents).size !== p.accents.length) throw new Error(`${where}: accents lists the accent once`);
  for (const a of p.accents) {
    const [id = "", role = "accent"] = String(a).split(":");
    const live = SHOP_ACCENT_BRANDS.includes(id) && brandIds.includes(id) && ["accent", "accent-2"].includes(role);
    if (!live) throw new Error(`${where}: accent "${a}" is not a live brand's accent`);
  }
}

/** @param {any} p @param {string[]} brandIds */
function validate(p, brandIds) {
  const where = `preset ${p?.id}`;
  checkShape(p, where);
  checkTrade(p, where);
  checkLook(p, where);
  checkAccents(p, brandIds, where);
}

/** The declarations of one mode of an accent. @param {Record<string, { dark: Record<string, string>, light: Record<string, string> }>} brands @param {"dark" | "light"} mode @param {string} ref */
function accentDecls(brands, mode, ref) {
  const f = accentFamily(brands, ref, mode);
  return [`--kz-accent: ${f.accent};`, `--kz-accent-hover: ${f.accentHover};`, `--kz-accent-soft: ${f.accentSoft};`, `--kz-accent-text: ${f.accentText};`, `--kz-accent-2: ${f.accent2};`, `--kz-on-accent: ${f.onAccent};`, `--kz-ring: ${f.ring};`];
}

/** @param {string} sel @param {string[]} decls */
const block = (sel, decls) => `${sel} {\n${decls.map((d) => `  ${d}`).join("\n")}\n}`;

/** The three rules (dark, light, a dark island) of one accent under a selector; `extra` joins the dark one. @param {Record<string, any>} brands @param {string} sel @param {string} ref @param {string[]} [extra] */
function accentBlocks(brands, sel, ref, extra = []) {
  const light = `html.light ${sel}, html .theme-light ${sel}, html ${sel}.theme-light`;
  const island = `html .theme-dark ${sel}, html ${sel}.theme-dark`;
  return [block(sel, [...accentDecls(brands, "dark", ref), ...extra]), block(light, accentDecls(brands, "light", ref)), block(island, accentDecls(brands, "dark", ref))];
}

/** What a preset sets besides its accent: the faces, the photo treatment. @param {any} p */
function ownDecls(p) {
  const display = p.faces.title === "display";
  const poster = p.faces.title === "poster";
  return [
    `--kz-shop-title-weight: ${display ? 400 : poster ? 800 : 650};`,
    `--kz-font-display: ${display ? YOUNG_SERIF : "var(--kz-font-product-display)"};`,
    ...(poster ? ["--kz-shop-title-tracking: -0.03em;"] : []),
    ...(p.faces.note === "cahier" ? ["--kz-font-mono: var(--kz-font-cahier);"] : []),
    `--kz-shop-photo-filter: ${GRADE_FILTER[/** @type {"none"} */ (p.photo.grade)]};`,
    `--kz-shop-photo-radius: ${RADIUS[/** @type {"none"} */ (p.photo.radius)]};`,
    // The grain layer exists only when a look asks for it: a photo without grain gets no extra pseudo-element to composite.
    ...(p.photo.grain ? ['--kz-shop-grain: "";'] : []),
    ...(p.photo.frame === "polaroid" ? ["--kz-shop-photo-frame: 0 0 0 6px var(--kz-surface-1), var(--kz-shadow-sm, 0 1px 3px hsl(0 0% 0% / 0.25));"] : []),
  ];
}

/** The surface of a look in one mode, as tokens only (never a colour): the page's and the one of its raised parts. @param {string} surface @param {"dark" | "light"} mode */
export function surfaceDecls(surface, mode) {
  const tint = (/** @type {number} */ n, /** @type {string} */ base) => `color-mix(in oklab, var(--kz-accent) ${n}%, var(${base}))`;
  /** @type {Record<string, [string, string]>} */
  const by = {
    paper: ["var(--kz-surface-0)", "var(--kz-surface-1)"],
    ink: ["var(--kz-surface-1)", "var(--kz-surface-2)"],
    warm: [tint(6, "--kz-surface-0"), "var(--kz-surface-1)"],
    contrast: ["var(--kz-surface-0)", "var(--kz-surface-0)"],
    dusk: [tint(6, "--kz-surface-2"), tint(3, "--kz-surface-2")],
  };
  const [page, raised] = by[surface === "deep" ? (mode === "dark" ? "paper" : "dusk") : surface] ?? by.paper;
  return [`--kz-shop-surface: ${page};`, `--kz-shop-surface-raised: ${raised};`, ...(surface === "contrast" ? ["--kz-shop-rule: var(--kz-border-strong);"] : [])];
}

/** The CSS of one preset: its accent, its own settings, and the accents of its list. @param {Record<string, any>} brands @param {any} p */
function presetCss(brands, p) {
  const sel = `[data-shop-preset="${p.id}"]`;
  const others = p.accents.filter((/** @type {string} */ x) => x !== p.accent).flatMap((/** @type {string} */ a) => accentBlocks(brands, `${sel}[data-shop-accent="${a}"]`, a));
  const surface = p.surface ? [block(`html.light ${sel}, html .theme-light ${sel}, html ${sel}.theme-light`, surfaceDecls(p.surface, "light")), block(`html .theme-dark ${sel}, html ${sel}.theme-dark`, surfaceDecls(p.surface, "dark"))] : [];
  return [`/* ${p.id} — ${p.name} (${p.trades.join(", ")}) · ${p.paper} · ${p.density} */`, ...accentBlocks(brands, sel, p.accent, [...ownDecls(p), ...(p.surface ? surfaceDecls(p.surface, "dark") : [])]), ...surface, ...others];
}

/**
 * @param {unknown[]} sources the parsed presets, in output order
 * @param {Record<string, { dark: Record<string, string>, light: Record<string, string> }>} brands the compiled brands' raw values
 */
export function compileShopPresets(sources, brands) {
  const list = /** @type {any[]} */ (sources);
  const ids = new Set();
  const perTrade = /** @type {Record<string, number>} */ ({});
  for (const p of list) {
    validate(p, Object.keys(brands));
    if (ids.has(p.id)) throw new Error(`preset ${p.id}: twice`);
    ids.add(p.id);
    if (!isLook(p.id)) perTrade[p.trades[0]] = (perTrade[p.trades[0]] ?? 0) + 1;
  }
  for (const t of SHOP_TRADES) if (perTrade[t] !== 2) throw new Error(`trade ${t}: two presets, not ${perTrade[t] ?? 0}`);
  const intro = "/* @krizaka/tokens — GÉNÉRÉ depuis src/presets/shop/*.preset.json par scripts/build.mjs : ne pas éditer.\n   Les looks d'une page de boutique (ADR-007 §4) : `[data-shop-preset=\"<id>\"]` pose l'accent, les polices, le grain et le traitement des photos,\n   dans les deux thèmes ; `[data-shop-accent=\"<marque>[:accent-2]\"]` en plus choisit un autre accent de la liste testée du look. */";
  const css = [intro, ...list.flatMap((p) => ["", ...presetCss(brands, p)])];
  const data = list.map((p) => ({ id: p.id, version: p.version, name: p.name, trades: p.trades, paper: p.paper, accent: p.accent, accents: p.accents, faces: p.faces, density: p.density, photo: p.photo, variants: p.variants, ...Object.fromEntries([...LOOK_KEYS].filter((k) => k in p).map((k) => [k, p[k]])) }));
  return { css: `${css.join("\n")}\n`, data };
}

/** The data as index.js / index.d.ts source. @param {any[]} data */
export function shopPresetsModule(data) {
  const json = JSON.stringify;
  const js = `
/**
 * The look presets of a shop page (ADR-007 §4): two per trade — accent, paper, faces, density, photo treatment and the default
 * variant of each section. \`shop-presets.css\` applies them: \`[data-shop-preset="<id>"]\`, and \`[data-shop-accent]\` for another
 * accent of the preset's tested list.
 */
export const shopPresets = Object.freeze(${json(data)});
`;
  const dts = `
export type ShopPresetId = ${data.map((p) => json(p.id)).join(" | ")};
export type ShopLookId = ${data.filter((p) => p.id.startsWith("look-")).map((p) => json(p.id)).join(" | ")};
export type ShopTrade = ${json(SHOP_TRADES).replaceAll(",", " | ").replace(/^\[|\]$/g, "")};
export interface ShopPreset {
  readonly id: ShopPresetId;
  readonly version: number;
  readonly name: string;
  readonly trades: readonly ShopTrade[];
  readonly paper: "plain" | "seyes" | "kraft" | "washi";
  /** An accent of the brands: \`akinaza\`, or \`akinaza:accent-2\` (the copper). */
  readonly accent: string;
  /** The accents the owner may choose within this look: all tested. */
  readonly accents: readonly string[];
  /** \`poster\` (a look's): the product face, heavy and tight. */
  readonly faces: { readonly title: "display" | "product-display" | "poster"; readonly note: "mono" | "cahier" };
  readonly density: "compact" | "airy";
  readonly photo: { readonly grade: "none" | "warm" | "cool"; readonly grain: 0 | 1; readonly radius: "none" | "xs"; /** A look's: \`polaroid\` borders the photo like a print. */ readonly frame?: "none" | "polaroid" };
  /** The default variant per section type when a section is added. */
  readonly variants: { readonly [type: string]: string };
  /** A look's (\`look-<name>\`, trade-agnostic, akinaza#478): the surface under the page. \`deep\` is the night's, a tinted dusk in light. */
  readonly surface?: "paper" | "ink" | "warm" | "contrast" | "deep" | "dusk";
  /** A look's: \`still\` · \`soft\` · \`paper\` · \`lively\`, the CSS motion mode of the page. */
  readonly motion?: "still" | "soft" | "paper" | "lively";
  /** A look's: the Krizaka look is the one with the birds. */
  readonly mascots?: "off" | "on";
  /** A look's: what the closing call carries. */
  readonly closing?: "stamp" | "pigeon" | "photo" | "mark";
  /** A look's: the TV transition. */
  readonly transition?: "channel" | "crossfade" | "slide";
}
/** The twelve trade presets (two per trade, ADR-007 §4) and the six trade-agnostic looks (\`look-*\`) of a shop page. */
export declare const shopPresets: readonly ShopPreset[];
`;
  return { js, dts };
}
