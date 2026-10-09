# Storybook — the Krizaka platform catalogue

Private app (never published). It renders every story of `@krizaka/ui`, reads them exactly as a product does
(`tailwindcss` → `@krizaka/tailwind` → `@krizaka/ui/tailwind.css`), and checks them: an axe audit and a screenshot in
**dark and light** for every story. Published on every push to `main`:
**[krizaka.github.io/krizaka-ui/latest](https://krizaka.github.io/krizaka-ui/latest/)**.

Storybook 10 (`@storybook/react-vite`, addons `docs`, `a11y`, `themes`), Tailwind CSS v4 through `@tailwindcss/vite`.

```bash
pnpm --filter storybook dev               # http://localhost:6006
pnpm turbo run storybook:build --filter=storybook   # → storybook-static/ (builds @krizaka/ui first)
pnpm --filter storybook test              # a11y + screenshots, against storybook-static/ (build it first)
```

## Write a story

Stories live next to the component, in `packages/ui/src/**/<Name>.stories.tsx` (CSF 3, typed with
`@storybook/react-vite`):

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./Button";

const meta = {
  title: "Primitives/Button",       // Primitives/<Name>; the brand layer uses Brand/<Name>, the motion Motion/<Name>
  component: Button,
  args: { children: "Continue" },
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};                           // one story per variant
export const Secondary: Story = { args: { variant: "secondary" } };
export const Disabled: Story = { args: { disabled: true } };
```

- **One story per variant** (and per meaningful state: disabled, loading, empty, error). Words arrive as args, never
  `t()`.
- Layout around the component uses the preset's roles only (`bg-surface-1`, `text-fg-secondary`,
  `border-border-default`…): the four UI rules of `@krizaka/config` lint the stories too.
- A story that must skip the audit says why: `parameters: { a11y: { test: "off" } }` — exceptional, reviewed.

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
Playwright version and rebuilds everything inside it. CI (`ci.yml`, `storybook.yml`) runs in that same image, so the
fonts and Chromium are identical: when `playwright` is bumped, bump the `container:` tag of both workflows and
re-run `test:update:linux`.

## Deployment

`.github/workflows/storybook.yml`: on every push to `main`, build → test → `site/latest/` → GitHub Pages
(`https://krizaka.github.io/krizaka-ui/latest/`, the root redirects to it). The Bunny mirror on `ui.krizaka.com`
for release tags comes later.

## Notes

- `@storybook/test-runner` is no longer maintained upstream for Storybook 10 (the Vitest addon is its successor). It
  still runs; `pnpm-workspace.yaml` holds `jest-runtime` at 30.4.2 because 30.5 refuses the `module.register()` call
  Storybook makes while loading `.storybook/test-runner.ts`. Moving to `@storybook/addon-vitest` (browser mode,
  Playwright) is the planned exit.
