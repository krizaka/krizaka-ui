---
"@krizaka/ui": minor
---

`@krizaka/ui/columns` (web): `Grid` and `Columns`, the twins of the native ones with the same props (`columns` per size class, `minItemWidth`, `gap`, `maxColumns`, `equalHeight`, `fontScale`; `weights`, `minColumnWidth`, `gap`). They decide on the width of their container, not the viewport — compact < 600 px, regular < 840 px, expanded from there — in CSS (`@container`), with no JS measuring; widths are in `rem`, so text at 200 % stacks what no longer fits; the order is kept and mirrors in `rtl`.
