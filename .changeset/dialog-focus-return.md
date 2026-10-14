---
"@krizaka/ui": patch
---

Dialog, Sheet and AlertDialog give focus back to the element that opened them when there is no `Dialog.Trigger` (a controlled `open` opened by a plain button): on Escape focus no longer falls to `<body>` (WCAG 2.4.3). A consumer's `onCloseAutoFocus` that prevents the default still wins.
