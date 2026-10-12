import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Mascot state",
  summary:
    "A moment told by a bird of the flock: nothing yet, a long wait, done, it failed, welcome — the bird of the job beside the words and the next action.",
  status: "beta",
  category: "feedback",
  platforms: "both",
  whenToUse: [
    "An empty list or search the person reaches for the first time (`mood=\"empty\"`, `framed`).",
    "A page or a panel that failed: a 404, a lost connection, a refused payment (`ErrorState`).",
    "The end of something that matters: a payment received, an identity verified, a message sent (`SuccessState`).",
    "A task of several seconds or more, with what runs in words (`LoadingState`).",
    "The first screen of an onboarding (`WelcomeState`).",
  ],
  whenNotToUse: [
    { when: "A short wait of a second or two, or a list that is loading.", use: "skeleton" },
    { when: "An error inside a form or a card, next to what it concerns.", use: "alert" },
    { when: "A result that needs no moment: a saved setting, a copied link.", use: "toast" },
    { when: "A plain empty list in a dense screen (a table, a sidebar).", use: "empty-state" },
  ],
  bestPractices: [
    "Choose the bird by the job, not by the mood: the owl reads (documents, search), the falcon watches (security, verification), the duck builds (code, uploads), the flamingo answers and gets paid (support, payments), the pigeon delivers (messages, notifications), the lovebird introduces (matches, introductions).",
    "One bird per screen: a moment, never decoration in working content.",
    "The title says what happened in a few words, the description what comes next; one action — the way out.",
    "`titleAs=\"h1\"` when the state is the whole page (a 404), so the page keeps a heading.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "`role=\"alert\"` for an error, `role=\"status\"` otherwise: announced when it appears; `aria-busy` while thinking.",
      "The bird is decorative: the title and the description carry the meaning.",
      "The staged arrival (bird, words, action) and the bird's gesture stop under `prefers-reduced-motion` and with `animated={false}`.",
    ],
  },
  related: ["mascots", "empty-state", "alert", "progress"],
  web: {
    imports: ["MascotState", "ErrorState", "SuccessState", "LoadingState", "WelcomeState"],
    examples: [
      { name: "empty", title: "Nothing yet", description: "A framed empty list: the pigeon has no message to deliver yet." },
      { name: "error", title: "It failed", description: "A page that does not exist: the owl did not find it, with the way back." },
      { name: "success", title: "Done", description: "A payment received: the flamingo answers, the next step beside it." },
      { name: "loading", title: "A long task", description: "The duck builds while the job runs, in a card (`layout=\"inline\"`)." },
      { name: "welcome", title: "Welcome", description: "An onboarding's first screen: the falcon keeps the account safe." },
    ],
  },
  native: {
    imports: ["MascotState", "ErrorState", "SuccessState", "LoadingState", "WelcomeState"],
    differences: ["`title` and `description` are strings; the action is a native `Button`.", "No `framed` and no `titleAs`: style with `style`.", "Only the idle bob and a fade-in: the web gestures (wave, dots, hop) stay on the web."],
    examples: [{ name: "default", title: "Default", description: "A payment received (flamingo) and a verification that failed (falcon)." }],
  },
} satisfies ComponentMeta;
