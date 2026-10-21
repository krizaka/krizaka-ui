---
"@krizaka/ui": minor
---

**Cahier, the chrome (ADR-004, #417):** the bar is square paper — the floating bar, its items, its icon buttons and menus lose the pill (2 px); badges, chips, tabs, the language switch, toasts, progress and meter tracks, the step progress, the slot picker and the footer's tags are square too (dots stay round). The badge and the card's stat label lose their uppercase tracking; a `glass` card is an opaque sheet. A new test (`src/cahier.test.ts`) refuses an uppercase tracked label, a frosted chrome (outside a scrim over a media) and a pill on the chrome.
