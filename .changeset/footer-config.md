---
"@krizaka/ui": minor
---

`SiteFooter` takes `config`, the footer as the app's admin configured it: real columns (two on a phone, side by side from `sm`), the status once per column, then one legal line that names the company once (`legalName · NEQ · city`), the version when `showVersion`, the legal links and the org's socials. `FooterSettings` (the stored shape, message keys), `resolveFooterSettings`, `footerSettingsProblems` (the admin form's validation) and `FOOTER_LIMITS` (4 columns, 6 links) ship from `@krizaka/ui/site-footer`; `linkAs` renders internal links through the router (krizaka-internal#591).
