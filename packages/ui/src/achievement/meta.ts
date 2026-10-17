import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Achievement",
  summary:
    "Something done, and what it replaced: a milestone reached, a dare completed, a problem out of the way — on one grid of hairlines in a list, their badges arriving one by one; with three line emblems.",
  status: "beta",
  category: "data-display",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "Part of the storytelling kit of scroll-driven site pages; a phone app tells its first steps with Onboarding.", use: "mascot-state" }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  whenToUse: [
    "Milestones of a creator or a member: what is done, what is next (`locked`).",
    "What a product removed for its users (“Paying 30 % to a platform” → “90 % to you”).",
    "Problems sealed one by one on a told page, in time with a `GoalGauge` (the arcade flavour).",
  ],
  whenNotToUse: [
    { when: "A notification that something just happened.", use: "toast" },
    { when: "A status of an object (published, pending).", use: "badge" },
    { when: "An argument with its reasons and a link.", use: "argument-card" },
  ],
  bestPractices: [
    "The title is the outcome in a few words; `replaced` what it removed — struck through, so the change reads at a glance.",
    "Say a locked step in its badge (“Locked”), not only by the muted colour.",
    "Use `Emblem` (`sword`, `mirror`, `jewel`) as the glyphs of a set, or your own icons from @krizaka/icons.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "`AchievementList` is an ordered list; `replaced` is a `del` element, read as removed text.",
      "Emblems and icons are decorative. The badges arrive once in a stage and never under `prefers-reduced-motion`.",
    ],
  },
  related: ["goal-gauge", "badge", "argument-card", "scroll-stage"],
  web: {
    imports: ["Achievement", "AchievementList", "Emblem"],
    examples: [
      { name: "milestones", title: "Milestones", description: "Two milestones done, with what they replaced; the next one locked." },
      { name: "arcade", title: "Arcade flavour", description: "Heads sealed one by one, each stamp slamming in, with the three emblems." },
    ],
  },
} satisfies ComponentMeta;
