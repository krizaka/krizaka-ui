---
"@krizaka/ui": minor
---

The wall's addendum (krizaka-ui#604). `ShopSign` renders its text children as a heading (`as`, `h1` by default; a sign on a `Wall` is a paragraph), the logo is optional, the variant `none` is the name alone on paper, and the neon flickers once on its first view and never loops. `PinnedNote` takes `ink` (`blue` | `margin` | `hue`), `hold` through `Stuck` (`attachment` stays as its alias) and a fixed box of `lines` (default 4), its word in the pen. `Polaroid` develops with opacity and saturation, no blur (ADR-004). `Wall` draws at most `max` items (12 by default) in a fixed 16:9 box on a desktop (`height` is now optional), stacks them in z order on a phone with the real list underneath, and no word of the wall lies on a texture (the painted sign and the `none` sign get a sheet). Behaviour changes: the wall's default desktop height is the 16:9 box instead of 560 px, and a note's word is set in the pen face at 20 px.
