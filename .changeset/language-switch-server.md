---
"@krizaka/ui": minor
---

`@krizaka/ui/language-switch/server`: `languagesFor`, `languageHref` and `languageNames` without the "use client" banner, so a Server Component can call them (the `language-switch` entry stays client and re-exports them for compatibility).
