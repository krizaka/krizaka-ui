---
"@krizaka/ui": minor
"@krizaka/tokens": minor
"@krizaka/tailwind": minor
---

The admin's editors of a kind's vocabulary (ADR-006 §7, [#690](https://github.com/krizaka/krizaka-ui/issues/690); `@krizaka/organize` `KindConfig`, krizaka-ts#89) — new entry `@krizaka/ui/kind-config-editor`, web and React Native, same props.

- **`TagSetEditor`:** the presets of a variant (name, colour from the closed palette, order — drag, buttons or Alt + ↑ ↓), who manages tags, « people can add their own », the most (1 to 200). A name another tag has is marked in place.
- **`StatusSetEditor`:** the states in their order, each with a label in French and one in English (every field says its language), a tone, « final »; the initial state; the moves from × to with their roles, a second press and the reasons to pick from (off by default, never free text). A final state's row says « Final: no way out »; the initial state is never final. A derived set is shown read-only.
- Both take the descriptor and give it back (`value` / `onChange`), show `kindConfigProblems` in place (`problems`), and never hold the save logic. The pure changes are tested to keep the contract by construction.
