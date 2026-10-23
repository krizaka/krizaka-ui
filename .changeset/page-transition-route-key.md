---
"@krizaka/ui": minor
---

`PageTransition` takes `routeKey` (the router's pathname): only a change of page animates, an update on the same page — a
dialog opened through the address, a filter, a search parameter — no longer cross-fades the whole page and freezes its
layers mid-fade. Without `routeKey` the former behaviour stays.
