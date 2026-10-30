/**
 * @krizaka/ui/map — maps on MapLibre GL JS (open source) over Protomaps tiles on the Krizaka CDN, styled from the
 * tokens: `Map`, `Marker`, `Cluster`, `UserPosition`, `RadiusCircle`, `LocationPicker`, `StaticMap` (the fallback), the
 * style (`mapStyle`, `mapPalette`) and the geometry (`distanceMeters`, `circlePolygon`, `formatDistance`). The pin (`MapPin`) is `@krizaka/ui/map/pin`, the place sheet is
 * `@krizaka/ui/map/sheet` and the cards (`MapInfoCard`, `RouteCard`, `routeLinks`) `@krizaka/ui/map/cards`: a page that only draws a map
 * does not pay for them. maplibre-gl
 * and pmtiles are optional peers, loaded when a map is shown. Client ("use client").
 */
export { MAP_ATTRIBUTION, MAP_GLYPHS, MAP_TILES, mapAssets, setMapAssetsBase } from "./assets";
export { circlePolygon, distanceMeters, formatDistance, type LngLat, pathLength, pointAlong, project, sliceLine } from "./geo";
export { LocationPicker, locationPicker, type LocationPickerLabels, locationPickerLabels, type LocationPickerProps } from "./location-picker";
export {
  Cluster,
  type ClusterPoint,
  type ClusterProps,
  configureMaps,
  Map,
  map,
  type MapLabels,
  mapLabels,
  type MapProps,
  Marker,
  type MarkerProps,
  Pulse,
  type PulseProps,
  RadiusCircle,
  type RadiusCircleProps,
  Route,
  type RouteProps,
  useMap,
  UserPosition,
  type UserPositionProps,
} from "./map";
export { StaticMap, staticMap, type StaticMapPlace, type StaticMapProps } from "./static-map";
export { type MapBrand, mapFlavor, mapPalette, type MapRegion, type MapScheme, mapStyle, type MapStyleOptions, type MapVariant, mix, REGION_FROM_ZOOM } from "./style";
