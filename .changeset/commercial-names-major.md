---
"@krizaka/tokens": major
"@krizaka/tailwind": major
"@krizaka/ui": major
"@krizaka/charts": major
"@krizaka/email": major
---

The commercial names replace the code names everywhere (2026-11-06, krizaka-internal#2664): no code name is published any more.

- `@krizaka/tokens`: the brand themes are `sovkora`, `verikora` and `folioviv` — `@krizaka/tokens/brands/sovkora.css` (was `orazaka.css`), `verikora.css` (`yomizaka.css`), `folioviv.css` (`akinaza.css`); the scope classes are `.brand-sovkora`, `.brand-verikora`, `.brand-folioviv`; the keys of `brands`, `marks` and the native themes follow.
- `@krizaka/ui`: `SovkoraLogo`, `VerikoraLogo`, `FoliovivLogo` (and the native `SovkoraMark`, `VerikoraMark`, `FoliovivMark`) are the marks — `OrazakaLogo`, `YomizakaLogo`, `AkinazaLogo` and their native twins are gone; `ProductLogo`, `ProductLockup`, `BrandId`, `MarkId`, `SiteId` and the family sites take `sovkora | verikora | folioviv | kridoc`. `CodeNameLine` and the `codeName` prop of `ProductLockup` are removed: a screen never shows a code name. `ActivityFeed` takes `now` from the host (required): the feed never reads the clock, its time moves a minute every minute from `now` while `ticking`.
- `@krizaka/charts`: `BrandId` is `"krizaka" | "sovkora"` (the palette was `orazaka`). `CreditUsage` draws the run-out date only when the host passes `now` (it no longer reads the clock).
- `@krizaka/email`: the themes are `sovkora`, `verikora`, `folioviv` (`getTheme("sovkora")`); the logos are read under `brand/<id>/` on the CDN.
