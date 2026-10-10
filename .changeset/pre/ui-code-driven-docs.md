---
"@krizaka/ui": minor
---

The code drives the documentation: krizaka.com/docs/ui is generated from the registry, and the registry from the code.

- Every component has a typed `meta.ts` beside it (`src/meta.ts`): summary, status, category, platforms (`web` ·
  `native` · `both`), when to use it and when not (and what to use instead), best practices, accessibility (keyboard,
  roles), related components, and per platform the names to import — for React Native, what differs from the web API.
  `segmented` and `txt` (React Native only) are documented too.
- Named examples, one per significant variant: `registry/examples/<name>/<example>.tsx` and
  `registry/examples/<name>/native/<example>.tsx` (≤ 40 lines, the code a product copies), shipped as source and
  compiled (`@krizaka/ui/registry/examples/<name>/<example>`). The stories render them.
- `registry/<name>.json` carries the meta, the web and native imports, props (native props documented too) and
  examples (title, description, code, module); `registry/index.json` lists title, summary, status, category,
  platforms and example counts.
- **Breaking for registry readers**: `registry/demos/*` and the `./registry/demos/*` export are replaced by the
  examples; `demo` in an item is now its first web example.
- Storybook is internal (CI's visual and a11y tests): no GitHub Pages, no ui.krizaka.com mirror.
