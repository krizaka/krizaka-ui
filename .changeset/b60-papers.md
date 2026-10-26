---
"@krizaka/ui": minor
"@krizaka/tokens": minor
---

`Page` and `Section` take two more papers, `paper="dot-grid"` (a dot every 24 px) and `paper="kraft"` (brown paper, its ink at 7:1 or more on the darkest point of its grain, in light and in « carnet de nuit »). New tokens `--kz-paper-dot`, `--kz-paper-kraft`, `--kz-paper-kraft-ink`, `--kz-paper-grain-opacity`. The grain is one inline SVG `feTurbulence` filter with a fixed seed, `PaperGrain` from `@krizaka/ui/page`, mounted once by the host; no image file (krizaka-ui#600).
