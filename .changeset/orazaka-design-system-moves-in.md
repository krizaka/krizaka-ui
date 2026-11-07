---
"@krizaka/orazaka-design-system": major
---

The design system now lives in krizaka-ui (`packages/orazaka-design-system`, moved from sovkora-ui-kit, ADR-029) and is built on the 4.x platform: `@krizaka/ui`, `@krizaka/tokens` and `@krizaka/tailwind` ^4.0.0 (workspace siblings). `theme.css` imports `@krizaka/tokens/brands/sovkora.css` — the same orange as the former `brands/orazaka.css`, renamed in tokens 4.0 — and the registry names the brand layer `.brand-sovkora`; the docs point to `SovkoraLogo`. An app moves to this major together with `@krizaka/ui` 4. `ChatShowcase` reads the reduced-motion preference in render (same behaviour, no state set inside an effect). Node >= 22. This release also carries the 3.4.1 fix of the changelog, which was never published.
