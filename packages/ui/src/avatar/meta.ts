import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Avatar",
  summary: "A person or an account: their picture, or initials while it loads, when it fails or when there is none.",
  status: "stable",
  category: "data-display",
  platforms: "both",
  whenToUse: [
    "Next to a name: comments, creators, members, the signed-in account in a header.",
    "`Avatar.Group` to show who takes part (followers, collaborators) in little space.",
  ],
  whenNotToUse: [
    { when: "For a product, a video or a place: use an image in a card.", use: "card" },
    { when: "As the only way to say who someone is: show their name too, or give the avatar an `alt`." },
  ],
  bestPractices: [
    "Always pass a `fallback` (initials) on the web: images fail, and the layout should not jump.",
    "Use one size per list: `sm` in dense lists, `md` by default, `lg`/`xl` on a profile.",
    "In a group, set `max` so a long list ends with `+n` instead of overflowing.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "With `alt`, the picture is an image named by it; without `alt`, it is decorative — put the name in the text next to it.",
      "The fallback initials are shown, not announced, when an `alt` names the person.",
    ],
  },
  related: ["card", "badge", "skeleton"],
  web: {
    imports: ["Avatar"],
    examples: [
      { name: "with-image", title: "With an image", description: "A picture named by `alt`, with initials as `fallback`." },
      { name: "fallback", title: "Fallback", description: "No image: the initials." },
      { name: "sizes", title: "Sizes", description: "`xs`, `sm`, `md` (default), `lg`, `xl`." },
      { name: "group", title: "Group", description: "`Avatar.Group` with `max`: the others become `+n`." },
    ],
  },
  native: {
    imports: ["Avatar"],
    differences: [
      "The fallback is the initial of `alt` when `fallback` is not given.",
      "`size` also takes a number of points.",
      "`src` is a URI string (an `Image` source), not a URL object.",
      "An SVG `src` (`….svg`, `data:image/svg+xml,…`, or any URI with `svg`) is drawn by react-native-svg — `Image` cannot.",
    ],
    examples: [
      { name: "sizes", title: "Sizes", description: "Without an image: the initial of `alt`, from `xs` to `xl`." },
      { name: "group", title: "Group", description: "`Avatar.Group max={3}`: the rest becomes `+n`." },
    ],
  },
} satisfies ComponentMeta;
