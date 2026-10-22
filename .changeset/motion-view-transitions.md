---
"@krizaka/ui": minor
---

`@krizaka/ui/motion` gains the page-transition helpers: `runViewTransition`, `transitionPage`, `crossFallback`, `canViewTransition` and `sharedElementStyle`. A change of page or step goes through `document.startViewTransition` where the platform has it, a root cross-fade otherwise, and is instant under reduced motion. The DOM always updates.
