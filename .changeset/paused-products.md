---
"@krizaka/ui": minor
"@krizaka/tokens": minor
"@krizaka/tailwind": minor
"@krizaka/charts": minor
"@krizaka/email": patch
"@krizaka/discovery": patch
"@krizaka/icons": patch
"@krizaka/fonts": patch
"@krizaka/intl": patch
---

Paused products (2026-10-25): Orochia, Yasakia, Yororis and Kachizaka leave the family. The family switcher and the
footer (`sites`) list only Krizaka, Orazaka, Yomizaka and Akinaza; `siteById` still finds a paused site (`pausedSites`), so
a page that names one as `current` keeps rendering. Nothing published is removed: their marks (`OrochiaLogo`,
`YasakiaLogo`, `YororisLogo`, `KachizakaLogo`, the native `*Mark`s, their `ProductLogo` / `ProductMark` ids — the new
`PausedBrandId`, `PausedSiteId`), their brand themes (`@krizaka/tokens/brands/{orochia,yasakia,yororis,kachizaka}.css`
and the `.brand-*` scopes, now headed DEPRECATED), the charts' `orochia` palette and the email themes stay, marked
`@deprecated`, and are removed in the next major. The examples, metas and docs speak of the products in focus only.
