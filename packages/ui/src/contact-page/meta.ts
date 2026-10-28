import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Contact page",
  summary: "Reaching the team: the public channels as cards beside the form, then what happens after sending.",
  status: "beta",
  category: "templates",
  domain: "page-blocks",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A whole page of a public site; a phone app's screens are built from Screen, Header and the native primitives." }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  whenToUse: ["Contact, support, a request for a demo.", "Any page whose action is a message."],
  whenNotToUse: [
    { when: "For a sign-in or a sign-up.", use: "auth-layout" },
    { when: "For a closing call at the end of a page.", use: "cta-panel" },
  ],
  bestPractices: ["Say who answers and how fast.", "The form in its own panel, its primary action cut.", "Words and content arrive as props; the motion is the platform's (`[data-reveal]`, still under reduced motion)."],
  accessibility: {
    keyboard: [],
    notes: ["The form is yours: label every field, say errors in words.", "What happens next is an ordered list."],
  },
  related: ["field", "link-card", "cta-panel"],
  web: {
    imports: ["ContactPage"],
    examples: [
      { name: "team", title: "Talk to the team", description: "Channels, the form and what happens next.", template: true, purpose: "act", why: "A visitor reaches a human by the channel they prefer and learns what happens after they write." },
    ],
  },
} satisfies ComponentMeta;
