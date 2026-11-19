---
"@krizaka/ui": patch
---

`ArchitectureDiagram` writes every coordinate it computes (arrowheads, label plates, text lines, step badges, component tabs) to a tenth of a pixel: no float's long tail in the page (`579.6999999999999`), which a site's publication check read as a card number (krizaka-internal#4184).
