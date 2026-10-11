// Writes src/geo/world-110m.json, the world GeoMap and Globe3D draw: Natural Earth's 1:110m countries (public
// domain) through world-atlas (ISC), as TopoJSON (shared borders, quantised: ~38 kB gzipped), each country keyed by
// its ISO 3166-1 alpha-2 code (`FR`, `US`) — what an app's data carries — and named in English. Loaded lazily, only
// by the charts that draw a map. Run `pnpm --filter @krizaka/charts world` after a world-atlas update.
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";

import countries from "i18n-iso-countries";

const require = createRequire(import.meta.url);
const topology = JSON.parse(readFileSync(require.resolve("world-atlas/countries-110m.json"), "utf8"));
// Natural Earth names a few territories without an ISO number: give them the code their users expect.
const UNNUMBERED = { Kosovo: "XK", "N. Cyprus": "CY", Somaliland: "SO" };
const objects = topology.objects.countries;
let missing = 0;
objects.geometries = objects.geometries.map((g) => {
  const code = (g.id && countries.numericToAlpha2(g.id)) || UNNUMBERED[g.properties.name] || null;
  if (!code) missing += 1;
  return { ...g, id: code ?? undefined, properties: { name: g.properties.name } };
});
delete topology.objects.land;
const out = resolve(import.meta.dirname, "..", "src", "geo", "world-110m.json");
writeFileSync(out, JSON.stringify(topology));
console.log(`world: ${objects.geometries.length} countries (${missing} without a code) → src/geo/world-110m.json`);
