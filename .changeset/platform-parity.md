---
"@krizaka/ui": minor
"@krizaka/charts": minor
---

Platform parity — web · native · desktop. Every component's meta now declares `parity`: why it is not on the platform it lacks (`gap` ✗ with the issue that tracks it, or `n/a` with the reason and the component that answers there) and its desktop form (the Orazaka Mac app renders the web components: `"web"`, `"desktop"` or an absence). The registries carry it (`registry/<name>.json` and `registry/index.json`: `parity.{web,native,desktop}.state`), ui.krizaka.com draws the matrix from it, and the registry tests fail on a component without a decision.
