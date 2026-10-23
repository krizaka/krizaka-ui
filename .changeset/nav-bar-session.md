---
"@krizaka/ui": minor
"@krizaka/tokens": minor
"@krizaka/tailwind": minor
---

`NavBar.Session`: the bar's « who is here » island for every product, over one contract — `GET /api/me` answers 200 `{ signedIn, signupOpen, account? }` with `Cache-Control: private, no-store` and `Vary: Cookie` (`meResponse`, `meHeaders`, `meSchema`); signed out is never a 401. It takes `ProductBarActions` and the account menu for the two states, and uses `@krizaka/query`.
