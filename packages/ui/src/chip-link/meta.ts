import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Chip link",
  summary: "A chip that is a link — a filter that is an address — with the look of `Chip`, the current one marked, and `chipVariants` to style anything else; server-safe.",
  status: "beta",
  category: "navigation",
  platforms: "web",
  whenToUse: ["Filters that change the address (`/explore?tag=night`): each tag is a link, shareable and server-rendered."],
  whenNotToUse: [
    { when: "To select options in a form or filter a list in place, without changing the address.", use: "chip" },
    { when: "For a section switch that is not a filter.", use: "tabs" },
  ],
  bestPractices: [
    "Mark the current filter with `selected`: `aria-current=\"page\"` says it, the accent shows it.",
    "Wrap the links in a `nav` named for what they filter.",
    "Use `asChild` with your router's link; `chipVariants({ selected })` for anything else.",
  ],
  accessibility: {
    keyboard: [{ keys: "Enter", action: "Follows the link." }],
    notes: ["Real links: the role, the focus and the keyboard come from the platform.", "The current filter carries `aria-current`, not only a colour."],
  },
  related: ["chip", "tabs"],
  web: {
    imports: ["ChipLink", "chipVariants"],
    examples: [{ name: "filters", title: "Filters that are links", description: "Tags as links, the current one marked — rendered on the server." }],
  },
} satisfies ComponentMeta;
