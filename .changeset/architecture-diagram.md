---
"@krizaka/ui": minor
---

`@krizaka/ui/architecture-diagram` (web, server-safe, experimental): `ArchitectureDiagram` draws one laid-out C4 view of `@krizaka/architecture` (an optional peer, its types only, re-exported) on the plate in the page's `--kz-*` tokens — groups as dashed frames, elements by shape (person, browser, mobile, storage, queue, component, box), labelled edges with their arrowheads, and in a dynamic view a numbered badge per step. Safe by construction: every SVG element is written by the component from typed fields, every word is a text child, and a link comes only from the `links` prop through `safeHref` (`http:`/`https:`, same-site paths and anchors). The drawing is one image named by the view's title; its full text version (elements in their groups, then the relations or the ordered steps) is a `<details>` built from the same view; on a phone the drawing scrolls in its frame. Styles in `blocks.css` (`kz-arch-*`).
