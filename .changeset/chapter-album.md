---
"@krizaka/ui": minor
---

`ChapterIndex variant="album"` (#621): each chapter's `cover` as a `TapedPhoto` beside its title, one short line (`detail`) and its period — the rows alternate left and right, the prints face each other, each keeps its own aspect-ratio (no layout shift), the covers after the first two load lazily. Fix (#620): inside a `Page` that already draws the margin, a nested margin (the chapter blocks, a Section) draws no second red rule.
