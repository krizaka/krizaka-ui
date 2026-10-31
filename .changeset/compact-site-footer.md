---
"@krizaka/ui": minor
---

`SiteFooter` is compact (krizaka/krizaka-internal#754, « des footers de 10 lignes »): at most three lines on a desktop — the site's own links (each `SiteFooter.Column` inline), the family grouped inline (Products · Open source · Krizaka), then the signature, the version, the legal links and the new `controls` slot (language, theme). On a phone the family's groups fold (`<details>`). The family line shows on krizaka.com only by default (the founder's rule: links to the other sites live there; `family` opts another site in); its names and addresses come from `org.family` of `@krizaka/org` when `org` is passed (`familyGroups`, `orgIdOf` in `@krizaka/ui/sites`); the statuses are no longer repeated in the footer. New `tone`: `cahier` for the Cahier sites, `product` (default) for the products — same structure.
