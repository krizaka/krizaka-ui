import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Status page",
  summary: "Where things stand: the overall state in words and colour, each service on its line, the incidents — or, for what is not built yet, its progress and how to hear about it.",
  status: "deprecated",
  deprecated: {
    since: "3.55.0",
    removedIn: "4.0.0",
    reason: "No page uses this template and no filed need names it (ADR-006 audit, 2026-10-25): there is no replacement.",
  },
  category: "templates",
  domain: "page-blocks",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A whole page of a public site; a phone app's screens are built from Screen, Header and the native primitives." }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  whenToUse: ["A service status page.", "An « under construction » page that says honestly what is coming."],
  whenNotToUse: [
    { when: "For what changed over time.", use: "changelog-page" },
    { when: "For a page that does not exist.", use: "error-page" },
  ],
  bestPractices: ["Always say the state in words; the colour only repeats it.", "Under construction: show progress and a way to follow, never a fake screen.", "Words and content arrive as props; the motion is the platform's (`[data-reveal]`, still under reduced motion)."],
  accessibility: {
    keyboard: [],
    notes: ["The overall state is a `status` region.", "Each service says its state in words beside its dot."],
  },
  related: ["changelog-page", "progress", "error-page"],
  web: {
    imports: ["StatusPage"],
    examples: [
      { name: "operational", title: "Status", description: "Three services, one slower than usual.", template: true, purpose: "recover", why: "A person checks in one look whether the service works and which part is slow." },
      { name: "building", title: "Under construction", description: "Akinaza on its way: progress and how to hear about it.", template: true, purpose: "recover", why: "A visitor learns honestly what is coming, how far it is and how to hear about it." },
      { name: "maintenance", title: "Planned maintenance", description: "What is paused until when, and what still works.", template: true, purpose: "recover", why: "A person learns what is down, until when, and what they can still do." },
    ],
  },
} satisfies ComponentMeta;
