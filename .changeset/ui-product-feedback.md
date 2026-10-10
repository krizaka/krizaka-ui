---
"@krizaka/ui": minor
---

What the products asked for before 2.0.0.

- **`Command.List emptyLabel`**: the "nothing matches" message is rendered beside the listbox, never inside it (axe
  `aria-required-children`). `Command.Empty` inside `Command.List` still renders but warns in development; the
  no-results example is back in the documentation.
- **`Card.Image loading`**: `lazy` by default, `eager` (with `fetchPriority="high"`) for the first cards of a page.
- **`Button variant="gradient"`** (web and native): accent → accent-2, the brand's signature call to action. Native
  draws it with react-native-svg.
- **Native `Avatar` draws SVG** (`….svg`, `data:image/svg+xml`, or `svg` for any URI) with react-native-svg — generated
  avatars no longer fall back to the initial.
- **`Countdown showLabel`** (web and native): the label written before the segments, still its accessible name.
