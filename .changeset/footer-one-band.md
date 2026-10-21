---
"@krizaka/ui": minor
---

SiteFooter is one calm band (krizaka-ui#434, peer review: « too much, a double footer »): the site's own columns beside the family's — Products · Open source (GitHub closes it) · Krizaka (our story, the blog, contact, in the reader's language) — then one line: signature, version, Montréal, legal links. The site block (the site's mark and line, which the bar already says) and the column that listed only Krizaka are gone. `@krizaka/ui/sites` adds `companyLinks` and, in `FamilyLabels`, `lang` and `company` (optional; the English words by default). www no longer passes a column of its own.
