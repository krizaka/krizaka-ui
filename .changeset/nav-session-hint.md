---
"@krizaka/ui": minor
---

feat(nav-bar): `NavBar.Session` takes a `sessionHint` (or reads the readable `kz-session=1` flag cookie, `useSessionHint`) and, while `/api/me` answers, reserves the signed-in placeholder (`data-state="signed-in-pending"`) instead of an empty place, so a signed-in person never sees « Sign in » for an instant. The flag is a hint, never an authorization; it is kept by `sessionHint` of `@krizaka/auth`, which also redirects a signed-in landing request to the home (krizaka-ui#827).
