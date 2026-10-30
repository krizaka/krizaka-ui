---
"@krizaka/ui": patch
---

ShopGallery: on desktop, with an odd count of five photos or more, the lead tile kept the phone strip's 4/5 ratio and painted taller than its 2:1 grid, overlapping the next heading. The lead tile takes its ratio from the grid, and the tracks are `minmax(0, 1fr)` so no photo can stretch them (akinaza#572).
