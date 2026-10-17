---
"@krizaka/ui": patch
---

Tabs (pills) and the other sideways-scrolling rows (settings nav, shorts shelf, date-picker presets, day strip, table of contents) no longer draw a vertical scrollbar. `overflow-x` forced `overflow-y` to `auto`, so a 1–2 px overhang (a focus ring, a border) showed a thin thumb at the end of the bar. These rows now clip vertically, keep the sideways scroll, hide their scrollbar, and get their focus ring room from padding.
