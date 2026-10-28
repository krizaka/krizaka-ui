---
"@krizaka/ui": minor
---

`NavBar.Session` and the new `useNavSession`: pending is never drawn as signed out, a failed or throttled `/api/me` refetch keeps the last known state instead of flipping a signed-in person to « Sign in », and `initial` (the server-read session of a dynamic page) makes the first paint the answer (krizaka-ui#800).
