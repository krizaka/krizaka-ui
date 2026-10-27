---
"@krizaka/ui": minor
---

feat(app-frame): `AppFrame` — the one signed-in frame of every Krizaka web product (UX audit F1, F2, F4, F6). Sections (`place` main | foot, `gated`, `badge`), account (`links`: profile, settings, billing, administration), the primary action, the search, the notifications and chips go in; the rail (a tab bar on a phone), the family's top bar and the account menu come out. The frame fixes the account menu's order (identity, Profile, Settings, Billing, Administration, Language, Theme, Sign out), keeps the preferences in the menu, and refuses a place on both the rail and the avatar. `variant="admin"` for the administration. The shared EN/FR vocabulary (`navWords`: Docs, Terms / Conditions d'utilisation, Settings / Réglages, Billing…) and `publicBarLinks` (the public bar: flat links, four at most) are in `@krizaka/ui/app-frame/server` for Server Components. `AccountMenu` gains a `theme` submenu; `useOptionalTheme` is exported from `@krizaka/ui/theme`.
