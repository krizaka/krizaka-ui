---
"@krizaka/ui": minor
---

New `@krizaka/ui/proposal` (`ProposalReview` and `DiffView`, web, beta; krizaka/krizaka-ui#673, ADR-006 §6): an agent proposes, a person approves, rejects or edits. `ProposalReview` names who proposes (with its bird), what, the confidence in words and figures, the evidence (children) and the actions — Approve (a two-step `ConfirmButton` when `irreversible`), Reject, Edit — and announces the state (waiting · approved · rejected · expired). `DiffView` signs every line (− / +) and labels it for screen readers; colour is never the only signal; lines wrap on a phone. No slide-to-approve, no haptics.
