---
"@krizaka/ui": minor
---

`Tabs` as routes: `Tabs.Nav` + `Tabs.NavLink`. Each tab is a link (`href`, or your router's `Link` with `asChild`), the active one comes from the current route passed in (`current`: the path with its search; `isTabActive` is exported), so the URL is the state and no local state exists. Per WAI-ARIA these are links in a named navigation with `aria-current="page"` (not a tablist): Tab walks them, Enter follows. Same three variants and the same gliding light as `Tabs.List`. Tests, meta and an example (`routes`) included.
