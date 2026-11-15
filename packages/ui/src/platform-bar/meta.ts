import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Platform bar",
  summary:
    "The strip of a platform above a page it hosts for its customer: its mark on the left, the language switch on the right and, when the page is not the real thing, one line that says so — the development band and the demo line merged. Static, server-rendered, no client code.",
  status: "experimental",
  adoption: "krizaka-internal#3746",
  category: "navigation",
  domain: "navigation-shell",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A public page's strip; an app has none." }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  whenToUse: [
    "Above any public page a Krizaka product hosts for a customer: a shop on Folioviv, a shared Verikora report, a public Sovkora status.",
    "To say, in one line, that the page is a demonstration or a development version (`notice`).",
  ],
  whenNotToUse: [
    { when: "A development-version band above an app's own bar.", use: "environment-notice" },
    { when: "The navigation of a Krizaka site or a product's own pages.", use: "nav-bar" },
  ],
  bestPractices: [
    "Never sticky: it scrolls away with the page and cannot cover the customer's header.",
    "No Explorer, pricing, docs or « sign in » link: the visitor is on the customer's page, not on the platform's.",
    "`end` takes `LanguageSwitch` (a client island); the bar itself ships no JavaScript.",
    "One short sentence in `notice`, passed translated; omit `notice` on a live page.",
  ],
  accessibility: {
    keyboard: [],
    notes: ["A labelled region (`label`); the dot is decorative, the notice is text.", "The notice wraps under the mark on a phone, never truncated."],
  },
  related: ["site-footer", "environment-notice", "language-switch"],
  web: {
    imports: ["PlatformBar"],
    examples: [
      { name: "demo", title: "A demonstration shop", description: "The mark, one line that says the data is fictitious, and the language switch, in French." },
      { name: "live", title: "A live page", description: "No notice: the mark and the language only." },
    ],
  },
} satisfies ComponentMeta;
