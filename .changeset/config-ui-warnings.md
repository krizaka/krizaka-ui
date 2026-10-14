---
"@krizaka/config": minor
---

Two named ESLint rules for the adoption: `krizaka/no-light-variant` (refuse Tailwind `light:` in products — tokens do the theming) and `krizaka/no-raw-palette` (refuse `bg-zinc-900`, `text-violet-400`… — use a role; `allow` families for isolated cases), registered on the `krizaka` plugin and shipped as warnings by `krizakaUiWarnings()` (`@krizaka/config/eslint/ui-warnings`). `krizaka-ratchet` already counts the same patterns (`light`, `palette`): a product adopts the warnings now and brings both counts to 0. `krizakaUi()` stays the strict set.
