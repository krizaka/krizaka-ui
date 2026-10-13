/// <reference types="geojson" />

// Plain geometry for the maps, web and native (no DOM, no React): distances, circles, the Web Mercator projection.

/** A position: longitude, latitude (GeoJSON's order, MapLibre's `LngLat`). */
export type LngLat = readonly [lng: number, lat: number];

const R = 6_371_008.8;
const rad = (d: number) => (d * Math.PI) / 180;

/** The great-circle distance between two positions, in metres (haversine). */
export function distanceMeters(a: LngLat, b: LngLat): number {
  const dLat = rad(b[1] - a[1]);
  const dLng = rad(b[0] - a[0]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[1])) * Math.cos(rad(b[1])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** A circle of `radius` metres around `center` as a GeoJSON polygon (`steps` points): a delivery zone, a search radius. */
export function circlePolygon(center: LngLat, radius: number, steps = 64): GeoJSON.Feature<GeoJSON.Polygon> {
  const [lng, lat] = center;
  const d = radius / R;
  const ring: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const brg = (2 * Math.PI * i) / steps;
    const lat2 = Math.asin(Math.sin(rad(lat)) * Math.cos(d) + Math.cos(rad(lat)) * Math.sin(d) * Math.cos(brg));
    const lng2 = rad(lng) + Math.atan2(Math.sin(brg) * Math.sin(d) * Math.cos(rad(lat)), Math.cos(d) - Math.sin(rad(lat)) * Math.sin(lat2));
    ring.push([(lng2 * 180) / Math.PI, (lat2 * 180) / Math.PI]);
  }
  return { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [ring] } };
}

/** The Web Mercator pixel of a position at a zoom (256-px tiles): what a static map draws without an engine. */
export function project([lng, lat]: LngLat, zoom: number): [number, number] {
  const scale = 256 * 2 ** zoom;
  const s = Math.sin(rad(Math.max(-85.0511, Math.min(85.0511, lat))));
  return [((lng + 180) / 360) * scale, (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * scale];
}

/** A distance written the locale's way: metres under 1 km, kilometres (one decimal under 10) above. */
export function formatDistance(meters: number, locale: string): string {
  if (meters < 1000) return new Intl.NumberFormat(locale, { style: "unit", unit: "meter", maximumFractionDigits: 0 }).format(Math.round(meters / 10) * 10);
  return new Intl.NumberFormat(locale, { style: "unit", unit: "kilometer", maximumFractionDigits: meters < 10_000 ? 1 : 0 }).format(meters / 1000);
}
