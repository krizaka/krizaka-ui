// Where the basemap lives: Protomaps PMTiles extracts on the Krizaka CDN (Bunny), uploaded by tools/map-assets.mjs.
// No API key, no metered service: one file per region, read by HTTP range requests. A new extract is a new file (its
// build date in the name) and a new default here.

const CDN = "https://krizaka-assets.b-cdn.net/maps/v1";

/** The basemap extracts: OpenStreetMap data built by Protomaps (ODbL). `world` up to zoom 6, `quebec` (Montréal–Québec) up to 14. */
export const MAP_TILES = {
  world: `${CDN}/tiles/world-20261012.pmtiles`,
  quebec: `${CDN}/tiles/quebec-20261012.pmtiles`,
} as const;

/** The glyphs of the labels (Noto Sans, SIL OFL): `{fontstack}` and `{range}` filled by MapLibre. */
export const MAP_GLYPHS = `${CDN}/fonts/{fontstack}/{range}.pbf`;

/** The words every map shows, as the licences ask: OpenStreetMap's contributors (ODbL) and Protomaps. */
export const MAP_ATTRIBUTION = { osm: "© OpenStreetMap contributors", osmUrl: "https://www.openstreetmap.org/copyright", protomaps: "Protomaps", protomapsUrl: "https://protomaps.com" } as const;
