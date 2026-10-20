---
"@krizaka/fonts": minor
---

**Cahier (ADR-004, #417): the Krizaka faces are Young Serif (display, one weight), Atkinson Hyperlegible Next (text) and Courier Prime (mono: tags, captions, footnotes, code)** — all SIL OFL 1.1, self-hosted, latin and latin-ext, metric-matched fallbacks (Georgia, Arial, Courier New). Static families get one WOFF2 per weight. Plus Jakarta Sans, Inter and JetBrains Mono stay in `files/` and in the new `legacyFonts` export (out of `fonts.css`), so a pinned `next/font/local` path keeps resolving while an app moves. Native: `YoungSerif-Regular`, `AtkinsonHyperlegibleNext-{Regular,SemiBold,Bold}`, `CourierPrime-{Regular,Bold}`.
