---
"@krizaka/ui": minor
---

`ChangelogPage` gains the `security` and `breaking` kinds (words and colour, both themes), and `@krizaka/ui/changelog-page` ships its data adapter: `parseChangesets` (a changesets CHANGELOG.md), `parseReleaseBody` (a GitHub Release), `draftFromTitles` / `changeFromTitle` (conventional PR titles to a plain-language draft), `kindOfTag`, `anchorOf`, `newestFirst` and `changelogRss` (an RSS 2.0 feed) — one `Release` shape for every Krizaka site's changelog (krizaka/krizaka-ui#307).
