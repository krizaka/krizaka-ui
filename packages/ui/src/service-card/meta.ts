import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Service card",
  summary: "A service a shop sells, as a card that argues: icon or photo, name, duration, capacity, price (« from » when it varies), what is included, a « Popular » tag — and one way in, the whole card pressable.",
  status: "beta",
  category: "data-display",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A shop's public storefront is a web page; the apps book through their own lists.", use: "list" }, desktop: "web" },
  whenToUse: [
    "A shop's page: the services it sells, each with its price and a way to book it.",
    "Any priced offer with a duration and a few inclusions (a class, a treatment, a package).",
  ],
  whenNotToUse: [
    { when: "Plans compared side by side with a feature table.", use: "pricing-page" },
    { when: "A card that only leads somewhere (no price).", use: "link-card" },
    { when: "An argument with a bird and a long version.", use: "argument-card" },
    { when: "A menu: every service of a shop, one compact row each, with its price and a button.", use: "shop" },
  ],
  bestPractices: [
    "`variant=\"index\"` is the Cahier's card for a shop page: same props, same accessible output. Its button is the way in, not the whole card, so the name stays selectable; keep it straight (a card you pick is never askew).",
    "Pass the price already formatted (the shop's currency and the reader's locale): the card never formats money.",
    "Use `priceFrom` only when the price truly varies; keep `included` to three short lines.",
    "Show `tag` (« Popular ») only from real data, such as the most booked service — never as decoration.",
    "Give the way in a verb (« Book », « Choose ») and, from a Server Component, an `href` to the booking page with the service in the address.",
    "Put the cards in a `CardGrid` so a row shares one height.",
  ],
  accessibility: {
    keyboard: [{ keys: "Tab, Enter", action: "Focuses and presses the card's one way in (a link or a button)." }],
    notes: [
      "An `article` named by its heading; the way in is the only tab stop and stretches over the card, so the whole card takes the press.",
      "The link or button is described by the service's name, so « Book » is read with the service it books.",
      "With `onSelect` the button carries `aria-pressed` (the chosen service).",
    ],
  },
  related: ["card-grid", "slot-picker", "opening-hours", "link-card", "argument-card"],
  web: {
    imports: ["ServiceCard"],
    examples: [
      { name: "index-card", title: "Stamped index cards", description: "`variant=\"index\"`: ruled, straight, a punched hole, the duration and the price as stamps, a secondary button." },
      { name: "index-list", title: "Index cards in one column", description: "`density=\"list\"`: the same card as a row. Deprecated since 3.64 (removed in 4.0.0): a menu of services is `ServicesSection variant=\"menu\"` of `@krizaka/ui/shop/services`, the compact price board." },
      { name: "services", title: "Services", description: "A solo walk marked Popular and a group walk priced « from »: duration, capacity, inclusions, one way in each." },
    ],
  },
} satisfies ComponentMeta;
