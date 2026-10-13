---
name: krizaka-map
description: Maps in a Krizaka app (Next.js or Expo) with @krizaka/ui/map and @krizaka/ui/native/map — MapLibre (open source) over Protomaps PMTiles on the Krizaka CDN, no API key and no metered service, the style generated from the tokens (dark/light, the product's accent): Map, Marker, Cluster, UserPosition, RadiusCircle, LocationPicker (distance chip, Near me), StaticMap (fallback), mapStyle, distanceMeters. Use it instead of Mapbox, Google Maps, Leaflet with raster tiles or react-native-maps.
---

# @krizaka/ui/map · @krizaka/ui/native/map

## Rules

1. Never Mapbox or Google Maps (keys, per-view bills): MapLibre + our PMTiles. Install the engine only in the app that
   shows a map: web `maplibre-gl` (≥ 6), Expo `@maplibre/maplibre-react-native` (≥ 11, with its config plugin and the
   location usage strings). `pmtiles` and `@protomaps/basemaps` come with `@krizaka/ui`.
2. Every `Map` has a `label`, every `Marker` / `Cluster` point a `label`: they are the text alternative (a list of places
   on the web, the map's name on native). Give the web `Map` a `fallback` — a `StaticMap` with the same centre and places.
3. Pass the product: `brand="orochia"` paints the accent (markers, the water's tint); the scheme follows the page
   (`html.light`) or the native theme.
4. Ask for the position only when the person presses Near me (`LocationPicker`); never on load. Every answer has its words
   (`labels.denied`, `labels.unavailable`), passed translated.
5. Details of a place: a panel on the web, a `Sheet` (`@krizaka/ui/native`) on a phone, opened from `Marker onPress`.
6. Tiles: the defaults are the world (zoom 0–6) and Montréal–Québec (to 14). Another region is an extract published by
   `tools/map-assets.mjs` (krizaka-ui) and passed as `region={{ url, maxzoom }}`. The attribution (OpenStreetMap, ODbL;
   Protomaps) is drawn by the components — never hide it.

## Recipes

```tsx
import { Map, Marker, StaticMap, LocationPicker } from "@krizaka/ui/map";

<Map label={t("pickup.title")} center={[-73.59, 45.52]} zoom={13} brand="orochia" className="h-80"
  fallback={<StaticMap label={t("pickup.title")} center={[-73.59, 45.52]} zoom={13} places={spots} />}>
  {spots.map((s) => <Marker key={s.id} position={s.position} label={s.label} selected={s.id === chosen} onPress={() => setChosen(s.id)} />)}
</Map>
<LocationPicker label={t("meet.point")} locale={locale} value={point} onValueChange={setPoint} radius={1000}
  labels={{ nearMe: t("meet.nearMe"), denied: t("meet.denied"), distance: (d) => t("meet.distance", { d }) }} />
```
