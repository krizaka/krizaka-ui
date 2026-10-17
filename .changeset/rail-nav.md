---
"@krizaka/ui": minor
---

New `RailNav` (`@krizaka/ui/rail-nav`) and `AppHeader` (`@krizaka/ui/app-header`): the compact navigation of an application. `RailNav` is a vertical rail of icons on a desktop — the product's mark on top, a tooltip and an `aria-label` on each icon, an accent bar on the left edge of the current one, a footer slot for settings and the account, arrow keys / Home / End between items, the Krizaka focus ring — and becomes a bottom tab bar on a phone (same items, same order, clear of the home indicator). `expandable` widens it to show the words. `accent` scopes a product's brand tokens. `AppHeader` sits beside it with the product's name as text and optional chips; the mark is the rail's on a desktop and the header's on a phone, so exactly one brand mark is visible at every width (tested). Web; on a native phone the rail is the existing `TabBar` (parity noted), on the Mac the web form.
