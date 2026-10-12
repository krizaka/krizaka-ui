---
"@krizaka/ui": minor
---

**Page templates** (W4 of #49): every page of a Krizaka site has its template — a new `templates` category of
krizaka.com/docs/ui with fifteen entries, each a distinct composition of the blocks (bento, split hero with the product
alive, timeline, staggered gallery, sticky filters, editorial chapters, changelog with a sticky date…): `landing-page`,
`product-page`, `how-it-works-page`, `gallery-page`, `docs-hub-page`, `docs-article-page`, `component-page`,
`catalogue-page`, `longform-page`, `changelog-page`, `contact-page`, `legal-page`, `status-page` (also « under
construction »), `error-page` and `pricing-page`. Words and content as props, the product's brand through `brand`, cut
calls to action, staged motion, one column on a phone (each example has a phone story). Templates are Server
Components: they import the blocks through the package's entries, keeping each block's client boundary.
