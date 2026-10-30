// The Krizaka map style, generated from the tokens (no hand-written colour): Protomaps' basemap layers
// (@protomaps/basemaps) painted with a flavour drawn from `@krizaka/tokens` — the surfaces for the land, the accent
// softened for the water, the text roles for the labels — in dark or light, the product's accent where a brand asks.
// Platform-neutral: the web `Map` and the native `Map` both read it.
import { brands, themes } from "@krizaka/tokens/native";
import { type Flavor, layers, namedFlavor } from "@protomaps/basemaps";

import { MAP_ATTRIBUTION, mapAssets } from "./assets";

/** A product of the family: its accent paints the map. */
export type MapBrand = keyof typeof brands;

/** A colour mixed into another (`#rrggbb` only): `t` = 0 gives `a`, 1 gives `b`. */
export function mix(a: string, b: string, t: number): string {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `#${x.map((v, i) => Math.round(v + (y[i]! - v) * t).toString(16).padStart(2, "0")).join("")}`;
}

/**
 * The look of the map: `plain` (the product register), `notebook` (the Cahier: ink lines on the paper in light, chalk on
 * the slate in dark, the margin's red for the main roads) or `muted` (the colours drawn back, so the places stand out).
 */
export type MapVariant = "plain" | "notebook" | "muted";

/** The scheme a map is asked for: `auto` follows the page (web) or the app (native). */
export type MapScheme = "dark" | "light" | "auto";

type Tokens = Record<string, string>;

/** The product register: the page's surfaces, the accent softened for the water, the roads in white (light) or a lift of the land (dark). */
function plainPalette(t: Tokens, dark: boolean) {
  const land = dark ? t.surface1! : t.surface0!;
  const ink = (by: number) => mix(land, t.textPrimary!, by);
  const pick = (d: number, l: number) => (dark ? d : l);
  return {
    land,
    background: dark ? t.surface0! : t.surface2!,
    water: mix(land, t.accent!, pick(0.18, 0.14)),
    park: mix(land, t.success!, pick(0.1, 0.12)),
    road: dark ? ink(0.12) : "#ffffff",
    roadMajor: ink(pick(0.2, 0.06)),
    casing: ink(pick(0.05, 0.12)),
    building: ink(pick(0.06, 0.07)),
    boundary: ink(0.3),
    label: t.textSecondary!,
    labelStrong: t.textPrimary!,
    halo: land,
    accent: t.accent!,
    onAccent: t.onAccent!,
    // The clusters and the pins' ring: a disc of the accent in the product register.
    cluster: { fill: t.accent!, stroke: land, text: t.onAccent! },
    point: { fill: t.accent!, stroke: land },
  };
}

type Palette = ReturnType<typeof plainPalette>;

/** `muted`: the colours drawn back, so the places stand out. */
function mutedPalette(plain: Palette, t: Tokens, dark: boolean): Palette {
  const land = plain.land;
  const grey = (c: string, by: number) => mix(c, land, by);
  const ink = (d: number, l: number) => mix(land, t.textPrimary!, dark ? d : l);
  return {
    ...plain,
    water: grey(plain.water, 0.45),
    park: grey(plain.park, 0.6),
    road: ink(0.08, 0.04),
    roadMajor: ink(0.14, 0.09),
    building: ink(0.04, 0.05),
    boundary: ink(0.18, 0.18),
    label: mix(land, t.textSecondary!, 0.8),
  };
}

/** `notebook`: the paper is the page's surface; the lines are the ink, drawn without casings, as with a pen. */
function notebookPalette(plain: Palette, t: Tokens, dark: boolean): Palette {
  const paper = t.surface0!;
  const margin = t.paperRuleMargin!;
  const on = (c: string, d: number, l: number) => mix(paper, c, dark ? d : l);
  const ink = t.textPrimary!;
  return {
    ...plain,
    land: paper,
    background: paper,
    water: on(t.accent!, 0.26, 0.2),
    park: on(t.paperTag!, 0.7, 0.55),
    road: on(ink, 0.32, 0.28),
    roadMajor: on(margin, 0.75, 0.7),
    casing: paper,
    building: on(ink, 0.1, 0.09),
    boundary: mix(paper, margin, 0.5),
    halo: paper,
    // A cluster is a manila tag with its eyelet edge; a single point is the margin's red.
    cluster: { fill: t.paperTag!, stroke: t.paperTagEdge!, text: t.paperTagInk! },
    point: { fill: margin, stroke: paper },
  };
}

/** The colours of the map in a scheme (and a brand, a variant): what the style, the markers, the clusters and the static map share. */
export function mapPalette(scheme: "dark" | "light", brand: MapBrand = "krizaka", variant: MapVariant = "plain") {
  const t = { ...themes[scheme], ...(brands as Record<string, Partial<Record<"dark" | "light", Partial<typeof themes.dark>>>>)[brand]?.[scheme] } as unknown as Tokens;
  const dark = scheme === "dark";
  const plain = plainPalette(t, dark);
  if (variant === "muted") return mutedPalette(plain, t, dark);
  if (variant === "notebook") return notebookPalette(plain, t, dark);
  return plain;
}

