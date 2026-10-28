---
"@krizaka/tokens": minor
"@krizaka/ui": minor
---

feat(tokens): six trade-agnostic look presets for the shop page (`look-cahier`, `look-krizaka`, `look-editorial`, `look-boutique`, `look-affiche`, `look-nuit`) in `@krizaka/tokens/shop-presets` (akinaza#478 slice 2, krizaka-ui#803). New keys, required of a look and refused on a trade preset: `surface` (`paper` · `ink` · `warm` · `contrast` · `deep` · `dusk`, tokens only, per mode), `motion` (`still` · `soft` · `paper` · `lively`), `mascots` (`off` · `on`), `closing`, `transition` and `photo.frame` (`none` · `polaroid`); the title face `poster` (the product face, heavy and tight: `@krizaka/fonts` has no other, so no new font file). The checker still refuses a raw colour. The 12 trade presets are unchanged. The AA matrix covers 6 looks × 2 modes × each accent (ink ≥ 7:1, accent text, label, fill and control border ≥ 3:1); the generated CSS stays under 3.5 kB per look. `@krizaka/ui` reads `--kz-shop-surface`, `--kz-shop-photo-frame` and `--kz-shop-title-tracking` in `blocks.css` (unset without a look: pages unchanged).
