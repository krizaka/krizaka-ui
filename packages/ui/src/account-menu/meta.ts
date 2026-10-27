import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Account menu",
  summary: "The menu under a signed-in person's avatar: who they are, their profile and settings, the language and the theme as compact submenus, Sign out.",
  status: "beta",
  category: "navigation",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "On a phone the account is a screen of the tab bar, not a menu.", use: "settings-layout" }, desktop: "web" },
  whenToUse: ["The top bar of a signed-in web app, at the right.", "Any app that offers profile, settings, language and Sign out in one place."],
  whenNotToUse: [
    { when: "For the actions of an item (edit, share, delete).", use: "dropdown-menu" },
    { when: "For the navigation between the app's sections.", use: "nav-bar" },
  ],
  bestPractices: [
    "Identity first (picture, name, e-mail), then places, then preferences, then Sign out last.",
    "Use the product's `defaultAvatar` (`{ brand, seed }`) when there is no photo; never a grey silhouette or an initials tile.",
    "Sign out is a quiet item: it is not a destructive action, so it is not red.",
    "In the family's top bar (`AppHeader` `account`), `showName=\"lg\"`: the name from 1024 px, where search and the counts no longer need the room.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Enter / Space / Arrow down", action: "Opens the menu from the avatar." },
      { keys: "Arrow right / Enter on Language", action: "Opens the language choices; Arrow left or Esc goes back." },
      { keys: "Esc", action: "Closes the menu and returns the focus to the avatar." },
    ],
    notes: ["The trigger is named by `label`; the menu is a Radix menu (roving focus, typeahead)."],
  },
  related: ["dropdown-menu", "avatar", "nav-bar"],
  web: {
    imports: ["AccountMenu"],
    examples: [{ name: "default", title: "Account menu", description: "Identity, profile and settings links, a language submenu and Sign out." }],
  },
} satisfies ComponentMeta;
