---
"@krizaka/ui": minor
---

`ProductBarActions`: `signIn` is now optional. A public site passes neither `signIn` nor `tryIt` and the block renders nothing; with `tryIt` alone only « Try » shows. `productBarActions` gains `hasSignIn` (default `true`) and returns `primary: null` when there is no way in. Callers that pass `signIn` render exactly as before.
