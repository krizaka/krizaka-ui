---
"@krizaka/config": minor
"@krizaka/realtime": patch
---

`krizaka/env-name`: environment variables are named by bounded context (krizaka/.github#46) — `<CONTEXT>_<THING>`, never after a product (the organisation's, the repository's own read from its package.json, or one a config names) nor a vendor (`BUNNY_`, `MAILGUN_`, `GOOGLE_`, `EXPO_`…: a vendor is a value, `MAIL_PROVIDER=mailgun`). It reads `process.env.X`, `process.env["X"]` and `import.meta.env.X`, sees through `NEXT_PUBLIC_` / `EXPO_PUBLIC_` / `VITE_`, lets the platforms' own names through (`GITHUB_TOKEN`, `VERCEL_URL`, `EAS_BUILD`…), and is on in `krizakaBase` and `krizakaNext`; `envNames({ products, vendors, allow })` (`@krizaka/config/eslint/env-names`) tunes it. `@krizaka/realtime`'s error and docs name `REALTIME_REDIS_URL`, `@krizaka/push`'s docs `PUSH_ACCESS_TOKEN`.
