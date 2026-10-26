---
"@krizaka/ui": minor
---

`@krizaka/ui/environment-notice` (web) and `EnvironmentNotice` in `@krizaka/ui/native`: the « development version » band — a thin region above the app bar, in the page frame, with the title, the line and an optional link as props,. `environmentNotice(config)` is the rule: it returns `null` for the stages `production` and `prod`, so the app reads its stage once and production shows nothing (krizaka-ui#712).
