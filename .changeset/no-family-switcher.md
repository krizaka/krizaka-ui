---
"@krizaka/ui": minor
"@krizaka/config": minor
---

No more family switcher: krizaka.com is the only way back between the Krizaka sites (Oussama, 2026-10-22).

- `NavBar.Family` is deprecated (removed in the next minor once no site uses it).
- `SiteFooter` lists the family on the hub only: `family` now defaults to `current === "krizaka"`, so every other site's footer holds its own columns, the legal links and one quiet « A Krizaka project » line linking to www.krizaka.com. New `products` prop filters the hub's Products column (krizaka.com's focus products), replacing CSS that hid links by URL.
- `@krizaka/config`: the `krizaka/no-family-switcher` rule (an error in `krizakaStack()`) refuses `NavBar.Family` so it does not come back.
