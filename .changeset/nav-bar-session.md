---
"@krizaka/ui": minor
"@krizaka/tokens": minor
"@krizaka/tailwind": minor
---

`NavBar.Session`: the bar's « who is here » island for every product, over one contract — `GET /api/me` answers 200 `{ signedIn, signupOpen, account? }` with `Cache-Control: private, no-store` and `Vary: Cookie` (`meResponse`, `meHeaders`, `meSchema` from the server-safe `@krizaka/ui/nav-bar/me` entry); signed out is never a 401 and its schema rejects an account. It takes `ProductBarActions` and the account menu for the two states, uses `@krizaka/query` with the app's credential policy, and falls back to signed out even if a failed refetch leaves a cached account.
