---
"@krizaka/ui": major
---

Removed (announced in 3.55, ADR-006, krizaka-ui#674): the 17 entries deprecated since 3.55 (3.31 for `pointer-light`) that no product or app imports — `showcase` (and its React Native twin), `scroll-stage`, `landscape`, `signature`, `anatomy-plate`, `elephant`, `kanban`, `continue-prompt`, `promise-card`, `media-capture` (web and `./native/media-capture`), `video-trimmer`, `image-cropper`, `product-page`, `gallery-page`, `component-page`, `status-page` and `pointer-light`. Their documentation, stories, examples and size budgets go with them. Kept, because something still imports them: `tree-view` (the cockpit), the React Native `swipe-deck` and `match-dialog` (kitlive-native), `force-update-screen`, `maintenance-screen` (sovkora mobile) and their `update-prompt` contract.

`terminal-replay` is kept and no longer deprecated: agents.krizaka.com uses it.
