---
"@krizaka/ui": minor
---

feat(avatar): `defaultAvatar.set` — the family's central set of pictures (`listDefaults("person")` of `@krizaka/org`) as the default of an `Avatar` / `defaultAvatarUrl`: `set[fnv1a(seed) mod n]` among the pictures not disabled, the same rule as `@krizaka/org`'s `defaultFor`, so the same person has the same picture in every product (krizaka-ui#598, part 1). No set, an empty one or no seed keep the brand's silhouette. `pickDefaultPicture` and `defaultAvatarSeedHash` are exported from `@krizaka/ui/avatar/defaults`.
