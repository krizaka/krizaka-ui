import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Detail layout",
  summary: "One object's page: the way back, its media, name, status, facts and actions, its tabs, the content and a side panel that goes under the content on a phone.",
  status: "beta",
  category: "layouts",
  platforms: "web",
  whenToUse: ["A video, a job, an account, a pack, an order.", "Any object reached from a list."],
  whenNotToUse: [
    { when: "For a list and its item side by side.", use: "split-view" },
    { when: "For a screen of figures.", use: "dashboard-layout" },
  ],
  bestPractices: ["The status beside the name, in words (a Badge), not only a colour.", "Two or three actions at most in the header; the rest in a DropdownMenu.", "Put the tabs' `Tabs.Root` around the layout so the content follows the tab."],
  accessibility: {
    keyboard: [],
    notes: ["The name is the page's `h1`.", "The side panel is an `aside`; on a phone it comes after the content in reading order."],
  },
  related: ["tabs", "badge", "split-view"],
  web: {
    imports: ["DetailLayout"],
    examples: [
      { name: "video", title: "A video", description: "Orochia's video page: thumbnail, status, facts, tabs and the sales beside.", template: true, purpose: "show", why: "A viewer sees the object itself first, with its facts and the actions that concern it beside it." },
      { name: "job", title: "A job", description: "An engine job without tabs or side panel." },
    ],
  },
} satisfies ComponentMeta;
