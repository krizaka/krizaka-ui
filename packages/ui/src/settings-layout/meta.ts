import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Settings layout",
  summary: "Settings: the sections on the side (a row of chips that scrolls on a phone) and the current section's forms, each a titled card with its own save.",
  status: "beta",
  category: "layouts",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: ["Account, workspace and administration settings.", "Any long form that splits into independent groups."],
  whenNotToUse: [
    { when: "For a step-by-step setup the user follows once.", use: "stepper" },
    { when: "For one small form.", use: "field" },
  ],
  bestPractices: ["One save per section, at its foot: a change never waits for another.", "Sections as pages (`/settings/billing`) or as anchors of one long page (`#billing`).", "Say in the description what the section changes for the user."],
  accessibility: {
    keyboard: [],
    notes: ["The sections are a `nav` named by `navLabel`; the current one has `aria-current` (page or location).", "Each section is a `section` named by its `h2`."],
  },
  related: ["field", "switch", "app-shell"],
  web: {
    imports: ["SettingsLayout", "SettingsSection"],
    examples: [
      { name: "account", title: "Account settings", description: "Profile and notifications, each with its own save; the sections as chips on a phone.", template: true, purpose: "operate", why: "A person changes one setting at a time, saves it at once and knows where each lives." },
      { name: "sections", title: "One section per page", description: "A workspace's settings, the current section marked." },
    ],
  },
  native: {
    imports: ["SettingsSection", "SettingsRow"],
    differences: ["A phone's settings are one column of titled groups (`SettingsSection`), each a card of rows (`SettingsRow`): no side navigation, a row opens its own screen.", "`SettingsRow` takes an `accessory` (a `Switch`) in place of the value and chevron, and `destructive` for Sign out."],
    examples: [{ name: "settings", title: "Settings", description: "Rows that open a screen, one with a switch, and a destructive row." }],
  },
} satisfies ComponentMeta;
