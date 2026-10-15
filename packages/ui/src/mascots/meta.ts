import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Mascots",
  summary: "The Krizaka flock: nine figures (falcon, owl, duck, flamingo, pigeon, lovebird, crane, magpie — and the beaver) in five moods, drawn in the product's brand colours — and the phoenix, the comeback.",
  status: "beta",
  category: "feedback",
  platforms: "both",
  whenToUse: [
    "To welcome a person on a first screen or an onboarding step (`welcome`).",
    "While a long task runs and the person waits for it (`thinking`), beside its progress.",
    "When a long task has just finished well (`success`): a generation, an import, a verification.",
    "In an empty state the person reaches for the first time (`empty`), above its title.",
    "On a full-page or panel error, beside what went wrong and what to do (`error`).",
  ],
  whenNotToUse: [
    { when: "In the middle of working content (a list row, a toolbar, a form): a mascot is for a moment, not decoration.", use: "badge" },
    { when: "For a short wait of a second or two.", use: "spinner" },
    { when: "To announce a result that needs no celebration.", use: "toast" },
  ],
  bestPractices: [
    "One mascot per screen, and only at a moment that matters: a welcome, a wait, a success, an empty list, an error.",
    "Keep the bird's role: the owl reads (documents), the falcon watches (security), the duck builds (code), the flamingo answers (support), the pigeon delivers (notifications, packages), the lovebird introduces (matches, two people who meet), the crane listens (a quiet moment, someone who takes their time), the magpie keeps the score (points, standings, trophies), the beaver builds the shop (a small business at work: bookings, invoices, the till).",
    "The phoenix (`Phoenix`) does no job: keep it for a comeback — a relaunch, a recovered account, a second chance — never as one more helper.",
    "Leave `tone=\"brand\"` in a product: the bird wears the product's accent; `own` is for the Krizaka story.",
    "The words stay beside it (a title, a line, an action): the mascot never carries the message alone.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "Decorative by default (`aria-hidden`): the text next to it carries the meaning. With `title` it becomes an image with that name.",
      "Every gesture (idle bob, blink, wave, dots, hop) stops under `prefers-reduced-motion`, and with `animated={false}`.",
      "The success and error badges are not the only signal: say it in words beside the bird.",
    ],
  },
  related: ["empty-state", "progress", "alert", "spinner"],
  web: {
    imports: ["Mascot", "MASCOT_BIRDS", "MASCOT_MOODS", "Phoenix"],
    examples: [
      { name: "moods", title: "Moods", description: "One bird in its five moods: welcome, thinking, success, empty, error." },
      { name: "flock", title: "The flock", description: "The nine figures in the brand colours of the host." },
      { name: "own-tone", title: "Signature colours", description: "`tone=\"own\"`: each bird in its colours of the Krizaka story." },
      { name: "empty-state", title: "In an empty state", description: "The owl above an empty list, the words and the action beside it." },
      { name: "long-task", title: "During a long task", description: "The pigeon thinking beside the progress of a job." },
      { name: "lovebird", title: "An introduction", description: "The lovebird celebrates a mutual interest: two people who chose each other meet." },
      { name: "phoenix", title: "The phoenix", description: "The sixth figure: a comeback — a relaunch, a recovered account — in its own colours or the brand's." },
      { name: "crane", title: "Listening", description: "The crane stands still and listens: a calm opening, the words and one action beside it." },
      { name: "magpie", title: "Keeping the score", description: "The magpie celebrates a win: the points counted, the standings moved, the words beside it." },
      { name: "beaver", title: "At the shop", description: "The beaver at work: the day's bookings, the words and one action beside it." },
    ],
  },
  native: {
    imports: ["Mascot", "Phoenix"],
    differences: ["Only the idle bob and the badges: the wave, the dots and the hop are web gestures.", "Style with `style`, not `className`."],
    examples: [
      { name: "default", title: "Default", description: "The owl welcoming, the falcon done, the duck with nothing yet." },
      { name: "lovebird", title: "The lovebird", description: "The lovebird welcoming, then celebrating a mutual interest." },
      { name: "phoenix", title: "The phoenix", description: "The comeback, in its own colours and in the app's accent." },
      { name: "crane", title: "The crane", description: "The crane welcoming, then listening — posed, unhurried." },
    ],
  },
} satisfies ComponentMeta;
