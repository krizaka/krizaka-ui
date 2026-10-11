---
"@krizaka/ui": minor
---

**Page blocks** (W4 of #49, closes #63): the pieces every page of a Krizaka site is made of, in a new `blocks` category
of krizaka.com/docs/ui — twelve entries, words as props, the brand through `.brand-<id>`, a subject's colour through
`--kz-hue`, styles in `@krizaka/ui/blocks.css`, imported once by the app (`import "@krizaka/ui/blocks.css"` in its root layout).

- `@krizaka/ui/page` — `Page` (one width `--kz-page-max`, one pair of gutters `--kz-page-gutter`: the bar, the hero and
  every section share their edges), `Section` (heading, `divider`, `spacing`, the brand's `backdrop`), `SectionHeading`,
  `Facts`, `Ticks`.
- `@krizaka/ui/page-hero` — `PageHero`: back link, eyebrow, h1, lead, facts or actions, the page's bird; painted at once.
- `@krizaka/ui/card-grid` — `CardGrid`: responsive, equal rows, staggered reveal, the pointer's light.
- `@krizaka/ui/pointer-light` — `PointerLight`, `usePointerLight`.
- `@krizaka/ui/link-card` — `LinkCard`: an entry point, the whole card one link (icon, title, sentence, the way in).
- `@krizaka/ui/argument-card` — `ArgumentCard`, compact: the trap in one line, the way in; the long version in a panel.
- `@krizaka/ui/mascot-quote` — `MascotQuote`: a rule told by a bird (`inline`, `callout`).
- `@krizaka/ui/decision-list` — `DecisionList`: chose · refused · because · what it costs.
- `@krizaka/ui/code-block` — `CodeBlock` (file, highlighted code on the tokens, copy) and `CodeTabs` (Maven · Gradle · npm).
- `@krizaka/ui/action-bar` — `ActionBar`: link actions as buttons, or icon buttons with a CSS tooltip.
- `@krizaka/ui/cta-panel` — `CtaPanel`: the call to act at the end of a section or a page.
- `@krizaka/ui/toc` — `Toc` and `TocLayout`: the sections of a reading page, the one being read marked.
