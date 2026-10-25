---
"@krizaka/ui": minor
"@krizaka/tokens": minor
"@krizaka/tailwind": minor
---

Appearance for every product (ADR-006 §4, [#657](https://github.com/krizaka/krizaka-ui/issues/657)).

- **`@krizaka/tokens`:** the themes as data — `appearance` (also on `/native`): System, Light and Dark (required), Blueprint (navy) and Carbone (near-black) as optional dark surface sets, the colours of each miniature, every brand's accent family per theme, and `passes` — the themes each accent reads on, computed with WCAG 2 (text ≥ 4.5:1, fill ≥ 3:1, its label ≥ 4.5:1) and tested for every combination. `appearance.css` applies the surface sets (`html.theme-blueprint`, `html.theme-carbone`) and the accent (`html[data-accent="<brand>"]`). No paper theme, no brand-named theme. Density stays `html[data-density="compact"]`.
- **`@krizaka/ui/account-settings`:** `AppearanceSettings` — theme cards (a radio group of live miniatures, one check), accent, density, language and an opt-in sound, as `SettingsRow`s; driven by data, `onChange` out. Native twin: still the gap of #503.
- **`@krizaka/ui/theme`:** `useAppearance()` applies the choices at once and keeps them in the browser; `ThemeScript` restores the accent and the density before paint.
