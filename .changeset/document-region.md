---
"@krizaka/ui": minor
---

DocumentViewer lights a region of a page, not only a quote: `highlights` accept `region: { page, x, y, width, height }` (fractions of the page) with an optional `quote`; a valid region wins, a region outside the pages is never drawn (`locateRegion`, `resolveHighlight`, `Located.match: "region"`) (#898).
