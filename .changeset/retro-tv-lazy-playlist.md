---
"@krizaka/ui": patch
---

`RetroTv`: the playlist (transitions, bar, seek, captions, sound chip and their styles) is its own chunk, loaded only when a `playlist` is given. A single clip or an embed (a shop's video) no longer downloads it (akinaza perf budget).
