import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Match dialog",
  summary: "The moment two people choose each other — a match, a pair, a deal: the two avatars meet at a heart in the brand gradient, the next step under them.",
  status: "deprecated",
  deprecated: {
    since: "3.55.0",
    removedIn: "4.0.0",
    reason: "No user: Yasakia is paused and no filed need names it (ADR-006 audit, 2026-10-25): there is no replacement.",
  },
  category: "overlays",
  domain: "feedback",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: ["A mutual like in a dating app.", "Two parties agree: a deal, a duo for a challenge."],
  whenNotToUse: [
    { when: "To confirm an action.", use: "dialog" },
    { when: "For a passing confirmation.", use: "toast" },
  ],
  bestPractices: ["Offer the next step first (“Send a message”), and a way back.", "Keep it rare: it is a celebration."],
  accessibility: {
    keyboard: [{ keys: "Esc", action: "Closes it (the way back)." }],
    notes: ["A dialog named by its title, announced when it opens; a success tick on React Native.", "The entrance is skipped under reduced motion."],
  },
  related: ["dialog", "swipe-deck", "chat"],
  web: {
    imports: ["MatchDialog"],
    examples: [
      { name: "its-a-match", title: "It's a match", description: "Opened at load: the two avatars, the message button." },
    ],
  },
  native: {
    imports: ["MatchDialog"],
    differences: ["Full screen; the avatars slide in with a spring, the heart pops."],
    examples: [
      { name: "its-a-match", title: "It's a match", description: "Full screen, a success tick." },
    ],
  },
} satisfies ComponentMeta;
