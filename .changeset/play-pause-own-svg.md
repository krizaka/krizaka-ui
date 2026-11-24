---
"@krizaka/ui": patch
---

The play and pause glyphs draw their own filled svg instead of importing the `Glyph` base: the base keeps one importer group (the shell's glyphs), so a bundler that splits by importer no longer makes it a separate module on every route.
