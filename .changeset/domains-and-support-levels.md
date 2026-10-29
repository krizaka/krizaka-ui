---
"@krizaka/ui": minor
---

Every registry entry now says what it is for and how far to trust it (krizaka-ui#838, ADR-008 slices 1). `meta.ts` gains `domain` (one of twelve: foundations, forms, data-display, navigation-shell, feedback, maps, media, commerce, identity, conversation, page-blocks, cahier) and the `experimental` status with its `adoption: "<repo>#<n>"` issue. Ten entries made for a filed need start as `experimental`: `proposal`, `schema-form`, `money-input`, `price-catalogue-editor`, `promo-code-field`, `shop-gallery`, `usage`, `desktop-window` and the native `form-flow` and `state-screen`. The registry JSON carries both fields, and ui.krizaka.com shows the new badge and filter. Nothing breaks: the entries stay flat (`@krizaka/ui/<name>`).
