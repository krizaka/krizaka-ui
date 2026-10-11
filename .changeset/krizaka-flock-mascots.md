---
"@krizaka/ui": minor
---

`@krizaka/ui/mascots` — the Krizaka flock as a shared module: `Mascot` (web) and `Mascot` in `@krizaka/ui/native`. Five
birds (falcon, owl, duck, flamingo, pigeon) in five moods (`welcome`, `thinking`, `success`, `empty`, `error`), drawn on
one 120 × 120 grid from the site's original birds. `tone="brand"` (default) paints them in the host's accent
(`--kz-accent`, `--kz-accent-2`) — blue on krizaka.com, orange in Orazaka, violet in Orochia — and `tone="own"` in each
bird's signature colours of the Krizaka story. Light idle motion and a gesture per mood (wave, thinking dots, hop and
badge, shake), all off under `prefers-reduced-motion` or with `animated={false}`. Documented by its `meta.ts` and five
named examples (+ one native) on krizaka.com/docs/ui.
