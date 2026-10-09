---
"@krizaka/ui": minor
---

Navigation and input primitives: `./tabs` (`Tabs.Root/List/Trigger/Content`, variant underline · segmented · pills),
`./chip` (`Chip` selectable or removable, `Chip.Group` single · multiple on Radix Toggle Group), `./switch`, `./slider`
(one value or a range, `formatValue` for aria-valuetext, `showLabel`, `origin`), `./checkbox` and `./radio-group`
(`RadioGroup.Item`, `RadioGroup.Card` — a whole card is the radio), `./command` (cmdk: `Command.*` and
`CommandDialog`), `./confirm-button` (two presses, `timeoutMs`, announced) and `./progress` (bar · ring,
indeterminate, server-safe). `Dialog.Content` takes `hideClose` (`closeLabel` then optional) and `dismissible={false}`
(Escape and an outside click do not close it). New dependency: `cmdk`.

Class merging, checked as a product installs the package: `scripts/consumer.mjs` (run by `publint`) packs
`@krizaka/ui`, installs it alone in an empty folder and asserts that `cn("px-2", "px-4")` is `"px-4"` and that a
product's `className` wins over a variant. The merge engine is tailwind-variants' own since 3.3 (bundled, it never
imports `tailwind-merge`), so `@krizaka/ui` declares `tailwind-variants ^3.3.1` and no `tailwind-merge`.
