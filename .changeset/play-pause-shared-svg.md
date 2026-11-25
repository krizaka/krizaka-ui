---
"@krizaka/ui": patch
---

The play and pause glyphs share one small svg module of their own (no `Glyph` base, no `focusable` attribute): the module that a video route loads is about 120 B smaller than in 5.3.3.
