---
"@krizaka/ui": minor
---

`NumberTicker` joins the motion vocabulary: `duration` now drives the digit roll (`trigger="change"`) as well as the climb, and the new `easing` (`ease-out`, `linear`, `ease-in-out` or any CSS easing) shapes both, through `--kz-count-duration` / `--kz-count-ease` on the figure. Unset, nothing changes.
