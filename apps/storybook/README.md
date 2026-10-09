# Storybook — the Krizaka platform catalogue

Private app (never published). It renders every story of `@krizaka/ui`, reads them exactly as a product does
(`tailwindcss` → `@krizaka/tailwind` → `@krizaka/ui/tailwind.css`), and checks them: an axe audit and a screenshot in
**dark and light** for every story. Published on every push to `main`:
**[krizaka.github.io/krizaka-ui/latest](https://krizaka.github.io/krizaka-ui/latest/)**.

Storybook 10 (`@storybook/react-vite`, addons `docs`, `a11y`, `themes`), Tailwind CSS v4 through `@tailwindcss/vite`.

```bash
pnpm --filter storybook dev               # http://localhost:6006
pnpm turbo run storybook:build --filter=@krizaka/storybook   # → storybook-static/ (builds @krizaka/ui first)
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
- A story that opens something in a portal (dialog, sheet, popover, menu, tooltip, toasts) renders it outside
  `#storybook-root`: it opens it at load (`defaultOpen`) and sets `parameters: { capture: "viewport" }` — the audit
  then covers the page (without axe's `region` rule, which belongs to an app's layout) and the screenshot the viewport.

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

`.github/workflows/storybook.yml`:

- **Every push to `main`**: build → test → `site/latest/` → GitHub Pages
  (`https://krizaka.github.io/krizaka-ui/latest/`, the root redirects to it).
- **Every release of `@krizaka/ui`** (tag `@krizaka/ui@x.y.z`): the same build, then the `bunny` job copies it to
  Bunny Storage, served by the pull zone **[ui.krizaka.com](https://ui.krizaka.com/latest/)**: `/latest/` and
  `/<version>/` (e.g. `/2.0.0/`), plus `site/index.html` at the root (a redirect to `/latest/`). The
  `github-pages` environment refuses tags, so the Pages deployment is skipped there and `bunny` downloads the artifact
  the build job of the same run uploaded. `release.yml` starts this run itself after a publish
  (`gh workflow run storybook.yml --ref @krizaka/ui@<version>`): a tag pushed by `GITHUB_TOKEN` starts no workflow,
  and a `git push --tags` of more than three tags neither — run that command by hand after a local publish.
- **Pull requests** touching `apps/storybook/` or the workflow: build, then `bunny-dry-run` lists what a release
  would send. No network, no secret.

Every page declares `<link rel="canonical" href="https://ui.krizaka.com/latest/">` (`managerHead` in
`.storybook/main.ts`).

### The Bunny mirror — `scripts/bunny-upload.mjs`

A dependency-free Node script: 8 uploads in parallel, retries with backoff on network errors, 429 and 5xx, a SHA-256
`Checksum` on every file, an unknown extension stops the run (Bunny serves the Content-Type from the extension).

```bash
node scripts/bunny-upload.mjs --dir storybook-static --dest latest --dest 2.0.0 --root site/index.html --rules --purge --dry-run
```

Cache policy (`cacheControlFor`, unit-tested in `scripts/bunny-upload.test.mjs`, run by `pnpm --filter storybook test`):

| Files | Cache-Control |
| :-- | :-- |
| Hashed Vite chunks, `assets/*-<hash>.*` | `public, max-age=31536000, immutable` |
| `*.html`, `*.json`, folder URLs | `public, max-age=0, must-revalidate` |
| Everything else (`sb-manager/`, fonts, icons) | `public, max-age=3600` |

Bunny Storage keeps no per-file header, so `--rules` writes the same policy as three edge rules of the pull zone
(`SetResponseHeader Cache-Control`, described `krizaka-ui: Cache-Control …`, updated in place on every release);
`--purge` then purges the zone so `/latest/` is fresh at once.

Repository secrets (Settings → Secrets and variables → Actions); without all four, the `bunny` job is skipped:

| Secret | Value |
| :-- | :-- |
| `BUNNY_STORAGE_KEY` | The Storage zone password (FTP & API access) of `krizaka-ui` |
| `BUNNY_STORAGE_ZONE` | The Storage zone name: `krizaka-ui` |
| `BUNNY_API_KEY` | The account API key (edge rules, purge) |
| `BUNNY_PULLZONE_ID` | The numeric id of the pull zone serving `ui.krizaka.com` |

Optional repository variable `BUNNY_STORAGE_HOST`: the zone's regional endpoint when it is not Falkenstein
(`ny.storage.bunnycdn.com`, `la.storage.bunnycdn.com`, `sg.storage.bunnycdn.com`, `syd.storage.bunnycdn.com`…).

## Notes

- `@storybook/test-runner` is no longer maintained upstream for Storybook 10 (the Vitest addon is its successor). It
  still runs; `pnpm-workspace.yaml` holds `jest-runtime` at 30.4.2 because 30.5 refuses the `module.register()` call
  Storybook makes while loading `.storybook/test-runner.ts`. Moving to `@storybook/addon-vitest` (browser mode,
  Playwright) is the planned exit.
