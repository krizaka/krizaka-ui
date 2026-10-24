---
"@krizaka/ui": minor
---

`@krizaka/ui/chapter` (#617): `ChapterIndex`, `ChapterHead` and `ChapterFoot` — the chapters of a story on the Cahier's ruled lines, never boxes. The index is an ordered list, one ruled line per chapter: the number hangs in the margin beside its red rule, the serif title is the link (its hit area the whole row), the period is quiet on the right (under the title in a narrow column), the latest wears a small « New » in the hue; an optional `detail` adds a second line. The head hangs the number in the margin beside the `h1`, then one quiet line (period · reading time) and the faced → built standfirst once (the arrow is drawn, a screen reader hears `versusLabels`). The foot puts the previous and next chapters on the lines (`rel="prev"`/`"next"`) and one line back to the story. They reuse `Page`'s paper (`data-paper="lines"`, aligned on the rows) and margin (`data-margin`, the `§` numbers' ink); every word is a prop.
