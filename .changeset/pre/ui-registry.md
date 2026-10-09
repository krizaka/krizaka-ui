---
"@krizaka/ui": minor
---

The registry: every primitive published as data, for documentation sites and a future `npx @krizaka/cli add`.

- `@krizaka/ui/registry/<name>` (JSON): its sources, npm dependencies, the primitives it builds on, its demo and the
  documentation of its props (react-docgen-typescript: name, type, default, description, required);
  `@krizaka/ui/registry/index` lists them all.
- `@krizaka/ui/registry/demos/<name>`: one demo per primitive (ESM, client, ≤ 40 lines, the `.tsx` source beside it),
  the very code of its default story. Demos that open over the page take `defaultOpen`.
- Every prop a primitive declares has a JSDoc description (the variants included), so editors show it too.
