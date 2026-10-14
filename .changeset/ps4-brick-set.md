---
"@krizaka/ui": minor
"@krizaka/tokens": minor
"@krizaka/tailwind": minor
---

The next bricks of the stack (decisions S5, S8, S10).

- **`code-block` on TanStack Highlight** (replaces the regex highlighter): grammars for TS, TSX, JS, JSX, JSON, YAML, Bash, HTML (XML), CSS, Java, Kotlin, diff and `.properties`; the colours are the tokens' text roles (the `th-*` classes, no inline colour); `lineNumbers` and `annotations` (highlight, added, removed, focus — the rest is dimmed —, dim, error, warning). `highlight(code, language)` keeps its signature and now returns `th-*` spans (the old `kz-tk-*` classes are gone). `copyLabel` / `copiedLabel` are optional: without them a block has no copy button.
- **`markdown`** (new, web and `./native/markdown`): TanStack Markdown's AST on the tokens — headings, lists and tasks, quotes, tables, links, images, footnotes, fenced code in `CodeBlock`. Raw HTML is never rendered and executable URLs are dropped; `streaming` closes the unfinished end of a text that arrives in pieces (an AI answer) and shows a caret; React Native draws the same AST in `Text` and `View`.
- **`recipes`** (new): `defineRecipe` writes a component's variants once as classes of the tokens — `tv(recipe)` on the web, `nativeRecipe(recipe).resolve(props, theme)` on the phone. Button, Badge, Chip and Card are built on it, web and native, with a parity test (every variant resolves on both sides, on roles that exist in both themes, and nothing is left unresolved but what only the web has). On the phone, buttons and badges take their weight and tracking, chips their size, from the same classes as the web (buttons and badges `font-semibold`, badges `tracking-wider`, small chips 12 pt sides).
- **`app-shell`**: the keyboard — ⌘/Ctrl+B folds the sidebar (`collapseShortcut`), `AppShell.Search` is the header's search that opens your `CommandDialog` (⌘/Ctrl+K), `AppShell.Item shortcut="g p"` goes to a section by a sequence or a combination, with the keys shown on hover and `aria-keyshortcuts`; `useShortcuts`, `formatShortcut`. A new `console` template: sections with shortcuts, the palette, a page header with its links, a server-side table on `@krizaka/query` and a form that creates a row.
- **`file-upload` and `search-field` run on `@krizaka/pacer`**: `useUploadQueue` is a queue of uploads (new `retries`, `backoff`, `shouldRetry`; pause by aborting the signal, as before) and the search fields debounce with its hooks, on the web and on the phone. The local debounce helper is gone.
