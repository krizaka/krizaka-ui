---
"@krizaka/ui": minor
---

`@krizaka/ui/map` motion: `Route` (a line that draws itself once when the map is on screen, and a `courier` that makes a trip — one, or `repeatAfter` while visible; finite frames, nothing runs afterwards), `Pulse` (a heat pulse around a hot spot), `Marker drop={delay}` (a pin that drops onto its place), and the geometry behind them (`pathLength`, `pointAlong`, `sliceLine`). Everything is in place at once under reduced motion; the route is read in the list of places. Example `map/route`.
