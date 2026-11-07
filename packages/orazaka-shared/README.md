# @krizaka/orazaka-shared

The contracts the Sovkora apps share, framework-agnostic: Zod schemas and their TypeScript types (jobs, runs,
automations, billing, packs, studios), the document pre-flight, and the design tokens for React Native and the CLI.
CommonJS, so React Native and Node read it with `require`. Lives in
[`packages/orazaka-shared`](https://github.com/krizaka/krizaka-ui/tree/main/packages/orazaka-shared) of krizaka-ui.

## Install

```bash
npm install @krizaka/orazaka-shared
```

```ts
import { JobSchema, themes } from "@krizaka/orazaka-shared";

const job = JobSchema.parse(await response.json());
```

## Develop

```bash
pnpm turbo run check --filter=@krizaka/orazaka-shared   # eslint, type-check, Vitest, build, size, publint + attw
```

Apache-2.0 · Part of [Krizaka](https://www.krizaka.com).
