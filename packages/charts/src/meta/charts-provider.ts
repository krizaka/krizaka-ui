import type { ComponentMeta } from "./types";

export const meta = {
  title: "Charts provider",
  summary: "The locale, the brand palette and the words of every chart below it, set once; plus the sliding window for live data.",
  status: "beta",
  tier: "core",
  category: "charts",
  platforms: "both",
  whenToUse: [
    "Once near the root of an app: its locale (`fr-FR`), its brand (`orazaka`), its translated words.",
    "An app that loads a brand stylesheet on `:root` rather than a `.brand-<id>` class: set `brand` here.",
  ],
  whenNotToUse: [{ when: "To change one chart only: every chart takes `locale`, `brand` and `labels` itself.", use: "line-chart" }],
  bestPractices: [
    "Translate `labels` from the app's catalogue; the summary templates take `{placeholders}`.",
    "In React Native, pass `scheme` and `theme` from @krizaka/ui/native's `useTheme()` so the charts follow the app's theme and brand.",
  ],
  accessibility: { keyboard: [], notes: ["The words it sets are what screen readers hear: the summary, the role description, the keyboard hint."] },
  related: ["line-chart", "chart", "bar-chart"],
  web: {
    entry: "provider",
    imports: ["ChartsProvider", "useSlidingWindow"],
    examples: [{ name: "french-orazaka", title: "French, Orazaka", description: "Figures and dates in French, the Orazaka palette, the words translated." }],
  },
  native: {
    imports: ["ChartsProvider"],
    differences: ["Also takes `scheme` and `theme` (the app's roles); no `useSlidingWindow` export on native."],
    examples: [{ name: "french-orazaka", title: "French, Orazaka", description: "French figures, the Orazaka palette." }],
  },
} satisfies ComponentMeta;
