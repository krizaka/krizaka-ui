---
"@krizaka/ui": patch
---

The play and pause glyphs leave the chunk the shell imports: `app-shell` and `rail-nav` no longer load them on every route; only the media entries that draw them do (the shared glyph set stops re-exporting them).
