import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Account settings",
  summary:
    "The blocks of an account page, so every app has the same polished one: the identity card (picture, name, verified e-mail, member since), a picture grid to choose from, a labelled language control, selectable cards for a single choice — beside `SettingsSection`'s one inline save.",
  status: "beta",
  category: "forms",
  domain: "identity",
  platforms: "web",
  parity: {
    native: { status: "gap", issue: "krizaka/krizaka-ui#503", reason: "The Expo apps get the same blocks on @krizaka/ui/native." },
    desktop: "web",
  },
  whenToUse: [
    "The profile page of any Krizaka app (a product's `/settings/profile`, the future `@krizaka/auth`).",
    "`ChoiceCards` for any single choice that deserves a sentence each: a side, a plan, a way to be answered.",
  ],
  whenNotToUse: [
    { when: "A choice between a few short words (a view, a size).", use: "radio-group" },
    { when: "A set of tiles that lead somewhere or show a line-up.", use: "choice-grid" },
    { when: "The language of a public page: it is a link to the same page in the other language.", use: "language-switch" },
  ],
  bestPractices: [
    "One save per section (`SettingsSection` `save`): enabled while the section is dirty, « Saved » and Undo after it, the failure as an alert. Never a save above the fields.",
    "`AvatarPicker` is one radiogroup — never a row of circles with loose radios; keep the upload inside its grid, after the pictures.",
    "Name every language in its own language and label the control: « Langue », never an unlabelled switch.",
    "Pass every word translated; the member-since date is formatted by the app in the viewer's language.",
    "Appearance: pass the themes the product offers (system, light, dark, then Blueprint and Carbone if wanted — never a paper theme inside a signed-in product) from `appearance` of @krizaka/tokens, and only the accents that read on all of them (`appearance.passes`). The change applies at once (`useAppearance()` of `@krizaka/ui/theme`, restored before paint by `ThemeScript`); save it in the account too so it follows the person. Sound is opt-in, off by default, never under reduced motion; density is `html[data-density]`.",
    "Section patterns (security, subscription, storage, my data) are flat sections of `SettingsRow`s: the billing portal is one link, the export one button, the delete a `ConfirmButton`.",
  ],
  accessibility: {
    keyboard: [
      { keys: "← → ↑ ↓", action: "Moves to the next picture, card or language and chooses it (one tab stop per group)." },
      { keys: "Space", action: "Chooses the focused one." },
      { keys: "Enter (in a field)", action: "Submits the section's form: saves when it is dirty." },
    ],
    notes: [
      "Each group is a named `radiogroup`; the chosen item says `aria-checked`, shows a ring and a check (not colour alone).",
      "A card's description is its `aria-describedby`; a picture is named by its `label`, not its image.",
      "The save result is a polite live region that stays mounted; a failure is `role=\"alert\"`.",
    ],
  },
  related: ["settings-layout", "radio-group", "avatar", "choice-grid", "confirm-button", "meter"],
  web: {
    imports: ["AccountProfileCard", "AvatarPicker", "ChoiceCards", "LanguagePicker", "AppearanceSettings"],
    examples: [
      { name: "profile", title: "Profile page", description: "A whole profile section: identity, name, pictures, language, side — one save, dirty then saved with Undo.", template: true, purpose: "operate", why: "A person changes who they are in the app in one place, and sees at once that it was kept." },
      { name: "avatar-picker", title: "Avatar picker", description: "The family's default pictures as one radio group, the upload beside them." },
      { name: "avatar-picker-folder", title: "Avatar picker of a folder", description: "`kind=\"folder\"`: the folder set, never a person; a « no picture » tile; the library's `Dropzone` to upload." },
      { name: "choice-cards", title: "Choice cards", description: "A single choice as two cards with an icon, a title and a line." },
      { name: "language-picker", title: "Language picker", description: "Labelled, native names." },
      { name: "appearance", title: "Appearance", description: "Theme cards (live miniatures, one check), accent, density and language as settings rows; applied at once with `useAppearance()`." },
      { name: "patterns", title: "Section patterns", description: "Security, subscription, storage and my data as flat sections of rows." },
    ],
  },
} satisfies ComponentMeta;
