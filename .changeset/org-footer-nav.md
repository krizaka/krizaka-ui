---
"@krizaka/ui": minor
---

`SiteFooter` takes `org` (the organisation's public facts from `@krizaka/org`): its signature line is `org.footer.line` (« Une entreprise de Technologies Krizaka · Fait à Montréal ») and, without `legal`, the legal links are `org.footer.legal`. `NavBar.Brand` takes `org` too: with no children it is the Krizaka mark and `org.brand.name`. `sites` exports `OrgFacts` and `orgFamilyLabels(org, locale)`. No site writes these lines by hand any more.
