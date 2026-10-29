import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Tag selector",
  summary: "Interests, languages, a workspace's tags: toggle chips with a limit and a count — the others rest once the limit is reached. With a `marker` an option is a tag with its colour; `creatable` adds a field where Enter takes the tag typed or creates it.",
  status: "beta",
  category: "forms",
  domain: "forms",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: ["A profile's interests, up to five.", "Filters by topic with a limit.", "A workspace's tags on a file (`creatable`): choose among the tags that exist, or type a new one and give it a colour of the closed palette."],
  whenNotToUse: [
    { when: "To type free words that are not a list the workspace keeps (keywords, e-mail recipients).", use: "tag-input" },
    { when: "For one choice.", use: "radio-group" },
  ],
  bestPractices: ["Say the limit in the count (“3 of 5 chosen”).", "Order the options by popularity, not alphabet.", "`creatable`: the host creates the tag in `onCreate(name, marker)` (it may refuse a duplicate or a limit), adds the option and chooses it; pass `markerNames` to let the person pick the colour.", "Never the only signal: a tag's colour sits beside its name."],
  accessibility: {
    keyboard: [{ keys: "Tab / Space", action: "Reach and toggle each chip." }, { keys: "Enter", action: "`creatable`: in the field, chooses the tag typed or creates it." }, { keys: "Backspace", action: "`creatable`: on an empty field, takes the last chosen tag back." }, { keys: "Esc", action: "`creatable`: clears the field." }],
    notes: ["A group named by `label`; each chip says whether it is chosen; the count is announced.", "`creatable`: the field has its own accessible name (`inputLabel`) and controls the group; the colour choice is a named radio group."],
  },
  related: ["chip", "tag-input", "filter-bar"],
  web: {
    imports: ["TagSelector"],
    examples: [
      { name: "interests", title: "Interests", description: "Ten interests, up to five." },
      { name: "creatable", title: "A workspace's tags", description: "`creatable`: type to narrow, Enter takes the tag of that name or creates one in the colour chosen; the tags carry their markers." },
    ],
  },
  native: {
    imports: ["TagSelector"],
    differences: ["A selection tick on each toggle.", "`marker` on an option draws a `TagChip`. `creatable` is web-first: on a phone, create a tag in the form of the product."],
    examples: [
      { name: "interests", title: "Interests", description: "Ten interests, up to five." },
      { name: "tags", title: "A client's tags", description: "Options with a `marker`: the tags of a file, each with its colour." },
    ],
  },
} satisfies ComponentMeta;
