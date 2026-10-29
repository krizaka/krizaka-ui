import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Engine flow",
  summary:
    "An engine at the hub and the apps it serves around it, with what travels between them: photons going in (requests) and coming back (results) along each conduit — radial on a wide screen, top to bottom on a phone, planned apps dim and still.",
  status: "beta",
  category: "data-display",
  domain: "conversation",
  platforms: "web",
  parity: {
    native: { status: "n/a", reason: "A diagram of a public site's page; an app screen lists the same facts." , use: "list" },
    desktop: "web",
  },
  whenToUse: [
    "Showing one platform and the products built on it, in one glance: « one engine, the products it powers ».",
    "Saying which way data goes per app — in, back, or both — only where it really runs; what is planned is drawn planned.",
  ],
  whenNotToUse: [
    { when: "A sequence of steps a reader follows in order.", use: "stepper" },
    { when: "Entry points to pages, where the cards are the content.", use: "card-grid" },
    { when: "A chart of figures over time." },
  ],
  bestPractices: [
    "Give each node its brand scope (`className=\"brand-<id>\"`) and the figure the hub's: photons going in wear the app's colour, those coming back the engine's.",
    "Draw only what runs: `flow=\"both\"` where results really come back, `planned` (with a `status` word) where nothing is wired yet.",
    "Keep a text version (a list) in the page; give each node a one-line `description` and its `href`.",
    "Tune the stream, not the story: `density` (sparse · normal · dense), `speed`, `easing`, `stagger`, and `trigger` (`always`, `hover`, `active`) change how the photons travel, never what the figure claims; `breathe={false}` keeps the engine still.",
    "In a small frame (a tile of a home page) use `calm`: sparse photons at a low rate and a slow breath, no hint and no detail line, nothing to tune; wrap the figure in an `inert` box if it should not take focus.",
    "Five to eight nodes: radial reads at a glance; on a phone the default `compactLayout` puts them in a row above the hub.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Goes through the nodes, then the link of the detail line." },
      { keys: "Enter / Space", action: "Chooses the node: the detail line says its description and its link." },
    ],
    notes: [
      "The drawing (conduits, photons) is hidden from assistive technology; each node is a button named by its label, `aria-pressed` when chosen.",
      "The detail line is a polite live region: pointing at or focusing a node announces its line.",
      "Motion is CSS (motion.css): paused off screen (MotionObserver), held while the page settles, a still frame under reduced motion. No animation frame, no canvas.",
      "`calm` plays only on screen and once the page has settled, and rests under reduced motion and Save-Data.",
      "The stage keeps its aspect ratio and the detail line its height: no layout shift.",
    ],
  },
  related: ["card-grid", "glow-card", "iso", "number-ticker"],
  web: {
    imports: ["EngineFlow"],
    examples: [
      { name: "radial", title: "One engine, the products it powers", description: "Radial on a wide screen: both ways where results come back, planned products dim and still." },
      { name: "compact", title: "On a phone", description: "Top to bottom: the products in a row above, flowing down into the engine; the detail line names the chosen one." },
      { name: "calm", title: "Calm, for a small frame", description: "Sparse photons at a low rate and a slow breath, no hint and no detail line; still under reduced motion and Save-Data." },
    ],
  },
} satisfies ComponentMeta;
