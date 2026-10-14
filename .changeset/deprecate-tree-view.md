---
"@krizaka/ui": minor
---

Deprecation is a status of the registry: a component marked `deprecated` carries `{ since, removedIn, use, reason }` (checked by the registry test) and krizaka.com/docs/ui flags it. `TreeView` (`@krizaka/ui/tree-view`) is the first: no product uses it and no planned work needs it, it still works and goes in 4.0.0 — drill down with `List` instead.
