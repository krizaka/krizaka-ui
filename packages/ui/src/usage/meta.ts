import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Usage",
  summary: "The blocks of a « Credits & usage » page: the balance on a meter, the period switch (the address holds it), the figures on a strip with their trend in words, and the activity stacked by outcome.",
  status: "beta",
  category: "data-display",
  platforms: "web",
  parity: { native: { status: "gap", issue: "krizaka/krizaka-ui#728", reason: "The phone apps show their credits through Meter and Stat by hand; a native twin of the blocks follows the first app that moves onto them." }, desktop: "web" },
  whenToUse: [
    "A « Credits & usage » page or panel: what is left, how it was used over 7, 30 or 90 days, and what happened to each run.",
    "Any metered product (checks, runs, storage) that bills or limits by credits.",
  ],
  whenNotToUse: [
    { when: "A single quota against a plan, with no period.", use: "quota-meter" },
    { when: "A free-form dashboard of charts.", use: "dashboard-layout" },
    { when: "A single key figure.", use: "stat" },
  ],
  bestPractices: [
    "Read the period with `parsePeriod(searchParams.period)` and pass it to `PeriodSwitch` and to the query: the server renders the period, the address can be shared.",
    "`UsageTiles` computes the change against the previous period from `previous` and says it in words (« +12 % vs période précédente »); French and `fr-CA` figures are the default, `locale=\"en\"` switches both.",
    "Put a `Sparkline` of @krizaka/charts (64 × 18) in a tile's `chart`; the tiles stay on the strip, never four full-width stats.",
    "Pass `outcomes` in the order they should stack, bottom first; tones are the tokens' (`success`, `danger`…), never colours.",
    "Show `loading` while the data is on its way and give an `emptyLabel` that says what to do next.",
  ],
  accessibility: {
    keyboard: [{ keys: "Tab / Enter", action: "Moves through the periods; each is a link." }],
    notes: [
      "`CreditsMeter` is a `role=meter` named by its label, its value in words (« 820 sur 1 000 »); its tone is never the only signal.",
      "`PeriodSwitch` is a navigation of links; the shown period is `aria-current=\"page\"`.",
      "`UsageChart` is a figure with a caption; the bars are decorative and the text version is a table with every day and outcome.",
      "Loading is `aria-busy`; the skeleton does not animate under reduced motion.",
    ],
  },
  related: ["meter", "stat", "quota-meter", "dashboard-layout"],
  web: {
    imports: ["CreditsMeter", "PeriodSwitch", "UsageTiles", "UsageChart", "parsePeriod"],
    examples: [
      { name: "credits-page", title: "Credits & usage", description: "The balance, the period switch, the strip of figures and the activity by outcome (demo data)." },
      { name: "empty", title: "Loading and empty", description: "The skeletons while the data is on its way, then the empty state." },
    ],
  },
} satisfies ComponentMeta;
