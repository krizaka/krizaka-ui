import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Alert",
  summary: "A message in the flow of the page: a tone, an icon, a title, a text and an optional action.",
  status: "stable",
  category: "feedback",
  platforms: "web",
  whenToUse: [
    "To tell the reader something about the whole page or section: a new rule, an account state, a failed payment.",
    "When the message must stay visible until the situation changes (a low balance, an expired card).",
    "With an `action` when there is one obvious next step: “Top up”, “Retry”.",
  ],
  whenNotToUse: [
    { when: "For the result of an action the user just took (saved, sent): it should come and go.", use: "toast" },
    { when: "When the user must answer before going on.", use: "dialog" },
    { when: "To explain why a field is invalid: put the error under the field.", use: "field" },
    { when: "When a list or a panel has nothing to show.", use: "empty-state" },
  ],
  bestPractices: [
    "Lead with the title: what happened, in a few words; the text says what it means or what to do.",
    "`danger` and `warning` only for what needs attention now: an alert that is always there stops being read.",
    "The icon is decorative and the tone is carried by the tint, the border and the icon: the text stays legible in both themes.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "`danger` and `warning` render `role=\"alert\"` (announced at once); `info` and `success` render `role=\"status\"` (announced politely).",
      "Render the alert when the situation occurs, not before: a live region only announces content that changes.",
      "The icon is hidden from assistive technology; the title and the text carry the meaning.",
    ],
  },
  related: ["toast", "empty-state", "dialog", "badge"],
  web: {
    imports: ["Alert"],
    examples: [
      { name: "info", title: "Info", description: "The default tone: news the reader should know, announced politely." },
      { name: "success", title: "Success", description: "A state that is now good: verified, paid, connected." },
      { name: "warning", title: "Warning", description: "Something will go wrong soon, with what to do about it." },
      { name: "danger", title: "Danger", description: "Something went wrong: what failed and how to fix it." },
      { name: "title-only", title: "Title only", description: "A short message needs no icon and no text." },
    ],
  },
} satisfies ComponentMeta;
