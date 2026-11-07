import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Chat showcase",
  summary:
    "A self-playing sovereign AI chat: a question, the answer typed out, the interceptor pipeline it went through, and the promise that nothing left the premises.",
  why: "Orazaka sells one idea — your AI answers on your own machines, through a deterministic pipeline, with zero data egress. A chat bubble from @krizaka/ui cannot tell that story; this composite stages it the same way on the website, the client app and the console: the persona asks, the engine answers locally, the pipeline chips land, the privacy line closes.",
  status: "stable",
  category: "data-display",
  platforms: "web",
  builtOn: [],
  whenToUse: [
    "On a home or a product page, to show what Orazaka does in one glance.",
    "In an empty state of the chat (first visit), as a demonstration before the first question.",
  ],
  whenNotToUse: [
    { when: "For a real conversation: this is a scripted mockup, not a chat." },
    { when: "For a short status of the engine (online, model).", use: "ui/badge" },
  ],
  bestPractices: [
    'Speak as a named persona with a real need ("Eric, finance lead"), never an admin or a test account.',
    "The pipeline names steps the reader understands (`PII masked`, `Routed locally`), not class names.",
    "Every word is a prop (`labels`, `question`, `answer`, `pipeline`): the app translates them.",
    "One per page: it moves, and two moving mockups compete.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      '`role="img"` with the question and the answer as its name: a screen reader hears the exchange once, not the typing.',
      "Under `prefers-reduced-motion` the final state shows at once: no typing, no pulse, no caret.",
      "The composer is the kit's `MessageComposer` (pill), `inert` and `aria-hidden`: it is the same component as the app's chat, not a field here.",
    ],
  },
  related: ["icon", "sentinel-mini", "ui/card"],
  web: {
    imports: ["ChatShowcase"],
    examples: [
      {
        name: "sovereign-answer",
        title: "A sovereign answer",
        description: "Eric asks about a contract; the answer is computed on premises and the pipeline shows the steps.",
      },
      {
        name: "french",
        title: "In the reader's language",
        description: "The same mockup with the words of another locale — every word is a prop.",
      },
    ],
  },
} satisfies ComponentMeta;
