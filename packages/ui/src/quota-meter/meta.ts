import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Quota meter",
  summary: "Space or time used against a plan: the figure in words, a meter that turns amber at 80 % and red at 95 %, the sentence that says what to do, the small figures and the way out.",
  status: "beta",
  category: "data-display",
  platforms: "web",
  parity: { native: { status: "gap", issue: "krizaka/krizaka-ui#275", reason: "The native twin is a `Card` with a `Meter`; it follows when a mobile screen shows a quota (Yomizaka's library)." }, desktop: "web" },
  whenToUse: ["A creator's or an owner's storage, minutes or credits against their plan.", "Any limit the person can run into and should hear about before."],
  whenNotToUse: [
    { when: "A bare measure with no plan, no message.", use: "meter" },
    { when: "The progress of one task.", use: "progress" },
  ],
  bestPractices: ["Say the figure in words (`3.2 GB of 10 GB`): the colour is never the only signal.", "Give the sentence for each level (`warning`, `critical`, `full`): the alarming ones are read as a status.", "Put the way out (`action`) in the card, not in a banner elsewhere.", "`max={null}` for an unlimited plan: the figure stays, the meter goes."],
  accessibility: { keyboard: [], notes: ["The card is a region named by its title.", "The meter has its own accessible name and value text; an alarming sentence is `role=status`."] },
  related: ["meter", "progress", "stat"],
  web: {
    imports: ["QuotaMeter"],
    examples: [
      { name: "default", title: "Storage at 86 %", description: "Used in words, an amber meter, the sentence, minutes and today's uploads, the way to manage.", template: true, purpose: "operate", why: "A person sees how much room is left and what to do before they run out." },
      { name: "full", title: "Full and paused", description: "A red meter, the sentence, uploads on hold and the platform paused.", },
    ],
  },
} satisfies ComponentMeta;
