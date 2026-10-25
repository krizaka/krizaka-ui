---
"@krizaka/ui": patch
---

DataTable: on a phone, a card never scrolls sideways — values wrap (`min-width: 0`, `overflow-wrap: anywhere`) instead of being cut at the frame's edge, even with untyped columns.
