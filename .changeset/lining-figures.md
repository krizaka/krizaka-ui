---
"@krizaka/tokens": minor
"@krizaka/tailwind": minor
"@krizaka/ui": minor
---

Lining figures (ADR-004, krizaka-ui#417): Young Serif draws old-style digits by default, so a statistic's « 4 514 » and « 39 » sat on uneven heights. `--kz-figures` (`lining-nums tabular-nums`) is the token for every figure; the preset makes `tabular-nums` lining too (an explicit `oldstyle-nums` still wins); NumberTicker, the stat band, the price, the chapter and error numbers, the decision numbers and the story's stats read the token; native `fontVariant` asks for `lining-nums`.
