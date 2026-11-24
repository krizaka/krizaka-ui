---
"@krizaka/ui": patch
---

`@krizaka/ui/pausable-loop` draws its play and pause glyphs from per-glyph modules: importing it no longer pulls the shared glyph set into a page's client bundle.
