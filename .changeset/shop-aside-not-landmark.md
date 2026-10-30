---
"@krizaka/ui": patch
---

ServicesSection (and so ShopComposer): the `aside` beside the price board is a plain block with the `kz-shop-aside` class, no longer an `<aside>` landmark inside `<main>` (axe `landmark-complementary-is-top-level`, 4 shop pages of akinaza). Same look and sticky rule (krizaka-ui#891).
