---
"@krizaka/ui": minor
---

`@krizaka/ui/account-settings`: `AccountProfileCard` (picture and change action, name, e-mail with its verification, member since), `AvatarPicker` (a radiogroup grid of the family's default pictures with an upload slot), `ChoiceCards` (a single choice as cards with icon, title, description) and `LanguagePicker` (labelled, native names). `SettingsSection` gets `save`: one inline save per section (enabled while dirty, saving / saved with Undo / error as a live region), with `useSaveStatus` and `SaveStatus`. Section patterns (security, subscription, storage, my data) as registry examples (krizaka-ui#502).
