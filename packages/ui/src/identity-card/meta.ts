import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Identity card",
  summary: "The identity of a business or a person at the top of a sheet: a mark, the name and what it is called, chips for its status and registration number, and a QR code that hands the contact to a phone.",
  status: "beta",
  category: "data-display",
  domain: "identity",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A phone shows its own identity in the profile screen; the QR code is meant to be scanned from another screen." }, desktop: "web" },
  whenToUse: [
    "At the top of a business sheet or a profile page, above the facts a person copies (tax numbers, address, links).",
    "When a phone should be able to add the contact: pass `qr` with a `vCard(…)` text.",
  ],
  whenNotToUse: [
    { when: "For a person at a glance with gauges and stats.", use: "profile-card" },
    { when: "For the head of a collection or a shop in a switcher.", use: "entity-header" },
  ],
  bestPractices: [
    "Put the legal name in `name` (the heading) and the day-to-day name in `subtitle`; the registration number goes in a mono chip.",
    "Pass the text of the QR code translated, and `copyLabel` so a person on the computer can paste the vCard.",
    "Put only public facts in the vCard: it is drawn in the page and copied to the clipboard.",
  ],
  accessibility: {
    keyboard: [{ keys: "Tab, Enter", action: "Reaches and activates the QR code's copy button, when there is one." }],
    notes: ["`name` is the heading (h2 by default; h1 when the card is the page's title). The mark is decorative and hidden from assistive technology.", "The QR code is an image named by `qr.label`."],
  },
  related: ["qr-code", "description-list", "copy-button", "status-chip"],
  web: {
    imports: ["IdentityCard"],
    examples: [{ name: "basic", title: "A business", description: "Mark, names, status and registration number, and the contact as a QR code." }],
  },
} satisfies ComponentMeta;
