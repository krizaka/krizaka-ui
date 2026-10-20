import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Settings layout",
  summary: "Settings: the sections on the side (a row of chips that scrolls on a phone) and the current section's forms, as titled cards with their own save or, flat, as hairline-divided rows (`SettingsRow`).",
  status: "beta",
  category: "layouts",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: ["Account, workspace and administration settings.", "Any long form that splits into independent groups."],
  whenNotToUse: [
    { when: "For a step-by-step setup the user follows once.", use: "stepper" },
    { when: "For one small form.", use: "field" },
  ],
  bestPractices: ["Prefer `variant=\"flat\"` and `SettingsRow` for a product's settings: a label and its help on the left, the control on the right, no card.", "Keep support-only facts (an account id) in a last `Advanced` section, small and mono, never in the first screen.", "One save per section, at its foot: a change never waits for another.", "Sections as pages (`/settings/billing`) or as anchors of one long page (`#billing`).", "Say in the description what the section changes for the user."],
  accessibility: {
    keyboard: [],
    notes: ["The sections are a `nav` named by `navLabel`; the current one has `aria-current` (page or location).", "Each section is a `section` named by its `h2`."],
  },
  related: ["field", "switch", "app-shell"],
  native: {
    imports: ["SettingsGroup", "SettingsRow"],
    differences: [
      "Only the rows: `SettingsGroup` (a titled card of hairline-divided rows) and `SettingsRow` (icon tile, label, help, value or control, a chevron when `onPress` opens something). The sections-on-the-side layout is a web idea; on a phone each section is a screen.",
      "A row with `onPress` is a button named by its visible words; a row with a `trailing` control (a `Switch`) leaves the control as the thing to press.",
    ],
    examples: [{ name: "account", title: "Account settings", description: "A group of rows: a value, a link that opens a screen, a switch, a destructive action." }],
  },
  web: {
    imports: ["SettingsLayout", "SettingsSection", "SettingsRow"],
    examples: [
      { name: "account", title: "Account settings", description: "Profile and notifications, each with its own save; the sections as chips on a phone.", template: true, purpose: "operate", why: "A person changes one setting at a time, saves it at once and knows where each lives." },
      { name: "flat", title: "Calm settings", description: "The flat variant: one column of at most 45rem, each setting a row (label and help left, control right) divided by hairlines.", template: true, purpose: "operate", why: "A person scans the settings, finds the one to change and changes it in place, without cards competing for attention." },
      { name: "sections", title: "One section per page", description: "A workspace's settings, the current section marked." },
    ],
  },
} satisfies ComponentMeta;
