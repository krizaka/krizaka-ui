---
"@krizaka/ui": minor
---

One navigation for the whole Krizaka family (NAV-SYS).

- `@krizaka/ui/sites` (new, server-safe): the family as data — `sites` (id, name, url, host, kind `company · product · open-source`, group, status `released · upcoming · construction`, mark, repo) for www.krizaka.com, dev.orazaka.com, dev.orochia.com, dev.yasakia.com, dev.yororis.com, ui.krizaka.com, java.krizaka.com and github.com/krizaka; `siteGroups`, `siteById`, `sitesByGroup`; `familyLabels.en` / `.fr` (each site's line, groups, statuses, signature, place).
- `NavBar.Family` (`current`, `labels`, `defaultOpen`): the family switcher attached to the brand — a chevron that opens every site grouped Krizaka · Products · Open source · GitHub, the current one marked (`aria-current="true"`, “You are here”), statuses in words; click or keyboard only (never on hover), Escape returns the focus; inside `NavBar.Mobile` it renders as the panel's last group.
- `NavBar.Badge` (`env`, `version`): `DEV · v1.2.3` beside the brand. `NavBar.Repo` (`href`, `label`): the site's repository as an icon link.
- `@krizaka/ui/site-footer` (new): `SiteFooter` (`current`, `labels`, `version`, `env`, `legal`, own columns with `SiteFooter.Column` / `SiteFooter.Link`) — the family in columns, “A Krizaka company / product / open-source project”, the version, Montréal.
- Composed examples of each site's bar: www, ui., java., dev.<product>, admin.<product>.
