---
"@krizaka/ui": patch
"@krizaka/charts": patch
"@krizaka/email": patch
"@krizaka/i18n": patch
"@krizaka/icons": patch
"@krizaka/query": patch
"@krizaka/sovkora-design-system": patch
---

Mechanical SonarCloud cleanup, no behaviour change: component props are typed `Readonly<…>` (S6759, enforced by the new ast-grep rule `props-readonly`), plus `globalThis`, `replaceAll`, `.at()`, `Number.*` and `export … from` where the unicorn rules ask for them.
