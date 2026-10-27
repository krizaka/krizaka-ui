# @krizaka/a11y-audit

The accessibility guard of every Krizaka product's page audit. It runs **axe-core** (WCAG 2.0/2.1 A and AA, plus axe's
best practices: contrast, names, labels, landmarks, headings) on the pages a Playwright crawl already visits, in dark and
light, and holds the result with a **ratchet**: violations are counted per rule in a baseline file; a new one fails the
build, the count only goes down.

```bash
npm install --save-dev @krizaka/a11y-audit playwright-core
```

ESM, Node ≥ 22, test tool only (axe-core is MPL-2.0: never import it from an app — import this package).

```js
import { A11yCollector, auditPage, finish } from "@krizaka/a11y-audit";

const a11y = new A11yCollector("my-app");
// in the crawl, once the page is settled (load, fonts, theme), at the phone and the desktop width:
a11y.add({ route: path, theme }, await auditPage(page));
// at the end:
const { problems, notes } = finish(a11y, { baseline: "a11y-baseline.json" }); // --a11y-update lowers, --a11y-init records
```

| Export | What |
| :-- | :-- |
| `auditPage(page, { exclude?, tags? })` | axe in the page now; one `A11yFinding` per failing node (`rule`, `impact`, `target`, `help`) |
| `A11yCollector` | collects a crawl; a node counts once per rule, route, theme and selector (not per width) |
| `finish(collector, { baseline, update?, init? })` | compares with `a11y-baseline.json`, returns `{ problems, notes }`; `--a11y-update` lowers the baseline (never raises it), `--a11y-init` records today's counts |
| `compare`, `lowered`, `readBaseline` | the pure ratchet |

The baseline is `{ "app", "rules": { "<rule>": { "impact", "count" } } }`, committed at the repository root.
