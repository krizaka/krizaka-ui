/**
 * @krizaka/ui/map/cards — what a place says under or beside the map: `MapInfoCard` (title, meta, status, one action),
 * `RouteCard` (the person's own navigation apps, optional times) and `routeLinks` (the deep links). Apart from `./map`, so
 * a page that only draws a map does not pay for them. Client ("use client").
 */
export { mapCard, MapInfoCard, type MapInfoCardProps, RouteCard, type RouteCardProps, type RouteTime } from "./map-cards";
export { ROUTE_APPS, type RouteApp, type RouteLinks, routeLinks } from "./route-links";
