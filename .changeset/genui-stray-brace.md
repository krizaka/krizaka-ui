---
"@krizaka/ui": patch
---

GenUi: a line that closes one brace too many keeps its first complete object (measured on Orazaka dev: a model's `updateComponents` line ended with `}}}`) — only stray `}` / `]` may follow, the object is validated as any other; `leadingObject` is exported.
