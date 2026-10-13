import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Number ticker",
  summary:
    "A figure that climbs into view once, or rolls digit by digit to each new value — server-rendered at its final value, its width held from the first paint, read once by assistive technology.",
  status: "beta",
  category: "data-display",
  platforms: "both",
  whenToUse: [
    "The key figures of a page (90 %, 12,480 creators): they climb once as they come into view.",
    "A live total that changes while it is watched — an auction's highest bid, a tip jar, a credit balance (`trigger=\"change\"`).",
  ],
  whenNotToUse: [
    { when: "For a figure with its trend and comparison in a dashboard tile.", use: "stat" },
    { when: "For time left until a moment.", use: "countdown" },
    { when: "Inside running text, or for every number of a table: motion there gets in the way of reading." },
  ],
  bestPractices: [
    "Format with the app's `locale` and Intl options (`format`): currency, unit, fraction digits — never by hand.",
    "A few figures per page climb; the rest stay still.",
    "For a live total, `announce` only when the change matters to the reader (an outbid), not for every tick.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "The moving digits are hidden from assistive technology; a visually hidden copy carries the final value — read once, never “0, 312, 1,204…”.",
      "`announce` makes that copy a polite live region: each new value is heard.",
      "Under `prefers-reduced-motion` nothing climbs or rolls: the value is simply there.",
      "Server-rendered at the final value: no layout shift (an invisible copy holds the width), nothing missing without JavaScript.",
    ],
  },
  related: ["stat", "countdown", "progress"],
  web: {
    imports: ["NumberTicker"],
    examples: [
      { name: "stats", title: "Key figures", description: "Three figures that climb once into view — a percentage, a count, a decimal — formatted by Intl." },
      { name: "live-total", title: "A live total", description: "`trigger=\"change\"`: the highest bid rolls digit by digit, a rise flashes, the amount is announced." },
      { name: "gradient", title: "In gradient text", description: "The digits stay painted by the gradient while they climb." },
    ],
  },
  native: {
    imports: ["NumberTicker"],
    differences: ["`trigger` is `mount` or `change` (a screen has no viewport to enter).", "`variant` and `tone` pick the type scale and the text role (`Txt`)."],
    examples: [{ name: "balance", title: "A live balance", description: "Rolls on every tip received, and says the new value." }],
  },
} satisfies ComponentMeta;
