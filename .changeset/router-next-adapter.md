---
"@krizaka/ui": patch
---

`useRouteState` and the `routeKey` selections (Tabs, Chip.Group, ChoiceGrid, RadioGroup…): the default route adapter now syncs with Next.js. It writes the history entry with a null state (Next's own mark is no longer copied, so `useSearchParams` follows a routed tab), and a navigation to the address already shown writes nothing, so one click is one history entry (Radix fires on mousedown and on focus). The adapter stays injectable through `RouteStateProvider`.
