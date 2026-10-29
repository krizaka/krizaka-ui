import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Verified badge",
  summary: "A seal that says the person or the account was verified (a selfie, an ID) — the accent, named in words.",
  status: "beta",
  category: "feedback",
  domain: "identity",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: ["Beside a name on a profile, a card, a message header.", "On a photo (`onMedia` / `on=\"media\"`)."],
  whenNotToUse: [
    { when: "For a status that changes (online, live).", use: "badge" },
  ],
  bestPractices: ["Name what was verified (“Verified with a selfie”) when it matters.", "Show it only for a check the platform did, never self-declared."],
  accessibility: {
    keyboard: [],
    notes: ["An image named by `label`; with `showLabel` the words are shown too."],
  },
  related: ["badge", "avatar"],
  web: {
    imports: ["VerifiedBadge"],
    examples: [
      { name: "verified", title: "Verified", description: "Beside a name, and with its words." },
    ],
  },
  native: {
    imports: ["VerifiedBadge"],
    differences: ["`size` is in points; `on=\"media\"` instead of `onMedia`."],
    examples: [
      { name: "verified", title: "Verified", description: "Beside a name, and with its words." },
    ],
  },
} satisfies ComponentMeta;
