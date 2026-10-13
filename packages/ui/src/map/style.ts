// The Krizaka map style, generated from the tokens (no hand-written colour): Protomaps' basemap layers
// (@protomaps/basemaps) painted with a flavour drawn from `@krizaka/tokens` — the surfaces for the land, the accent
// softened for the water, the text roles for the labels — in dark or light, the product's accent where a brand asks.
// Platform-neutral: the web `Map` and the native `Map` both read it.
import { brands, themes } from "@krizaka/tokens/native";
import { type Flavor, layers, namedFlavor } from "@protomaps/basemaps";

import type { BrandId } from "../marks/ProductLogo";
import { MAP_ATTRIBUTION, MAP_GLYPHS, MAP_TILES } from "./assets";

/** A colour mixed into another (`#rrggbb` only): `t` = 0 gives `a`, 1 gives `b`. */
export function mix(a: string, b: string, t: number): string {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `#${x.map((v, i) => Math.round(v + (y[i]! - v) * t).toString(16).padStart(2, "0")).join("")}`;
}

/** The colours of the map in a scheme (and a brand): what the style, the markers and the static map share. */
export function mapPalette(scheme: "dark" | "light", brand: BrandId = "krizaka") {
  const t = { ...themes[scheme], ...(brands as Record<string, Partial<Record<"dark" | "light", Partial<typeof themes.dark>>>>)[brand]?.[scheme] };
  const dark = scheme === "dark";
  const land = dark ? t.surface1 : t.surface0;
  return {
    land,
    background: dark ? t.surface0 : t.surface2,
    water: mix(land, t.accent, dark ? 0.18 : 0.14),
    park: mix(land, t.success, dark ? 0.1 : 0.12),
    road: dark ? mix(land, t.textPrimary, 0.12) : "#ffffff",
    roadMajor: dark ? mix(land, t.textPrimary, 0.2) : mix(land, t.textPrimary, 0.06),
    casing: mix(land, t.textPrimary, dark ? 0.05 : 0.12),
    building: mix(land, t.textPrimary, dark ? 0.06 : 0.07),
    boundary: mix(land, t.textPrimary, 0.3),
    label: t.textSecondary,
    labelStrong: t.textPrimary,
    halo: land,
    accent: t.accent,
    onAccent: t.onAccent,
  };
}

/** The basemap flavour of a palette: every role of Protomaps' layers filled from the tokens. */
export function mapFlavor(scheme: "dark" | "light", brand?: BrandId): Flavor {
  const c = mapPalette(scheme, brand);
  const base = namedFlavor(scheme);
  return {
    ...base,
    background: c.background,
    earth: c.land,
    park_a: c.park,
    park_b: c.park,
    wood_a: c.park,
    wood_b: c.park,
    scrub_a: c.park,
    scrub_b: c.park,
    glacier: c.land,
    sand: c.land,
    beach: c.land,
    zoo: c.park,
    hospital: c.land,
    industrial: c.land,
    school: c.land,
    military: c.land,
    aerodrome: c.land,
    pedestrian: c.land,
    runway: c.building,
    water: c.water,
    buildings: c.building,
    pier: c.building,
    boundaries: c.boundary,
    railway: c.casing,
    other: c.road,
    minor_service: c.road,
    minor_a: c.road,
    minor_b: c.road,
    link: c.road,
    major: c.roadMajor,
    highway: c.roadMajor,
    bridges_other: c.road,
    bridges_minor: c.road,
    bridges_link: c.road,
    bridges_major: c.roadMajor,
    bridges_highway: c.roadMajor,
    tunnel_other: c.road,
    tunnel_minor: c.road,
    tunnel_link: c.road,
    tunnel_major: c.roadMajor,
    tunnel_highway: c.roadMajor,
    minor_service_casing: c.casing,
    minor_casing: c.casing,
    link_casing: c.casing,
    major_casing_late: c.casing,
    major_casing_early: c.casing,
    highway_casing_late: c.casing,
    highway_casing_early: c.casing,
    bridges_other_casing: c.casing,
    bridges_minor_casing: c.casing,
    bridges_link_casing: c.casing,
    bridges_major_casing: c.casing,
    bridges_highway_casing: c.casing,
    tunnel_other_casing: c.casing,
    tunnel_minor_casing: c.casing,
    tunnel_link_casing: c.casing,
    tunnel_major_casing: c.casing,
    tunnel_highway_casing: c.casing,
    roads_label_minor: c.label,
    roads_label_minor_halo: c.halo,
    roads_label_major: c.label,
    roads_label_major_halo: c.halo,
    ocean_label: c.label,
    subplace_label: c.label,
    subplace_label_halo: c.halo,
    city_label: c.labelStrong,
    city_label_halo: c.halo,
    state_label: c.label,
    state_label_halo: c.halo,
    country_label: c.label,
    address_label: c.label,
    address_label_halo: c.halo,
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
  brand?: BrandId;
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

/**
 * The MapLibre style of a Krizaka map (a `StyleSpecification`): the world's low zooms, then the detailed region,
 * painted from the tokens. The `pmtiles://` sources need the PMTiles protocol (the web `Map` registers it; MapLibre
 * Native reads it as it is).
 */
export function mapStyle({ scheme, brand, lang = "en", world = { url: MAP_TILES.world, maxzoom: 6 }, region = { url: MAP_TILES.quebec, maxzoom: 14 }, glyphs = MAP_GLYPHS }: MapStyleOptions) {
  const flavor = mapFlavor(scheme, brand);
  const attribution = `<a href="${MAP_ATTRIBUTION.protomapsUrl}">${MAP_ATTRIBUTION.protomaps}</a> · <a href="${MAP_ATTRIBUTION.osmUrl}">${MAP_ATTRIBUTION.osm}</a>`;
  const sources: Record<string, unknown> = {};
  const all: { id: string; minzoom?: number; maxzoom?: number; [k: string]: unknown }[] = [];
  if (world) {
    sources.world = { type: "vector", url: `pmtiles://${world.url}`, attribution };
    for (const l of layers("world", flavor, { lang }) as typeof all) {
      if (l.id === "background") all.push(l);
      else all.push({ ...l, id: `world-${l.id}`, maxzoom: region ? Math.min(l.maxzoom ?? 24, REGION_FROM_ZOOM) : l.maxzoom });
    }
  }
  if (region) {
    sources.region = { type: "vector", url: `pmtiles://${region.url}`, attribution };
    for (const l of layers("region", flavor, { lang }) as typeof all) {
      if (l.id === "background") {
        if (!world) all.push(l);
        continue;
      }
      all.push({ ...l, id: `region-${l.id}`, minzoom: world ? Math.max(l.minzoom ?? 0, REGION_FROM_ZOOM) : l.minzoom });
    }
  }
  // No sprite is hosted: a layer that needs an icon (points of interest) is left out — the app's markers carry the places.
  const drawn = all.filter((l) => !(l.layout as Record<string, unknown> | undefined)?.["icon-image"]);
  return { version: 8 as const, glyphs, sources, layers: drawn.map((l) => (l.maxzoom === undefined ? withoutKey(l, "maxzoom") : l)) };
}

const withoutKey = <T extends Record<string, unknown>>(o: T, key: string) => Object.fromEntries(Object.entries(o).filter(([k]) => k !== key)) as T;
