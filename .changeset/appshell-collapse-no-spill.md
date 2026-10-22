---
"@krizaka/ui": patch
---

AppShell and RailNav: collapsing the sidebar no longer lets the brand name or the footer text spill over the content. The sidebar clips its width transition; the brand name shrinks away with the width, a text-only footer fades and narrows with it (a footer with controls stays, clipped); words stay in the tree for screen readers; reduced motion is instant. Fixes #482.
