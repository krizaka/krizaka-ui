---
"@krizaka/ui": patch
---

`useInfiniteList` (native): reaching the end again from a stale render no longer cancels the page already on its way and asks for it a second time (`fetchNextPage({ cancelRefetch: false })`).
