---
"@krizaka/ui": minor
---

`VerticalVideo` takes `fit="fill"`: in a box that has its own size (a bento tile, a grid cell) the clip covers it edge to edge instead of drawing a small 9:16 frame inside it; the caption's name line wraps and stays clear of the action rail (the disclosure no longer runs under the share count). `Progress` never cuts a short label to make room for its figure: in a narrow box the figure goes under the label. The `glow-card/plans` example lays its columns out on its container (three side by side only when each has room), its buttons span their card on one line with short labels; the `chat/conversation` example, given a height, sits its messages on the composer.
