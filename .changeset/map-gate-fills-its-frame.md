---
"@krizaka/ui": patch
---

fix(shop): `MapGate` — the live map fills its frame (krizaka/akinaza#488). The live `Map` is `absolute inset-0` inside the gate's aspect-ratio box and had no height of its own, so on a laptop it measured 0 px and drew as an empty grey box (MapLibre fell back to its 300 px canvas). The gate now gives the map `h-full w-full` (the host's `map.className` still wins).
