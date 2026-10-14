---
"@krizaka/ui": minor
---

`LinkCard` pins its foot (the facts in `extra`, then the way in `cta`) to the bottom of the card, so in a `CardGrid` row whose sentences have different lengths the status chips and the links sit on one line and the card bottoms line up. New `footerAlign="bottom" | "top"` (default `bottom`; `top` keeps the previous flow under the text) — a card that is already as tall as its content looks the same. The foot is one `.kz-link-card-foot` element wrapping `extra` and `cta`. New example `card-grid/aligned` and a story that measures the row in the browser (one height, facts and links on one line).
