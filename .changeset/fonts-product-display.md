---
"@krizaka/fonts": minor
"@krizaka/tokens": minor
"@krizaka/ui": minor
"@krizaka/tailwind": minor
---

Plus Jakarta Sans is back, for the products' titles only (ADR-006 §2, krizaka-ui#670). `@krizaka/fonts` gets the role `product-display` (`--kz-font-product-display`, variable, latin + latin-ext, weights 550 / 650 / 700 in use, never 800): the files are the ones the package already shipped as legacy (`legacyFonts` still lists them), declared in `fonts.css` with a metric-matched fallback (CLS 0), never preloaded, never loaded from Google Fonts. `@krizaka/tokens` adds `--kz-font-product-display` and `--kz-font-mono-meta` (Courier Prime, for identifiers and times). In the product register of `blocks.css`, `--kz-font-display` is the product face (−0.015 em from 24 px, −0.022 em from 40 px, display steps at 550 / 650), identifiers use Courier Prime (`--kz-font-mono-meta`, `font-mono-meta`), code the system monospace (eyebrows follow in #633); the Cahier sites keep Young Serif and never fetch the face. The typography page of ui.krizaka.com shows the two registers side by side.
