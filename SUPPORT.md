# Support policy

How long a version of the Krizaka front-end platform receives fixes, how an API leaves it, and how products keep up.
The same policy applies to the JVM platform (`com.krizaka`, `krizaka-bom`) — see the study §5.4.

## Supported versions

Two majors are supported: the current one (**N**) and the previous one (**N-1**). N-1 receives fixes (bugs,
security, accessibility) for **6 months after N is released**; after that, only N.

| Package | N (current) | N-1 | N-1 fixes until |
| :-- | :-- | :-- | :-- |
| `@krizaka/ui`, `@krizaka/tokens`, `@krizaka/tailwind` (one `fixed` group, one version) | **2.x** (2.0.0, 2026-10-10) | `@krizaka/ui` 1.x (marks and motion) | 2027-04-10 |
| `@krizaka/icons`, `@krizaka/intl`, `@krizaka/i18n`, `@krizaka/config` | **0.x** — the latest minor | — | — |

A `0.x` package may change its API in a minor (semantic versioning for `0.x`); its changelog says how to migrate. It
moves to 1.0.0 once the products have adopted it without a breaking change for a full minor.

A fix for N-1 is released from a `release/<major>.x` branch (created when the first such fix is needed), as a
patch with its changeset.

## Deprecation

An API lives **one complete minor deprecated** before it is removed, and it is only removed in the next major:

1. **Deprecate** (minor): `@deprecated` in the JSDoc (editors strike it through) with what replaces it, and a
   `console.warn` in development only (`process.env.NODE_ENV !== "production"`, guarded for environments without
   `process`), once per mount. The changeset says *what* replaces it and *for whom*. The registry `meta.ts` and the
   page on krizaka.com/docs/ui say it too.
2. **Codemod**: removing a primitive or renaming a prop comes with a codemod in `tools/codemods/<package>-<major>/`
   (jscodeshift or ts-morph, tested on fixtures), named in the changeset and in the migration notes of the major.
3. **Remove** (next major): the major's changeset lists every removal and the codemod to run.

Example: `<Command.Empty>` inside `<Command.List>` warns in development since 2.0.0 (the listbox may only hold
options); `Command.List emptyLabel` replaces it.

## Updates in the products

Products follow the platform with [Renovate](https://docs.renovatebot.com/) and the shared preset of this repository,
[`renovate/krizaka.json`](renovate/krizaka.json):

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended", "github>krizaka/krizaka-ui//renovate/krizaka"]
}
```

One pull request per platform release (group `krizaka`: `@krizaka/*` and `com.krizaka:*`), labelled, with the
changelogs in its description; patches merge themselves when CI is green. Minors and majors wait for a review.

## Compatibility

- `@krizaka/ui` peers: `react` ≥ 18 (19 recommended), `tailwindcss` ^4.1, `@krizaka/tailwind` of the same major;
  `react-native` ≥ 0.76 and `react-native-svg` ≥ 15 for `@krizaka/ui/native`.
- Node ≥ 22 for the tooling (`krizaka-i18n`, `krizaka-ratchet`).
- JVM: `krizaka-bom` is the only source of versions; `japicmp` guards the semantic-versioning boundary.

## Reporting a problem

Open an issue on [krizaka/krizaka-ui](https://github.com/krizaka/krizaka-ui/issues); for a vulnerability, use GitHub's
private vulnerability reporting on the repository (Security → Report a vulnerability), never a public issue.
