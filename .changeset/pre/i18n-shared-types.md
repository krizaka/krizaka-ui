---
"@krizaka/i18n": patch
---

One set of declarations for every entry: `./react` now imports the `I18n` type from `.` instead of carrying its own
copy, so `createI18nReact(createI18n(…))` type-checks in an app (the two copies of the conditional `Translate` type did
not match). The publint step compiles a consumer against `dist/` to keep it that way.
