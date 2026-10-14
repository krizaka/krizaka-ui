---
"@krizaka/ui": minor
---

fix(native): `PersonCard` draws one photo — the scrim under the name is sized in points from the overlay's own layout, so the photo is no longer cut in two (a dark band over the face and none under the name) on iOS.

feat(ui): `MatchDialog` takes a `container` — draw the dialog inside a brand scope (`.brand-…`) so it wears the product's identity instead of the default one.
