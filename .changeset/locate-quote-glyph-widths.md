---
"@krizaka/ui": patch
---

`locateQuote` (DocumentViewer): a quote starting in the middle of a text item is boxed from where its glyphs start (shared by sans-serif advance widths) instead of an even share of the item, so highlights no longer begin a few characters late.
