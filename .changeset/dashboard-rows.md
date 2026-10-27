---
"@krizaka/ui": patch
---

`DashboardLayout`: the grid of widgets is `content-start`, so next to a taller side column its rows keep the height of their content instead of stretching (an empty folder's card was 500 px tall in Yomizaka's binder, yomizaka#435).
