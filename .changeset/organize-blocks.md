---
"@krizaka/ui": minor
---

New `EntityHeader` (`@krizaka/ui/entity-header`, and on `@krizaka/ui/native`): the head of a collection, shop or studio — its picture (`avatar`, and an `avatarPicker` that opens the library's `AvatarPicker`), name and description edited in place, `TagChip` tags, and a refusal said with the product's words: `onNameChange` throws an error with a `code` and `refusals[code]` (`NAME_TAKEN`, `AVATAR_NOT_ALLOWED`, `DEFAULT_COLLECTION`, … of `@krizaka/organize/contract`) is shown. New `CollectionSwitcher` (`@krizaka/ui/collection-switcher`, and native): a list or a nesting (`parentId`), the default collection marked and never removable, the current one held by the URL (`value` + `onValueChange`, or `href` for real links), and `mode="entity"` for a shop or studio switcher in the shell. Adds `PencilGlyph`. Closes krizaka-ui#740.
