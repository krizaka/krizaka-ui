---
"@krizaka/ui": minor
---

Default pictures have a **kind**. `defaultAvatar.kind` now also takes `folder`, `organisation` and `shop` (a glyph on the brand's gradient, drawn in the page as a data URL: a folder is never given a person), `DEFAULT_AVATAR_ENTITY_KINDS` lists them. `AvatarPicker` takes a `kind` (it lists only the options of that kind), a `noneLabel` tile (`AVATAR_NONE`), `uploadFile` (the library's `Dropzone` under the grid instead of the browser's loose file input) and exports `builtInAvatarOptions(kind, brand, label)`. The central sets (people, folders, organisations, shops, banners) are served from Bunny `defaults/v1/<kind>/` and listed in the Krizaka org JSON; `tools/export-defaults.mjs` renders and uploads them (yomizaka#433, krizaka-ts#134).
