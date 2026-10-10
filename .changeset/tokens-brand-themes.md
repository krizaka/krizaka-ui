---
"@krizaka/tokens": minor
"@krizaka/tailwind": minor
---

Brand themes: one colour per Krizaka brand. `@krizaka/tokens/brands/{krizaka,orazaka,orochia}.css` (a product's
identity, dark and light, imported after the tokens), `brands/scoped.css` (`.brand-<id>` classes for pages that show
several brands), `brands` in the web and native modules (`<ThemeProvider overrides={brands.orazaka}>`). Orazaka is
orange (from its mark: `hsl(26 92% 55%)` dark under near-black text, `#b45309` light under white), Orochia velvet →
magenta, Krizaka ink + blue (the platform default). New roles: `--kz-accent-text` (the accent as text, ≥ 4.5:1 on
every surface; `text-fg-accent`) and the section gradient `--kz-brand-gradient-{from,via,to}`
(`from-brand-from via-brand-via to-brand-to`), every pair tested at WCAG AA in both themes. `BRAND.md` documents the
brand system: colours, marks, icons and the visual language of pages.
