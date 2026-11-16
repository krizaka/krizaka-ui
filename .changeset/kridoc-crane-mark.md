---
"@krizaka/ui": minor
"@krizaka/tokens": minor
---

feat(ui): `ProductLogo` draws Kridoc — `id="kridoc"` is mark C, the crane (sapphire `#2c6ae8` → `#156fd5`), and the old document glyph is gone. `KridocLogo` is now a deprecated alias of `ProductLogo id="kridoc"` (removed in the next major); `MarkId` is the type of `ProductLogo`'s `id`. feat(tokens): the `kridoc` brand (`brands/kridoc.css`, `.brand-kridoc`, `marks.kridoc`, `brands.json`); `@krizaka/tokens/native` exports `brandAccents` (the accent and its text colour per brand), which the map reads instead of bundling every brand theme. krizaka-internal#3839.
