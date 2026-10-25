---
"@krizaka/fonts": patch
"@krizaka/tailwind": patch
---

The tests that import the package's own `dist` now depend on its build in turbo (the release pipeline ran them before the build).