/** The roles of the basemap flavour that each colour of the palette paints. */
const FLAVOR_ROLES: Record<string, string> = {
  background: "background",
  land: "earth glacier sand beach hospital industrial school military aerodrome pedestrian",
  park: "park_a park_b wood_a wood_b scrub_a scrub_b zoo",
  building: "runway buildings pier",
  water: "water",
  boundary: "boundaries",
  casing: "railway minor_service_casing minor_casing link_casing major_casing_late major_casing_early highway_casing_late highway_casing_early bridges_other_casing bridges_minor_casing bridges_link_casing bridges_major_casing bridges_highway_casing tunnel_other_casing tunnel_minor_casing tunnel_link_casing tunnel_major_casing tunnel_highway_casing",
  road: "other minor_service minor_a minor_b link bridges_other bridges_minor bridges_link tunnel_other tunnel_minor tunnel_link",
  roadMajor: "major highway bridges_major bridges_highway tunnel_major tunnel_highway",
  label: "roads_label_minor roads_label_major ocean_label subplace_label state_label country_label address_label",
  halo: "roads_label_minor_halo roads_label_major_halo subplace_label_halo city_label_halo state_label_halo address_label_halo",
  labelStrong: "city_label",
};

/** The basemap flavour of a palette: every role of Protomaps' layers filled from the tokens. */
export function mapFlavor(scheme: "dark" | "light", brand?: MapBrand, variant?: MapVariant): Flavor {
  const c = mapPalette(scheme, brand, variant);
  const base = namedFlavor(scheme);
  return {
    ...base,
    ...Object.fromEntries(Object.entries(FLAVOR_ROLES).flatMap(([colour, roles]) => roles.split(" ").map((role) => [role, c[colour as "land"]]))),
    regular: "Noto Sans Regular",
    bold: "Noto Sans Medium",
    italic: "Noto Sans Italic",
    // No point-of-interest icons (no sprite to host): the app's own markers carry the places that matter.
    pois: undefined,
    landcover: undefined,
  };
}

/** A region of the basemap: its PMTiles file and the zoom up to which it has tiles. */
export type MapRegion = { url: string; maxzoom: number };

export type MapStyleOptions = {
  /** `dark` or `light`: the scheme of the page or the app. */
  scheme: "dark" | "light";
  /** The product whose accent the map carries (its markers, its water's tint). Default `krizaka`. */
  brand?: MapBrand;
  /** The look: `plain` (default), `notebook` (the Cahier's paper and ink) or `muted`. */
  variant?: MapVariant;
  /** The language of the labels (`fr`, `en`): the place names in it where OpenStreetMap has them. Default `en`. */
  lang?: string;
  /** The low zooms of the whole world. Default: our world extract (zoom 0–6). */
  world?: MapRegion | null;
  /** The detailed region drawn from zoom 7. Default: Montréal–Québec (up to 14, overzoomed beyond). */
  region?: MapRegion | null;
  /** The glyphs' URL template. Default: our Noto Sans on the CDN. */
  glyphs?: string;
};

/** The zoom where the detailed region takes over from the world. */
export const REGION_FROM_ZOOM = 6.5;

type StyleLayer = { id: string; minzoom?: number; maxzoom?: number; [k: string]: unknown };

/** The world's layers: the background once, the others under `world-` and cut where the region takes over. */
function worldLayers(layerList: StyleLayer[], hasRegion: boolean): StyleLayer[] {
  return layerList.map((l) => (l.id === "background" ? l : { ...l, id: `world-${l.id}`, maxzoom: hasRegion ? Math.min(l.maxzoom ?? 24, REGION_FROM_ZOOM) : l.maxzoom }));
}

/** The region's layers under `region-`, from the zoom where it takes over; its background only when there is no world. */
function regionLayers(layerList: StyleLayer[], hasWorld: boolean): StyleLayer[] {
  const out: StyleLayer[] = [];
  for (const l of layerList) {
    if (l.id !== "background") out.push({ ...l, id: `region-${l.id}`, minzoom: hasWorld ? Math.max(l.minzoom ?? 0, REGION_FROM_ZOOM) : l.minzoom });
    else if (!hasWorld) out.push(l);
  }
  return out;
}

/**
 * The MapLibre style of a Krizaka map (a `StyleSpecification`): the world's low zooms, then the detailed region,
 * painted from the tokens. The `pmtiles://` sources need the PMTiles protocol (the web `Map` registers it; MapLibre
 * Native reads it as it is).
 */
export function mapStyle({ scheme, brand, variant, lang = "en", world = { url: mapAssets().tiles.world, maxzoom: 6 }, region = { url: mapAssets().tiles.quebec, maxzoom: 14 }, glyphs = mapAssets().glyphs }: MapStyleOptions) {
  const flavor = mapFlavor(scheme, brand, variant);
  const attribution = `<a href="${MAP_ATTRIBUTION.protomapsUrl}">${MAP_ATTRIBUTION.protomaps}</a> · <a href="${MAP_ATTRIBUTION.osmUrl}">${MAP_ATTRIBUTION.osm}</a>`;
  const sources: Record<string, unknown> = {};
  const all: StyleLayer[] = [];
  if (world) {
    sources.world = { type: "vector", url: `pmtiles://${world.url}`, attribution };
    all.push(...worldLayers(layers("world", flavor, { lang }) as StyleLayer[], Boolean(region)));
  }
  if (region) {
    sources.region = { type: "vector", url: `pmtiles://${region.url}`, attribution };
    all.push(...regionLayers(layers("region", flavor, { lang }) as StyleLayer[], Boolean(world)));
  }
  // No sprite is hosted: a layer that needs an icon (points of interest) is left out — the app's markers carry the places.
  const drawn = all.filter((l) => !(l.layout as Record<string, unknown> | undefined)?.["icon-image"]);
  return { version: 8 as const, glyphs, sources, layers: drawn.map((l) => (l.maxzoom === undefined ? withoutKey(l, "maxzoom") : l)) };
}

const withoutKey = <T extends Record<string, unknown>>(o: T, key: string) => Object.fromEntries(Object.entries(o).filter(([k]) => k !== key)) as T;
