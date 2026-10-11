---
"@krizaka/tokens": minor
"@krizaka/tailwind": minor
"@krizaka/ui": minor
---

**The Krizaka material — tokens and utilities (BRAND.md §6, "Surfaces & materials", and §6.1, "the griffe").** Light
comes from above: what you press rises, what you fill sinks, what floats is glass, only what acts glows.

- `@krizaka/tokens`: new roles in `material.tokens.json` — `--kz-surface-sheen`, `--kz-fill-shade`, `--kz-edge-light`,
  `--kz-edge-on-fill`, `--kz-edge-well`, `--kz-glass-bg` / `-border` / `-blur`, `--kz-ring-width` / `-offset` / `-halo`,
  `--kz-control-sm|md|lg|field` (tightened under `[data-density="compact"]`), the griffe `--kz-cut-shape` (`bevel`) and
  `--kz-cut-size`; the ink-tinted multi-layer shadows `--kz-shadow-raised|floating|overlay`; the status tints
  `--kz-success-soft|warning-soft|danger-soft`; `--kz-radius-xs` and `--kz-radius-2xl`; `--kz-ease-spring` and
  `--kz-duration-instant|fast|base` — **0 ms under `prefers-reduced-motion`** (a generated block). Native: the new colour
  roles in `themes.*`, `radius.xs` / `radius["2xl"]`, `motion.spring` and `motion.duration`, `shadows.<theme>` as React
  Native `boxShadow` strings, `cut.size`. Contrast tests: text on glass over anything the page shows, text on the status
  tints, on-accent down to the shaded bottom of a fill in every brand and both themes.
- `@krizaka/tailwind`: `bg-sheen`, `bg-fill-shade`, `bg-halo`, `glass` (+ `bg-glass`, `border-glass-border`),
  `shadow-raised|floating|overlay`, `shadow-glow(-lg)` (the brand's glow, composed where used), `inset-shadow-edge`,
  `inset-shadow-edge-fill`, `inset-shadow-well`, `focus-ring` / `focus-ring-inset` (the signature focus ring),
  `node` / `node-lit`, `ease-spring`, `bg-*-soft`. (`--kz-radius-xs` and `--kz-radius-2xl` are tokens, not mapped: Tailwind's own `rounded-xs` / `rounded-2xl` keep their sizes.)
- `@krizaka/ui/native`: `Theme`, `Radius` and `Motion` follow the new roles; `useTheme().motion.duration` is 0 ms when
  the system reduces motion.

Nothing changes visually yet: the primitives adopt the material in the next release.
