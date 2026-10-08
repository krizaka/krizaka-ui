# @krizaka/ui — Repository Contract (agent-neutral)

> Scope of [`krizaka/krizaka-ui`](https://github.com/krizaka/krizaka-ui), published on npm as **`@krizaka/ui`**.
> `CLAUDE.md` only imports this file.

## 1. What belongs here

- The **brand layer shared by every Krizaka product**: the animated marks (`KrizakaLogo`, `OrazakaLogo`,
  `OrochiaLogo`, `ProductLogo`) and the **Krizaka motion signature** (`motion.css`, `MotionObserver`, `RotatingWord`).
- Nothing product-specific: a product's components live in its own design system (`@krizaka/orochia-design-system`,
  `@krizaka/orazaka-design-system`), which builds on this package.

## 2. Rules

- **No framework, no CSS library**: React is the only (peer) dependency. Marks embed their own CSS with prefixed
  classes (`kzm-`, `ozm-`, `orom-`); the signature is plain CSS with `kz-` classes and `--kz-*` variables.
- **Both themes**: neutral strokes read the host's `--kz-*` tokens and fall back to the text colour.
- **Unique ids per instance** (`useId`); decorative by default, an accessible image with `title`.
- **Reduced motion**: every animation stops under `prefers-reduced-motion`; marks also take `animated={false}`.
- A change to a mark is a change to the brand: it ships as a new version that every app adopts — the apps never
  keep a copy.

## 3. Release

`npm run check` (type-check, tests, build) must pass. A `v*` tag publishes to npm from CI with provenance
(`.github/workflows/ci.yml`); semantic versioning — a visual change to a mark is at least a minor.
