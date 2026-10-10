# Storybook — the internal catalogue of the platform

Private app, **never deployed**: a tool for the people who build the primitives. It renders every story of
`@krizaka/ui`, reads them exactly as a product does (`tailwindcss` → `@krizaka/tailwind` → `@krizaka/ui/tailwind.css`),
and checks them in CI: an axe audit and a screenshot in **dark and light** for every story.

**The public documentation is [krizaka.com/docs/ui](https://www.krizaka.com/docs/ui)**, generated from the same
code: each story renders a named example of the registry (`packages/ui/registry/examples`), which the site shows live
with its code, next to the component's `meta.ts` (when to use it, accessibility, platforms) and its props.

Storybook 10 (`@storybook/react-vite`, addons `docs`, `a11y`, `themes`), Tailwind CSS v4 through `@tailwindcss/vite`.

```bash
pnpm --filter storybook dev               # http://localhost:6006
pnpm turbo run storybook:build --filter=@krizaka/storybook   # → storybook-static/ (builds @krizaka/ui first)
pnpm --filter storybook test              # a11y + screenshots, against storybook-static/ (build it first)
```

## Write a story

Stories live next to the component, in `packages/ui/src/**/<Name>.stories.tsx` (CSF 3, typed with
`@storybook/react-vite`). A primitive's stories render its **named examples** — the files of
`packages/ui/registry/examples/<name>/` listed in its `meta.ts`, the code krizaka.com/docs/ui shows and gives to copy —
so the documentation and the visual tests never drift apart:

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";

import PrimaryExample from "../../registry/examples/button/primary";
import SizesExample from "../../registry/examples/button/sizes";
import { Button } from "./button";

const meta = {
  title: "Primitives/Button",       // Primitives/<Name>; native: Native/<Name>; the brand layer Brand/<Name>
  component: Button,
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = { render: () => <PrimaryExample /> };   // one story per example
export const Sizes: Story = { render: () => <SizesExample /> };
```

- **One example per variant** (and per meaningful state: disabled, loading, empty, error), one story per example.
  Words are written in the example, never `t()`.
- Layout around the component uses the preset's roles only (`bg-surface-1`, `text-fg-secondary`,
  `border-border-default`…): the four UI rules of `@krizaka/config` lint the stories too.
- A story that must skip the audit says why: `parameters: { a11y: { test: "off" } }` — exceptional, reviewed.
- A story that opens something in a portal (dialog, sheet, popover, menu, tooltip, toasts) renders it outside
  `#storybook-root`: it opens it at load (`defaultOpen`) and sets `parameters: { capture: "viewport" }` — the audit
  then covers the page (without axe's `region` rule, which belongs to an app's layout) and the screenshot the viewport.

## Native stories (react-native-web)

`@krizaka/ui/native` has no simulator in CI: its stories (`packages/ui/src/native/<Name>.stories.tsx`, titled
`Native/<Name>`) render here through **react-native-web**. `.storybook/main.ts` resolves `react-native` to it and
lets `.web.*` files win (react-native-svg then takes its DOM implementation); `@krizaka/ui` has react-native-web as a
dev dependency so the docgen plugin follows the same path. Each native story declares the `nativeFrame` decorator
(`packages/ui/src/native/story-frame.tsx`, never built): it wraps the story in the native `ThemeProvider` following
`html.light` (the toolbar and the test-runner) and the toolbar's brand — so a native story is audited by axe and
screenshot-compared in dark and light like a web one. What the web renderer cannot show (the native driver,
platform fonts, haptics) stays covered by the Jest tests of `packages/ui/src/native`.

## Check dark, light and the brands

The toolbar has two switches:

- **Theme** (`@storybook/addon-themes`): `dark` (no class) or `light` (`html.light`), the same switch as the products.
- **Brand**: `krizaka`, `orochia`, `orazaka` — wraps the story in `.brand-orochia` / `.brand-orazaka`, demonstration
  blocks in `.storybook/storybook.css` that override the accent tokens (study §2.5). A primitive that does not follow
  the brand reads a raw colour instead of a token.

The **Accessibility** panel shows the axe result live; `a11y.test` is `"error"`, so a violation fails the tests.

## Tests and screenshots

`pnpm --filter storybook test` (`scripts/test.mjs`) serves `storybook-static/` on a free port and runs
`@storybook/test-runner` against it — no dev server. For every story (`.storybook/test-runner.ts`):

1. the page is opened with `prefers-reduced-motion: reduce` (marks still, words not rolling, reveals shown);
2. in **dark**, then in **light**: an axe audit of `#storybook-root` (a violation fails), then a screenshot compared
   with `__screenshots__/<platform>/<story-id>--<theme>.png` — more than **0.1 %** of different pixels fails, and the
   diff is written to `__screenshots__/__diff__/` (uploaded as an artifact by CI).

`turbo run check` runs these tests (the `test` task of this app depends on `storybook:build`), so CI compares the
**Linux** screenshots. Fonts and anti-aliasing differ between systems, hence one folder per platform.

Update the screenshots after an intended visual change, and commit them:

```bash
pnpm --filter storybook test:update         # the current platform (__screenshots__/darwin on a Mac)
pnpm --filter storybook test:update:linux   # the CI baselines, in the Playwright Docker image (linux/amd64)
```

`test:update:linux` needs Docker; it runs the official `mcr.microsoft.com/playwright` image matching the installed
Playwright version and rebuilds everything inside it. CI (`ci.yml`) runs in that same image, so the
fonts and Chromium are identical: when `playwright` is bumped, bump the `container:` tag of `ci.yml` and
re-run `test:update:linux`.

## Not deployed

There is no public Storybook: GitHub Pages and the `ui.krizaka.com` mirror were retired when the documentation moved
to krizaka.com/docs/ui (one link to share, one list of components). Run it locally with `pnpm --filter storybook dev`.

## Notes

- `@storybook/test-runner` is no longer maintained upstream for Storybook 10 (the Vitest addon is its successor). It
  still runs; `pnpm-workspace.yaml` holds `jest-runtime` at 30.4.2 because 30.5 refuses the `module.register()` call
  Storybook makes while loading `.storybook/test-runner.ts`. Moving to `@storybook/addon-vitest` (browser mode,
  Playwright) is the planned exit.
