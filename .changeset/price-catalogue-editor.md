---
"@krizaka/ui": minor
---

New `@krizaka/ui/price-catalogue-editor` (`PriceCatalogueEditor`, web, beta; krizaka/krizaka-ui#713): a product's admin edits its price entries, fed by `describePrices()` of `@krizaka/settings`. One row per entry (product · plan, the amount in the locale's way or « on quote », the unit, « plus taxes », the availability as a word in a chip, the limits); a change takes effect from a date (today by default, never the past) and says that current subscriptions keep their price; the scheduled changes and the history (loaded when the fold opens) are folded. The host owns the save and the clock; words are props. 360 px, both themes, keyboard.
