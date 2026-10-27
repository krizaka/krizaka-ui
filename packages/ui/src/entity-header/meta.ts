import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Entity header",
  summary:
    "The head of an entity (a collection, a shop, a studio): its picture, its name and description edited where they are read, its tags, and a refusal said with the product's own words.",
  status: "beta",
  category: "blocks",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: [
    "At the top of the page of one collection, shop or studio, where the owner renames it, describes it and changes its picture.",
    "When the server answers with a refusal code (`NAME_TAKEN`, `AVATAR_NOT_ALLOWED`, `DEFAULT_COLLECTION`) and the page must say it in words.",
  ],
  whenNotToUse: [
    { when: "For the signed-in person's own profile and picture.", use: "account-settings" },
    { when: "To move between collections.", use: "collection-switcher" },
  ],
  bestPractices: [
    "Give `onNameChange` only when the viewer may rename: without it the name is plain text, not a button.",
    "Throw an error with a `code` from `onNameChange` to show `refusals[code]`; the field stays open with the text typed.",
    "Pass `refusals` for the codes your product can get; a code without a message says nothing, so the product never shows raw codes.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Enter", action: "On the name or description: opens the field. In the field: saves." },
      { keys: "Escape", action: "In the field: gives back the previous text." },
      { keys: "Tab", action: "Leaves the field, which saves it." },
    ],
    notes: [
      "The name is the page's `h1`; the button inside it is named by `nameLabel`.",
      "A refusal is announced as an alert, in the product's words.",
      "The picture's button is named by `triggerLabel`; the picker inside it is the library's radio group.",
    ],
  },
  related: ["account-settings", "collection-switcher", "tag-selector"],
  web: {
    imports: ["EntityHeader"],
    examples: [{ name: "basic", title: "Rename in place", description: "Name and description edited where they are read; a taken name is refused in words." }],
  },
  native: {
    imports: ["EntityHeader"],
    differences: [
      "Same data. The picture is a button (`onAvatarPress`, `avatarLabel`): the app opens its own picker. The name and description edit in a text field on a tap.",
    ],
    examples: [{ name: "basic", title: "Rename in place", description: "Tap the name to rename it; a taken name is refused in words." }],
  },
} satisfies ComponentMeta;
