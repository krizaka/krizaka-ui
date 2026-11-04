---
"@krizaka/ui": minor
---

`Map` leaves the wheel and one finger to the page: in a page the wheel scrolls past the map, which zooms with Ctrl/⌘ + wheel, two fingers and its buttons, and the engine's own overlay says so in the map's words (`labels.gestureHelp`: MapLibre's `CooperativeGesturesHandler.*HelpText` keys). A map that is the whole screen opts back in with `gestures="map"` (default `page`).
