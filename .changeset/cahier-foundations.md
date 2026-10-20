---
"@krizaka/tokens": minor
"@krizaka/tailwind": minor
"@krizaka/ui": minor
---

**Cahier — the flock's field notebook (ADR-004, #417), the foundations.** The template tells are retired at the source, by value (no token renamed or removed):

- **Colour:** paper and blue ink in light, slate and chalk in dark (surfaces, borders, text); the steel accent and every product colour unchanged; no section wash (every brand's section gradient is the page surface). New roles `--kz-paper-rule-major/-minor/-margin`, `--kz-paper-tag/-tag-edge/-tag-ink`, `--kz-paper-module` (32 px), `--kz-paper-line` (8 px), native `paper*`.
- **Shape:** radius 2 px on controls, 0 on cards, dialogs and sheets; every Tailwind radius (`rounded-xs` … `rounded-4xl`) reads a token.
- **Elevation:** solid offsets of paper, never a blur; no sheen, no light edge; `glass` is an opaque sheet (no backdrop blur); `shadow-glow` is an ink line; `bg-halo` an ink rule; `node-lit` without a glow.
- **Type:** the faces of `@krizaka/fonts` 0.3.0; display steps at one weight (400) with line heights on the 8 px line; `overline` is a lower-case note (no tracking); `font-synthesis-weight: none`.
- **Motion:** the ease is the pen's (`cubic-bezier(0.45, 0, 0.2, 1)`); `[data-reveal]` settles in place (no travel, no blur), `data-reveal="ink"` writes left to right; the backdrop's drifting glows, dome and perspective grid draw nothing; a backdrop photograph is printed, not blurred.
- **Blocks:** `Page` and `Section` take `paper="ruled" | "lines"` (the Seyès ruling) and `margin` (the red line); `SectionHeading`/`Section` take `number` (`§ 2`, hung in the margin). The eyebrow and the labels are lower-case notes in the typewriter face; no uppercase tracked overline in the primitives.
- **Chrome:** no frosted glass in the bar, headers, dialogs, loaders, sticky actions; the bar's current item is an ink underline.
- New utilities `ruled`, `ruled-lines`; colours `rule-major`, `rule-minor`, `margin`, `tag`, `tag-edge`, `fg-tag`; `ease-ink`.
- **The Cahier's signature blocks:** `@krizaka/ui/specimen-tag` (`SpecimenTag`, `Stamp` — a product's or a component's status and record on a manila tag, the stamp in lower case), `@krizaka/ui/bird-plate` (`BirdPlate` — the flock as a naturalist's plate, numbered figures and their promises), `@krizaka/ui/anatomy-plate` (`AnatomyPlate` — a component's parts numbered around the live specimen), `@krizaka/ui/page-index` (`PageIndex` — a book's index with dotted leaders and page numbers), `@krizaka/ui/footnote` (`Caption`, `FootnoteRef`, `Footnotes`). Each with its meta, examples, stories and tests; native follows (#421).
