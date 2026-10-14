import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Loader",
  summary:
    "A wait from start to end: nothing for the first instants, then the Krizaka glyph with its words, a percentage and an ETA, held long enough to read, ending on a check or a cross that is drawn and announced — and `LoadingRegion`, which hands a region over to a skeleton of its shape.",
  status: "beta",
  category: "feedback",
  platforms: "both",
  whenToUse: [
    "Any wait whose length you do not control (a fetch, a refresh): the delay keeps fast answers from flashing a spinner.",
    "A wait that ends in a result worth saying — “12 invoices loaded”, “Could not publish”.",
    "Over a region that stays readable while it refreshes (`variant=\"overlay\"`), or over the whole screen at start-up (`page`).",
    "`LoadingRegion` for a card, a list or a panel: a skeleton of its shape while it loads, words when it lasts.",
  ],
  whenNotToUse: [
    { when: "Inside the button that started the action: the button draws the same glyph.", use: "button" },
    { when: "For a long task with steps or a known size the user follows.", use: "progress" },
    { when: "A tiny wait glyph with nothing else.", use: "spinner" },
  ],
  bestPractices: [
    "Say what is loading (“Loading your invoices”), not “Loading…”; say how it ended with `successLabel` / `errorLabel`.",
    "Brand it in a product: `mark={<OrochiaLogo animated />}` (web) or `product=\"orochia\"` (native) — the mark replaces the glyph, never the words.",
    "Keep the defaults: 250 ms of delay, 600 ms at least once shown — the two numbers that stop flicker.",
    "Give an `eta` when you can estimate it (format durations with `@krizaka/intl`): a known wait feels shorter.",
    "With `LoadingRegion`, draw the skeleton the shape of the content: nothing moves when it arrives.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "`role=\"status\"` (polite) is present from the first render, so its words are announced when the wait shows and again when it ends.",
      "`LoadingRegion` sets `aria-busy` on the region while it waits; the skeleton is hidden from assistive technology and the wait is announced once.",
      "Under `prefers-reduced-motion` the glyph rests on a still frame and endings do not animate; the delay, the words and the announcements stay.",
    ],
  },
  related: ["spinner", "skeleton", "progress", "button"],
  web: {
    imports: ["Loader", "LoadingRegion", "useDelayedWait"],
    examples: [
      { name: "fetch-flow", title: "No flash, then a result", description: "A fast answer shows nothing; a slow one shows the wait, then “12 invoices loaded” with a check, then nothing." },
      { name: "region-handover", title: "Hand-over to a skeleton", description: "`LoadingRegion`: a skeleton of the card's shape, words when it lasts, the card fading in." },
      { name: "upload-eta", title: "Progress and ETA", description: "`value` and `eta`: the trace grows, the percentage and the time left read in tabular figures." },
      { name: "overlay", title: "Over a region", description: "`variant=\"overlay\"`: the report stays readable behind frosted glass while it refreshes." },
      { name: "endings", title: "Endings", description: "`status`: a success and a failure, drawn in their colour and said in words." },
      { name: "minimal", title: "Minimal", description: "A label, nothing else: the defaults do the rest." },
      { name: "branded", title: "The product's mark", description: "`mark`: Orochia's animated mark in place of the Krizaka glyph; the ending stays the check." },
    ],
  },
  native: {
    imports: ["Loader", "LoaderGlyph", "useDelayedWait"],
    differences: [
      "`product` (`orochia`, `orazaka`, `yazakia`, `yororis`, `krizaka`) draws the product's animated `ProductMark`; on the web it is the `mark` slot.",
      "Announced with the platform's announcement (and a polite live region) instead of `role=\"status\"`.",
      "No `LoadingRegion`: lists show their own skeleton rows (`List loading`).",
      "`overlay` and `page` cover their parent with the theme's surface at 90 %; no backdrop blur.",
    ],
    examples: [
      { name: "job-wait", title: "A job's wait", description: "Determinate, with the time left, ending on a check and its words." },
      { name: "block", title: "Block", description: "The centre of a region whose content is on its way." },
      { name: "branded", title: "The product's mark", description: "`product`: the animated mark of the app waits for you, still under reduced motion." },
    ],
  },
} satisfies ComponentMeta;
