---
"@krizaka/ui": minor
---

New `SkipLink` (`@krizaka/ui/skip-link`): the standalone "skip to content" link for app shells that keep their own layout (WCAG 2.4.1). Visually hidden until focused, then a visible pill above everything in the brand ring; its label is passed translated, `href` defaults to `#content`, and Enter really moves focus to the target. `MarketingLayout` uses it, and `AppShell.Root` takes `skipLabel` (the link lands on `AppShell.Main`, now `id="content"`).
