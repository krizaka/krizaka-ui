---
"@krizaka/ui": patch
---

`.kz-grow` really grows a chart: it wipes the whole SVG in from the left (`kz-grow-wipe`) instead of drawing each path's stroke, which never matched the charts' markup (classes, not stroke attributes). Works on a Sparkline's line, area and bars alike.
