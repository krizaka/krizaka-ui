---
"@krizaka/ui": patch
---

One router context for the whole package: `ChoiceGrid`, the account settings and the code block (built apart from `@krizaka/ui/router`) bundled their own copy of it, so their `routeKey` ignored the adapter given to `RouteStateProvider` and fell back to the browser's history. Every block now imports `@krizaka/ui/router` itself.
