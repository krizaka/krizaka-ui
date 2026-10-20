---
"@krizaka/tokens": minor
"@krizaka/ui": minor
"@krizaka/tailwind": minor
"@krizaka/email": patch
---

**A steel blue, one button shape, a quiet hover** (krizaka-ui#393, ADR-003).

- **Tokens.** The Krizaka accent is a steel blue, hue 208 — the exact complement of the Orazaka orange — at ≤ 60 % saturation, instead of the electric `#196df5`: `accent` `hsl(208 46% 45%)` / light `hsl(208 54% 36%)`, `accent-text` `hsl(206 58% 72%)` / `hsl(208 54% 33%)`, a slate section gradient, and every product's `info` on the same steel. AA tested in both themes. The Krizaka mark follows (`marks.krizaka`). The products' colours do not change.
- **Button.** One shape: an 8 px radius (`--kz-radius-sm`, the radius of a field), `pill` on demand. `shape="cut"` is a deprecated alias of it (a warning in development); `shimmer` and `magnetic` are deprecated no-ops.
- **The quiet hover.** A hover changes a colour, never a position: the cards of the blocks (LinkCard, ArgumentCard, CardGrid), Card `interactive`, ServiceCard and GlowCard step their surface and hairline in 150 ms, with a 2 px focus ring. No lift, no zoom, no light following the pointer. `PointerLight`/`usePointerLight`, `CardGrid light`/`hover`, `LinkCard hover`, `ArgumentCard hover` and `GlowCard glow="spotlight"` are deprecated no-ops; GlowCard's ring is still; MotionObserver no longer follows the pointer. The examples `link-card/hover-light` and `argument-card/hover-light` are removed.
