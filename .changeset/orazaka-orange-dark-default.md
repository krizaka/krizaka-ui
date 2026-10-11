---
"@krizaka/tokens": minor
"@krizaka/ui": minor
---

**The Orazaka mark wears the brand's orange, and a product can be dark (or light) first without a flash.**

- **Orazaka mark (visual change).** `OrazakaLogo`, `OrazakaMark` (native) and `ProductLogo`/`ProductMark id="orazaka"`
  leave amber (`#b45309 → #f59e0b`, hues 26 → 38 — the light stop was the hue of `--kz-warning` and read at 2:1 on a
  light page) for the brand's orange: deep orange `hsl(26 90.5% 37.1%)` #b45309 → orange `hsl(26 92% 45%)` #dc6509, on
  the accent's hue 26. Every stop reads ≥ 3:1 on surfaces 0–2 in dark and light; the halo and the core's glow follow.
  Geometry and animation unchanged. The 2.0 version stays visible in Storybook, *Brand/Evolution*.
- **`marks` (`@krizaka/tokens`, `@krizaka/tokens/native`).** Each brand file carries its mark's emblem gradient
  (`$extensions["com.krizaka"].mark`), exported as `marks.<id>` (`[offset, colour]` stops); the three marks read it —
  no colour copied into `@krizaka/ui`. Krizaka and Orochia values are unchanged. The generated constants are marked
  pure, so a bundler keeps only what an app imports.
- **`ThemeScript defaultMode`** (fixes #47). `ThemeScript` takes the same `defaultMode` (`"dark" | "light" | "system"`,
  default `"system"`) as `ThemeProvider`: with nothing persisted, the script applies it before the first paint and the
  provider reports it, so the first toggle is always visible. The visitor's choice (`kz-theme`) still wins; an unknown
  stored value falls back to the default. `ThemeProvider` also applies the mode when an app renders it without the
  script. New type `ThemeScriptProps`.
