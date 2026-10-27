---
"@krizaka/config": minor
---

React effects are for the outside world (krizaka/.github `docs/standards/react-effects.md`): `krizakaStack()` gains
`krizaka/no-async-in-effect` (an effect that loads data: use `useQuery` / `useMutation`) and
`krizaka/no-derived-state-in-effect` (an effect that only sets state: derive in render or use a `key`), errors by default
(`effects: "warn"` while a repository has debt), and `krizaka-ratchet` counts them (`asyncInEffect`,
`derivedStateInEffect`) so the debt only goes down.
