---
"@krizaka/tailwind": minor
"@krizaka/ui": minor
---

Focus: the ring is the keyboard's. An element focused by code (a heading, `main` or a region with `tabindex="-1"` and no role) shows no ring or shadow, and a tap leaves no browser highlight on the brand or a title (`-webkit-tap-highlight-color`), so the blue block seen without keyboard use is gone (krizaka-ui#659). Roving-tabindex items keep their ring. A test of `@krizaka/ui` refuses a `focus:` ring, outline or shadow, and a bare `:focus` rule that draws one.
