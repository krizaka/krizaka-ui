---
"@krizaka/ui": minor
---

Cards get a quiet hover. `LinkCard` and `ArgumentCard` take `hover="light"` (the pointer's light and the coloured lift, still the default) or `hover="quiet"`: no coloured glow or halo, a 2 px lift, one step of surface and hairline, the title leaning towards the accent text, and a focus ring on the whole card. `CardGrid hover="quiet"` quiets every card of a grid; a card can still say `hover="light"`. Under `prefers-reduced-motion` the quiet card does not lift. Documented on ui.krizaka.com with both hovers side by side.
