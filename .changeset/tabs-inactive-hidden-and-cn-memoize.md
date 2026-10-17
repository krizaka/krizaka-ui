---
"@krizaka/ui": patch
---

Tabs: add missing `data-[state=inactive]:hidden` to `TabsContent` to prevent ghost rendering and vertical stacking under `forceMount` (fixes #213).
cn, Button: memoize `{ twMergeConfig }` in `cn()` at module scope and use `cn()` in `Button` (fixes #211).
