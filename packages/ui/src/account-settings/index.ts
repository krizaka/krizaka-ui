/** @krizaka/ui/account-settings — the blocks of an account page: `AccountProfileCard`, `AvatarPicker`, `ChoiceCards`, `LanguagePicker`. Client. The inline save of a section is `SettingsSection`'s `save` with `useSaveStatus` (`@krizaka/ui/settings-layout`). */
export { AccountProfileCard, type AccountProfileCardProps } from "./account-profile-card";
export {
  type AccentOption,
  type AppearanceLabels,
  appearanceLabels,
  AppearanceSettings,
  type AppearanceSettingsProps,
  type ThemeCardOption,
  type ThemePreview,
} from "./appearance-settings";
export { type AvatarOption, AvatarPicker, type AvatarPickerProps } from "./avatar-picker";
export { type ChoiceCardOption, ChoiceCards, type ChoiceCardsProps } from "./choice-cards";
export { type LanguageOption, LanguagePicker, type LanguagePickerProps } from "./language-picker";
