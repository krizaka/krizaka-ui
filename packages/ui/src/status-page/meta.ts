import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Status page",
  summary: "Where things stand: the overall state in words and colour, each service on its line, the incidents — or, for what is not built yet, its progress and how to hear about it.",
  status: "beta",
  category: "templates",
  platforms: "web",
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
      { name: "operational", title: "Status", description: "Three services, one slower than usual.", template: true },
      { name: "building", title: "Under construction", description: "Yazakia on its way: progress and how to hear about it.", template: true },
    ],
  },
} satisfies ComponentMeta;
