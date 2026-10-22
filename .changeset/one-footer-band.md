---
"@krizaka/ui": minor
---

`SiteFooter`: one band, for real. The hairline between the columns and the last line is gone (a bottom bar under the columns read as a second footer). New `path` prop: the company link that points to the page you are on (« Our story » on /story) carries `aria-current="page"` with a visible state (semibold), and a click on it scrolls to the top instead of reloading the page. `@krizaka/ui/sites`: Yororis is `development` (its card and footer chip say « In development »).
