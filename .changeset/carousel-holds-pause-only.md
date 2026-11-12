---
"@krizaka/ui": minor
---

`MediaCarousel`: an autoplaying carousel no longer freezes under the pointer or on a keyboard focus, and a click on previous / next no longer stops it (WCAG 2.2.2: the visible Pause / Play is the one hold; its label and `aria-pressed` follow the one paused state). A hidden tab, off screen, reduced motion and Save-Data still hold. Behaviour change: to keep the old holds, pass the new `holds="pointer-focus"` (default `"pause-only"`).
