import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Shop page",
  summary: "A shop's public page as a document, not as code: an ordered list of sections, each a type and a variant with its settings and blocks, drawn inside one frame and one rhythm. `shopPageSchema` validates the document, `defineSection` defines a type, and one section component per type (`@krizaka/ui/shop/hero`, `services`, `booking`, `gallery`) draws the variants. The services come first as a compact price board.",
  status: "beta",
  category: "blocks",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A shop's public page is a web page; the studio that edits it is the product's.", use: "profile-card" }, desktop: "web" },
  whenToUse: [
    "The public page of a service business — a salon, a dog walker, a coach, a workshop — where the owner chooses which sections appear, in what order and how each one is drawn.",
    "Any product page made of a few repeatable sections that a person arranges, within a catalogue and a bounded number of blocks.",
  ],
  whenNotToUse: [
    { when: "A page of the product itself or of a Krizaka site.", use: "landing-page" },
    { when: "A single list of services with no choice of drawing.", use: "service-card" },
  ],
  bestPractices: [
    "Store the document, not the HTML: the product keeps `schema`, `preset` and `sections` and parses them on write and on read (`parseShopPage`); an older schema goes through `migrateShopPage` first.",
    "References, not copies: a services section holds a rule (`source`, `groupBy`), never a price; the product resolves the services, photos and times at render, so a changed price changes everywhere.",
    "Resolve each photo once per page and give a service its own photo or none: the menu draws a thumbnail only for a service that has one, and the trade's defaults go to the hero and the gallery.",
    "Give every image its `alt` and let the section choose the `sizes`; the first image is the page's LCP and every box has a fixed ratio.",
    "A section with nothing to show is not drawn: skip it in the renderer.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Moves through the page in the visual order: the hero's action, the times, each service's « Choose » button, the photos' strip." },
      { keys: "← →", action: "Scrolls a focused filmstrip or carousel (they are focusable groups)." },
    ],
    notes: [
      "The hero's name is the page's only `h1`; every section is a `section` named by its `h2`.",
      "The services are a real list (`ul`/`li`), grouped by category, the price is text, and each button names its service (« Choose Short cut »).",
      "Third-party media sit behind a facade: nothing is requested before a click. Reduced motion stills the loops, the neon and the wall.",
    ],
  },
  related: ["cover-hero", "service-card", "slot-picker", "opening-hours", "media-gallery", "wall", "retro-tv", "sticky-action", "cta-panel"],
  web: {
    imports: ["shopPageSchema", "parseShopPage", "migrateShopPage", "defineSection", "ShopFrame", "ShopSection", "shopStarters"],
    examples: [
      { name: "menu", title: "Services · menu", description: "The compact price board, the default of every preset: a thumbnail only for a service's own photo, a dotted leader, tabular prices, a button that names its service — beside the hours." },
      { name: "menu-columns", title: "Services · menu in two columns", description: "With nothing beside it, the menu takes two columns from a laptop." },
      { name: "cards", title: "Services · cards", description: "Cards with a 4:3 photo, six at most." },
      { name: "index", title: "Services · index cards", description: "The Cahier's stamped cards, for a shop that wears the notebook." },
      { name: "carousel", title: "Services · carousel", description: "A snap strip, phone first." },
      { name: "hero-poster", title: "Hero · poster", description: "The cover with the name over it, art-directed 16:9 on a laptop and 4:5 on a phone." },
      { name: "hero-split", title: "Hero · split", description: "The title in the frame beside a 4:5 photo." },
      { name: "hero-banner", title: "Hero · banner", description: "A 21:9 photo and the name under it." },
      { name: "hero-tv", title: "Hero · tv", description: "The shop's sign and its latest video in the old television." },
      { name: "booking-strip", title: "Booking · strip", description: "The next free times, one tap each." },
      { name: "booking-panel", title: "Booking · panel", description: "The closing call." },
      { name: "booking-sticky", title: "Booking · sticky", description: "The phone bar, held at the bottom edge and never over content." },
      { name: "gallery-mosaic", title: "Gallery · mosaic", description: "One 4:5 lead and four squares." },
      { name: "gallery-filmstrip", title: "Gallery · filmstrip", description: "A snap strip of 3:4 photos." },
      { name: "gallery-wall", title: "Gallery · wall", description: "Polaroids, a note and the shop's sign on a textured wall." },
      { name: "gallery-grid", title: "Gallery · grid", description: "The shop's photos in tiles, the first featured." },
      { name: "page", title: "A compact salon page", description: "The hero, the next free times, the menu beside the hours, a filmstrip and the closing call, inside one frame and one rhythm." },
      { name: "document", title: "The document", description: "What the product stores: `parseShopPage` validates a document and answers every issue with its path." },
    ],
  },
} satisfies ComponentMeta;
