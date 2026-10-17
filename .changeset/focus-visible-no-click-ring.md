---
"@krizaka/tailwind": patch
"@krizaka/ui": patch
---

Focus rings only for the keyboard. A mouse click on a link (the brand, a nav item, a card) no longer shows a blue outline: the preset's base layer hides the outline of any element that is focused without `:focus-visible`, and gives keyboard focus on an element without its own ring the token ring (`--kz-ring`, the signature offset). The skip link's ring follows `:focus-visible` too.
