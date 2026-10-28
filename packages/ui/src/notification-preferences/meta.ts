import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Notification preferences",
  summary: "What reaches a person: categories down, channels across, a switch at each crossing, presets that set it all at once, a locked row for what cannot be turned off (security).",
  status: "beta",
  category: "forms",
  domain: "identity",
  platforms: "web",
  parity: { native: { status: "gap", issue: "krizaka/krizaka-ui#275", reason: "On a phone one switch per category in a `SettingsGroup` already does the job (a notifications screen); the matrix is a computer's idea." }, desktop: "web" },
  whenToUse: ["The notifications part of an account page, where the product sends in the app and by e-mail.", "Any choice of several kinds of message over several channels."],
  whenNotToUse: [
    { when: "One kind of message, one channel.", use: "switch" },
    { when: "A single setting with a label and help.", use: "settings-layout" },
  ],
  bestPractices: ["Keep the value as plain data and save at once, as `SettingsSection` does.", "Offer presets: most people want « everything » or « essentials », not twelve switches.", "Show the security row locked on, with the reason, instead of hiding it.", "Disable a whole channel (`disabled`) when it is off for the account, and say why next to the table."],
  accessibility: {
    keyboard: [{ keys: "Tab, Space", action: "Each switch is a stop; the presets are a group with arrow keys." }],
    notes: ["A real table: channels are column headers, categories are row headers.", "Each switch is named « Category — Channel »."],
  },
  related: ["switch", "chip", "settings-layout"],
  web: {
    imports: ["NotificationPreferences"],
    examples: [{ name: "default", title: "Categories and channels", description: "Four categories over the app and e-mail, three presets, security locked on.", template: true, purpose: "operate", why: "A person decides what reaches them and where, in one place, with a sensible preset to start from." }],
  },
} satisfies ComponentMeta;
