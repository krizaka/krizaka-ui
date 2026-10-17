import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Swipe deck",
  summary: "Cards decided one by one — drag right to like, left to pass, or the buttons (← → on the web) — with `PersonCard`: a person's photos, name, age, seal, distance, bio and interests.",
  status: "beta",
  category: "data-display",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: ["Discover in a dating app: like or pass, one profile at a time.", "Any one-by-one decision: approve or reject, keep or skip."],
  whenNotToUse: [
    { when: "To browse many items side by side.", use: "list" },
  ],
  bestPractices: ["Remove the decided card from `items` in `onSwipe`; keep two or three loaded ahead.", "Always keep the buttons: a swipe is never the only way.", "Say the decision (`decided`) so a screen reader hears it."],
  accessibility: {
    keyboard: [{ keys: "Arrow Right / Arrow Left", action: "On the focused deck: like or pass the top card." },
      { keys: "Tab", action: "Reaches the card's photo buttons and the like and pass buttons." }],
    notes: ["The top card is the only one exposed; the next waits hidden from assistive technology.", "React Native offers Like and Pass as accessibility actions of the card.", "Under reduced motion the card leaves without flying."],
  },
  related: ["verified-badge", "match-dialog", "photo-grid"],
  web: {
    imports: ["SwipeDeck", "PersonCard"],
    examples: [
      { name: "discover", title: "Discover", description: "Two profiles, photos to page through, the deck decided by drag, buttons or keys." },
    ],
  },
  native: {
    imports: ["SwipeDeck", "PersonCard"],
    differences: ["The card tilts with the finger and a stamp (LIKE / NOPE) says the decision; a medium tick marks it.", "`PersonCard` pages its photos with a tap on a side; screen readers swipe up and down."],
    examples: [
      { name: "discover", title: "Discover", description: "Two profiles: drag, stamps, buttons." },
    ],
  },
} satisfies ComponentMeta;
