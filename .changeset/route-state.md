---
"@krizaka/ui": minor
"@krizaka/config": minor
---

The URL is the state, made impossible to forget (Oussama, 2026-10-22: « changer les tabs doit changer les routes »).

- New `@krizaka/ui/router`: `useRouteState(key, { values, default, history })` keeps a value in a search parameter, typed from an `as const` list (an unknown value reads as the default, the default is never written, other parameters are kept); `RouteStateProvider` takes your router's adapter once (the History API is the default); pure `readRouteValue` / `writeRouteValue`.
- `routeKey` (+ `routeValues`) on `Tabs.Root`, `Chip.Group` (single) and `ChoiceGrid`: they bind to the URL, no `useState`. Local state stays for ephemeral UI only.
- `@krizaka/config`: the rule `krizaka/route-state-selection` (in `krizakaStack()`, severity of the stack, only pages and route components) refuses a Tabs / Chip.Group / ChoiceGrid / SegmentedControl / ToggleGroup driven by local state without `routeKey`, unless the line carries `// @ephemeral: <reason>`; the ratchet counts it as `routeStateSelection` (only goes down).
