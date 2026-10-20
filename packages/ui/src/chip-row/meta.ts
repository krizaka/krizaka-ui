import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Chip row",
  summary: "A row of chip links that scrolls sideways with scroll-snap on a phone (the edge fades) and wraps from md: an audience picker, a page's filters.",
  status: "beta",
  category: "navigation",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A block of a public site's page; an app screen uses Chip.Group with `scrollable`.", use: "chip" }, desktop: "web" },
  whenToUse: [
    "A short list of choices that are addresses (« For whom? »): each one a link, on a phone one swipeable row instead of three wrapped lines.",
    "Filters of a page that change the URL, with a « Soon » badge on those not ready.",
  ],
  whenNotToUse: [
    { when: "Filtering a list in place, without changing the address.", use: "chip" },
    { when: "A single link as a filter, in a layout you control.", use: "chip-link" },
    { when: "Switching views of the same page.", use: "tabs" },
  ],
  bestPractices: [
    "Name the row with `label`; add a `hint` that says how to choose.",
    "Mark the current choice with `selected`: `aria-current` says it, the accent shows it.",
    "One or two words per item; the badge is a word (« Soon »), never a sentence.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Goes through the links." },
      { keys: "← →", action: "Move focus to the previous or next link; the row scrolls it into view." },
      { keys: "Home / End", action: "First or last link." },
      { keys: "Enter", action: "Follows the link." },
    ],
    notes: [
      "A `nav` named by `label`, a list of real links: the role, focus and keyboard come from the platform.",
      "Every target is at least 44 px high.",
      "The scroll is a convenience: the fade only hints; every link stays reachable by keyboard.",
    ],
  },
  related: ["chip-link", "chip", "tabs"],
  web: {
    imports: ["ChipRow"],
    examples: [
      { name: "audience", title: "Audience picker", description: "Who it is for: one selected, one with a « Soon » badge." },
      { name: "many", title: "Many items", description: "More than fit a phone: a swipeable row that wraps from md." },
    ],
  },
} satisfies ComponentMeta;
