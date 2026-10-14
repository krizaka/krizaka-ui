/* The maps of the documentation read their tiles from the Krizaka CDN, cross-origin. Until the CDN answers with
   CORS headers (or offline), a live map would draw an empty grid: a map example shows a photograph of itself rendered
   with its tiles instead (lib/map-snapshots.json), and becomes live as soon as the tiles can be read. Pure. */

import data from "./map-snapshots.json" with { type: "json" };

export type MapSnapshot = { dark: string; light: string };

const SNAPSHOTS: Record<string, MapSnapshot> = data.examples;

/** The photograph of a map example (`map/places`), or null for an example that needs no tiles. */
export function mapSnapshotOf(key: string): MapSnapshot | null {
  return SNAPSHOTS[key] ?? null;
}
