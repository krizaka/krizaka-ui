---
"@krizaka/tokens": minor
"@krizaka/tailwind": minor
"@krizaka/ui": minor
---

The product register, 2027 (ADR-006 §3, krizaka-ui#669). A product's root (`data-surface="product"`, or its `.brand-<id>` on `<html>` / `<body>`) now wears, from `@krizaka/ui/blocks.css` and in both themes: the slate ink (title `#222a3a`, primary `#242c3d`, secondary `#576275`, muted `#646d80` — the mockup's `#8c96a8` is 2.9:1 and refused), the surfaces `#fbfbfa` / `#ffffff` / `#f4f4f2` and `#111318` / `#171a21` / `#1e222b`, translucent hairlines (4 % / 8 %) on cards and separators, radius 4 / 8 / 8 / 14 / 14 / 14, titles at 700, and on an interactive card (a link or a button) the brand border, a soft shadow and a 1 px lift in 150 ms (none under reduced motion). The Cahier sites are unchanged.

New roles in `@krizaka/tokens` (Cahier values, no existing value changes): `--kz-text-title`, `--kz-border-control` (a field, a checkbox, a radio: ≥ 3:1 on surfaces 0–2 in the register, WCAG 1.4.11), `--kz-border-hover`, `--kz-shadow-hover`, plus `--kz-control-row`, `--kz-density-gap` and `--kz-density-pad` tightened by `[data-density="compact"]`. `@krizaka/tailwind` maps them (`border-control`, `border-hover`, `text-fg-title`, `shadow-hover`). `Field`, `Combobox`, `SearchField`, `DatePicker`, `DateField`, `Chat`, `Checkbox` and `RadioGroup` draw `border-control`: on the Cahier sites a field's edge is now the strong border. Contrast of every role is tested per theme and per brand.
