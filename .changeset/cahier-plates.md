---
"@krizaka/ui": minor
---

**Cahier, the blocks' own corners and shadows (ADR-004, #417):** every card corner of 10 px or more in `blocks.css` and `motion.css` is square paper, and every blurred shadow (the templates' coloured stage glow included) is gone or the paper offset. The landing and product templates' visual is a plate, no longer a fake browser window: the three dots are gone, the bar is its caption. `src/cahier.test.ts` now also reads the shipped stylesheets.
