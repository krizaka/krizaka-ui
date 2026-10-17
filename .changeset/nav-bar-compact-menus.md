---
"@krizaka/ui": minor
---

NavBar: compact menus and one item lit. A menu link is icon · title · one line, in a 20 rem panel (36 rem in two columns) instead of a sheet over the page. Menus open on click, keyboard, or a pointer that rests 200 ms (`delayDuration`) — passing over the bar opens nothing; the light stays on the open menu's trigger, and moving on to a plain link closes the menu, so two items are never lit. A press outside closes the mobile panel. New `NavBar.MobileGroup` (a named group of the phone panel, the same groups as the bar's menus). `useSlidingIndicator` takes `prefer`. The `family-product` example and the docs follow the product-site standard: Product ▾ · Platforms ▾ · Docs.
