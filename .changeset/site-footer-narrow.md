---
"@krizaka/ui": patch
---

`SiteFooter` never makes a phone page scroll sideways: its frame and columns shrink to the screen (`minmax(0, 1fr)`,
`min-w-0`) and a long link wraps instead of pushing the page wider (seen on ui.krizaka.com at 350–390 px).
