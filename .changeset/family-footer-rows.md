---
"@krizaka/ui": minor
---

`FamilyFooter` is the one footer of the family: five rows under one `<footer>` (family groups and at most one site column · the four accounts in a fixed order, each its own glyph · source, licence, version, release notes · the company with its NEQ and city and the legal links · the signature line), each group a labelled `<nav>`. `kind="company" | "developer"` changes row C only; the data gains the optional `column`, `releaseNotes` and `licenceHref`; `company` fills row D; `labels.footer` carries the rows' words in English and French. `SiteId` gains `rust` (listed) and `agents` (known, not listed yet). `SiteFooter` gains a `rows` slot.
