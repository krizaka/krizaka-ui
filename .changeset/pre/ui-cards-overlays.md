---
"@krizaka/ui": minor
---

2.0.0-beta: the second layer of primitives — the structure of a page and what opens over it.

New entries (server-safe unless noted), on the `@krizaka/tailwind` roles, in dark, light and every product theme:

- `@krizaka/ui/card` — `Card.Root` (`asChild`, `reveal`, `radius`, `tone` default·elevated·glass, `interactive`),
  `Card.Media` (`aspect`), `Card.Image` (`fallback`), `Card.Overlay` (`corner`), `Card.Body` (`padding`),
  `Card.Title` (`as`), `Card.Description`, `Card.Stat`, `Card.Footer`, and `card` (the `tv` slots). No hook, no context.
- `@krizaka/ui/dialog` (client) — `Dialog.Root/Trigger/Content/Header/Title/Description/Body/Footer/Close` on Radix
  Dialog (`placement` center·bottom·right, `size` sm·md·lg, `closeLabel` required), `Sheet` (= bottom placement) and
  `AlertDialog` (`confirmLabel`, `cancelLabel`, `tone` danger·primary, async `onConfirm` with a loading state).
- `@krizaka/ui/toast` (client) — `Toaster` (sonner, its own styling and `richColors` off, every part on a role; `label`
  and `closeLabel` required) and `toast` re-exported.
- `@krizaka/ui/popover`, `/dropdown-menu`, `/tooltip` (client) — thin Radix wrappers on one floating surface
  (`bg-surface-2`, border, `shadow-lg`, `kz-pop`); menu items take `tone="danger"`; `Tooltip` waits 300 ms by default.
- `@krizaka/ui/stat` (`trend` up·down·flat with `trendLabel`), `/page-header` (`title`, `description`, `actions`,
  `breadcrumb`), `/alert` (`tone` info·success·warning·danger, `role="alert"` only for danger and warning), `/separator`
  (Radix), `/kbd`.

New dependency: `sonner`. Status colours stay soft (tint, border, icon) and the text a text role, for WCAG AA in light.
