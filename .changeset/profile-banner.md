---
"@krizaka/ui": minor
---

`ProfileBanner` (in `@krizaka/ui/profile-card`, #650): the top of a page about one person or place — a client, a shop, a creator, a building. It has a slim cover (an image, or a tint of the brand's accent), the avatar overlapping its lower edge at every width, the eyebrow, the name (the `h1`), a status, its facts and the actions. No text is ever drawn on the cover. `DetailLayout` gains `cover`: its header becomes the banner, with `media` as the avatar. React Native: `ProfileBanner` in `@krizaka/ui/native`. Extracted from Orochia's profile hero (#515).
