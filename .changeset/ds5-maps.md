---
"@krizaka/ui": minor
---

Maps, open source and free (DS5): `@krizaka/ui/map` — `Map` on MapLibre GL JS over Protomaps PMTiles hosted on the
Krizaka CDN (the world to zoom 6, Montréal–Québec to 14; no API key, no metered service), its style generated from the
tokens in dark and light and the product's accent (`mapStyle`, `mapPalette`), `Marker` (a button when it does something),
`Cluster`, `UserPosition` (a pulse, still under reduced motion), `RadiusCircle`, `LocationPicker` (the pin, the distance
chip, Near me asking for the position only when pressed) and `StaticMap` (the fallback without WebGL, the picture of a
card) — the places read as a list in place of the canvas, the OpenStreetMap (ODbL) and Protomaps attribution always
drawn. `@krizaka/ui/native/map` brings the same on MapLibre Native (details in a `Sheet`). `maplibre-gl` and
`@maplibre/maplibre-react-native` are optional peers; `pmtiles`, `@protomaps/basemaps` and `@krizaka/tokens` are
dependencies. `tools/map-assets.mjs` publishes and checks the tiles and glyphs. The skill `skills/map/SKILL.md`.
