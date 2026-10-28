import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Split view",
  summary: "A list and its open item: two panes on a desktop; on a phone one at a time, the open item with the way back — chosen by showDetail, from the address.",
  status: "beta",
  category: "layouts",
  domain: "navigation-shell",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A phone shows one pane at a time: the list, then the item on its own screen.", use: "screen" }, desktop: "web" },
  whenToUse: ["Messages, moderation queues, jobs, notifications.", "Any list the user works through item by item."],
  whenNotToUse: [
    { when: "For an object reached from elsewhere.", use: "detail-layout" },
    { when: "For rows to sort and select.", use: "data-table" },
  ],
  bestPractices: ["Put the open item in the address (`?thread=lea`) and pass `showDetail` from it: back and forward work, a link can be shared.", "Mark the open item in the list with `aria-current`.", "Say what to do when nothing is open (`empty`)."],
  accessibility: {
    keyboard: [],
    notes: ["Each pane is a `section`; the list's title is an `h2`.", "On a phone the hidden pane is not rendered visibly (display none): it is not read either."],
  },
  related: ["detail-layout", "data-table", "app-shell"],
  web: {
    imports: ["SplitView"],
    examples: [
      { name: "messages", title: "Messages", description: "A creator's inbox: threads beside the open one, a reply box at its foot.", template: true, purpose: "converse", why: "A person reads a thread and replies without leaving the list of conversations." },
      { name: "empty", title: "Nothing open", description: "The list, and what to do while nothing is open." },
      { name: "notifications", title: "Notifications centre", description: "What happened, newest first and grouped by day; the selected one opens beside the list.", template: true, purpose: "converse", why: "A person catches up on what happened and acts on one item without losing the list." },
      { name: "nearby", title: "Find a place nearby", description: "The map is the page; the list beside it says the same in words and moves with it.", template: true, purpose: "act", why: "A person picks a place by where it is, with the list as an equal way in." },
    ],
  },
} satisfies ComponentMeta;
