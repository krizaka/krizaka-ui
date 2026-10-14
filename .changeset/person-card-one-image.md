---
"@krizaka/ui": patch
---

fix(native): `PersonCard` draws one photo — the scrim under the name is sized in points from the overlay's own layout, so the photo is no longer cut in two (a dark band over the face and none under the name) on iOS.
