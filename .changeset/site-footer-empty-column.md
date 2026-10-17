---
"@krizaka/ui": patch
---

`SiteFooter`: a `SiteFooter.Column` with no link (empty, `null` or `false` children) now renders nothing instead of a heading over an empty list, the site's own columns share the row with an auto-fit grid (it was a fixed 2/3-column grid that left empty cells beside a single column on the Kachizaka and Yomizaka dev sites), and falsy children are dropped one by one.
