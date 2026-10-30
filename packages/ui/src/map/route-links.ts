// Server-safe, pure. The links that open a destination in the person's own navigation app: Apple Maps, Google Maps,
// OpenStreetMap, Waze and public transit. No key, no request: a URL each, opened by the person.
import type { LngLat } from "./geo";

export type RouteLinks = {
  apple: string;
  google: string;
  osm: string;
  waze: string;
  /** Google Maps in transit mode: the only one of the five that plans buses and metro without an account. */
  transit: string;
};

export type RouteApp = keyof RouteLinks;

/** The apps in the order a menu shows them. */
export const ROUTE_APPS: readonly RouteApp[] = ["apple", "google", "osm", "waze", "transit"];

const at = ([lng, lat]: LngLat) => `${round(lat)},${round(lng)}`;
const round = (n: number) => Math.round(n * 1e6) / 1e6;

/** One URL per navigation app for a trip to `destination` (from `origin` when known, else from where the app finds the person). */
export function routeLinks(destination: LngLat, origin?: LngLat): RouteLinks {
  const to = at(destination);
  const from = origin ? at(origin) : undefined;
  const google = (mode: string) => `https://www.google.com/maps/dir/?api=1&destination=${to}${from ? `&origin=${from}` : ""}&travelmode=${mode}`;
  return {
    apple: `https://maps.apple.com/?daddr=${to}${from ? `&saddr=${from}` : ""}&dirflg=d`,
    google: google("driving"),
    osm: from
      ? `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${from};${to}`
      : `https://www.openstreetmap.org/?mlat=${round(destination[1])}&mlon=${round(destination[0])}#map=16/${to.replace(",", "/")}`,
    waze: `https://waze.com/ul?ll=${to}&navigate=yes`,
    transit: google("transit"),
  };
}
