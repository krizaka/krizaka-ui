---
name: krizaka-a11y-audit
description: The accessibility guard in a Krizaka product's page audit — axe-core WCAG 2.1 AA on every route in dark and light, and a ratchet baseline that only goes down. Use it when adding a page to a crawl, fixing a contrast or an unnamed button, or when a CI run fails on "a11y".
---

# @krizaka/a11y-audit

1. Never import `axe-core` in an app: `auditPage(page)` from `@krizaka/a11y-audit`, in the crawl that already settles the page.
2. A failing `a11y <rule> (serious): n > baseline m` is a new violation: fix it. Do not raise the baseline.
3. Fixed some? Rerun the crawl with `--a11y-update`; the baseline only goes down. Commit `a11y-baseline.json`.
4. Serious and critical findings (contrast below AA, buttons and inputs without a name) are fixed first, never recorded as debt.
5. Contrast is read from the rendered page: a colour is fixed in the token (`--kz-*`), not hidden with an exclusion.
