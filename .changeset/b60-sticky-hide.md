---
"@krizaka/ui": minor
---

`StickyAction hideWhileVisible="#hero-book"`: the phone's bar is hidden while the page's own action is on screen (an IntersectionObserver), so a storefront never shows two « Réserver » at once. The bar keeps its place (no layout shift), is `inert` and `aria-hidden` while hidden, slides away and fades back, and only fades under reduced motion. `StickyAction` is now a client component (krizaka-ui#608).
