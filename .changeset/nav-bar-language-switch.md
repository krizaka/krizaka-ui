---
"@krizaka/ui": minor
---

Navigation standard (NAV-STD). `NavBar` menus: the panel is 28 rem (40 rem in two columns, never wider than the page between its gutters), aligned under its trigger and kept inside the page (`placePanel`), its descriptions wrap on two lines at most instead of being cut on one, the icon tile stays at the top. New `@krizaka/ui/language-switch` — `LanguageSwitch`, `languagesFor(path)`, `languageHref(path, to)`: a globe and the current code (`FR`) opening a menu of the languages named in their own language, as links with `hreflang` that keep the page; `variant="inline"` for a panel. `NavBar.Language` (a menu in the bar, a row in the mobile panel) and `NavBar.MobilePreferences` (the panel's last group: theme, language) place it. It replaces the pill that names the other language.
