---
"@krizaka/ui": minor
---

`ProductBarActions` marks its sign-in and try buttons `data-signed-out-only`, and `blocks.css` hides them under `html[data-session]`: an app that sets that attribute from the readable `kz-session` hint before first paint never draws « Sign in » to a signed-in visitor (krizaka-ui#827).

`ThemeScript` also sets `html[data-session]` from the readable `kz-session` hint cookie, before first paint.
