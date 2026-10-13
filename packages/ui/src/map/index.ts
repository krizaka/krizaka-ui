/**
 * @krizaka/ui/map — maps on MapLibre GL JS (open source) over Protomaps tiles on the Krizaka CDN, styled from the
 * tokens: `Map`, `Marker`, `Cluster`, `UserPosition`, `RadiusCircle`, `LocationPicker`, `StaticMap` (the fallback), the
 * style (`mapStyle`, `mapPalette`) and the geometry (`distanceMeters`, `circlePolygon`, `formatDistance`). maplibre-gl
 * and pmtiles are optional peers, loaded when a map is shown. Client ("use client").
 */
export { MAP_ATTRIBUTION, MAP_GLYPHS, MAP_TILES } from "./assets";
export { circlePolygon, distanceMeters, formatDistance, type LngLat, project } from "./geo";
export { LocationPicker, locationPicker, type LocationPickerLabels, locationPickerLabels, type LocationPickerProps } from "./location-picker";
export {
  Cluster,
  type ClusterPoint,
  type ClusterProps,
  Map,
  map,
  type MapLabels,
  mapLabels,
  type MapProps,
  Marker,
  type MarkerProps,
  RadiusCircle,
  type RadiusCircleProps,
  useMap,
  UserPosition,
  type UserPositionProps,
} from "./map";
export { StaticMap, staticMap, type StaticMapPlace, type StaticMapProps } from "./static-map";
export { mapFlavor, mapPalette, type MapRegion, mapStyle, type MapStyleOptions, mix, REGION_FROM_ZOOM } from "./style";
