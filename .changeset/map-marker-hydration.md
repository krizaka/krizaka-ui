---
"@krizaka/ui": patch
---

`Marker` (the map) no longer breaks hydration: its host element was created in a `useState` initializer that differed between the server (nothing) and the browser (an element portalled into), so React threw away the server HTML of every page that drew a marker. It now uses `useSyncExternalStore` with a server snapshot — same first render on both sides. Test: render to a string with no `document`, hydrate, no recoverable error.
