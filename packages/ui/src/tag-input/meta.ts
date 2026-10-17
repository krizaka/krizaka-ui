import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Tag input",
  summary: "Free words as removable chips — Enter or a comma adds one, a paste adds several, suggestions complete, `normalize` cleans and `validate` refuses with a reason.",
  status: "beta",
  category: "forms",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "Typing free tags is a keyboard task; on a phone the tags are chosen.", use: "tag-selector" }, desktop: "web" },
  whenToUse: [
    "For keywords a person invents: the tags of a video, the topics of an article.",
    "For a list of values typed one after the other: e-mail recipients, domains, IP addresses.",
  ],
  whenNotToUse: [
    { when: "When the values come from a closed list: a combobox with `multiple`.", use: "combobox" },
    { when: "For one free value: a plain field.", use: "field" },
  ],
  bestPractices: [
    "Normalise the way the product stores tags (lower case, no `#`, no spaces) so “#Sunset” and “sunset” are one tag.",
    "Say the limit and the separator in `hint` (“Up to 10 tags, separated by commas”).",
    "Offer the person's own history first in `suggestions`, then a curated list.",
    "Explain a refusal in words in `validate` (“Use letters and numbers only”).",
  ],
  accessibility: {
    keyboard: [
      { keys: "Enter / ,", action: "Add the typed word as a tag (or the active suggestion)." },
      { keys: "Backspace", action: "In an empty input, remove the last tag." },
      { keys: "Arrow Down / Arrow Up", action: "Move through the suggestions." },
    ],
    notes: [
      "Built on `Combobox` (multiple, creatable): the same combobox pattern and announcements.",
      "A refusal from `validate` is shown under the field and read with it (`aria-describedby`, `aria-invalid`).",
      "Each tag's remove button is named by `labels.remove` (“Remove sunset”).",
    ],
  },
  related: ["combobox", "chip", "field"],
  web: {
    imports: ["TagInput"],
    examples: [
      { name: "video-tags", title: "Tags of a video", description: "Suggestions, lower case without `#`, at most 10." },
      { name: "recipients", title: "E-mail recipients", description: "`validate` refuses what is not an address; a comma or a space adds one." },
    ],
  },
} satisfies ComponentMeta;
