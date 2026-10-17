---
"@krizaka/tokens": patch
"@krizaka/ui": patch
---

`--kz-text-muted` now reaches WCAG AA (4.5:1) for small text on every surface, in both themes and under every brand (it was 4.11:1 on dark and 3.91:1 on light, between 3.05 and 4.17 across the surfaces). Same hue (240°), lightness moved: dark 47% to 59%, light 52% to 41%. In the light theme `--kz-text-secondary` goes from 41% to 35% so the hierarchy primary > secondary > muted holds. A new contrast test covers text-muted on the four surfaces and on each brand's section gradient.
