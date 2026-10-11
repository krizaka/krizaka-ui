---
"@krizaka/tokens": minor
"@krizaka/tailwind": minor
---

The Krizaka typography in the tokens. `--kz-font-sans` is Inter, `--kz-font-display` Plus Jakarta Sans (no longer an
alias of sans), `--kz-font-mono` JetBrains Mono — each followed by its metric-matched fallback of `@krizaka/fonts` —
and `--kz-font-text` aliases sans. The type scale `--kz-type-<step>-{size,line-height,weight,tracking}` (display-2xl …
display-sm, title-lg, title-md, body-lg/md/sm, caption, overline, mono-md, mono-sm), exported as `typeScale` (index: CSS;
native: dp, with the role of each step). `@krizaka/tailwind`: `font-text` and `text-<step>` (size, line height, weight
and tracking together: `font-display text-display-xl`). Products that override `--kz-font-*` keep their faces.
