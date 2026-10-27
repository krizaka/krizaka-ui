---
"@krizaka/tokens": minor
"@krizaka/ui": minor
---

Shop look presets (ADR-007 §4, krizaka-ui#745): twelve presets, two per trade — salon Vitrine / Atelier, pets Canal / Carnet, coaching Studio / Approche, workshop Établi / Atelier, cleaning Net / Forfait, consulting Bureau / Cabinet; no café, restaurant or bar — as data in `@krizaka/tokens` (`src/presets/shop/*.preset.json`). `@krizaka/tokens/shop-presets.css` applies them under `[data-shop-preset="<id>"]` in both modes (an accent of the live brands or Akinaza's copper, the title face, the grain, the photo grade and radius) and `[data-shop-accent]` swaps the accent for another of the preset's tested list; `@krizaka/tokens/shop-presets` exports `shopPresets` for a studio. A preset names only tokens (a raw colour in a source is refused), and the build proves every preset × mode × accent of its list: body and small text ≥ 4.5:1, the accent's text and its button's label ≥ 4.5:1, the fill and the ring ≥ 3:1, the ink ≥ 7:1 and the hue ≥ 3:1 on the preset's paper. `ShopFrame` takes `accent` and `paper` (`seyes`, `kraft`, `washi`).
