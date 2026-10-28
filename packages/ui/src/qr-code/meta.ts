import type { ComponentMeta } from "../meta";

export const meta = {
  title: "QR code",
  summary:
    "A QR code drawn offline from a text: dark modules on a light tile in both themes, with its quiet zone, an accessible name and an optional « copy the link » action.",
  status: "beta",
  category: "data-display",
  domain: "data-display",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: [
    "To hand a short text to a phone: a private calendar feed, an address to open, a pairing link.",
    "Next to the same text as a link, so the person can scan it or copy it (`copyLabel`).",
  ],
  whenNotToUse: [
    { when: "For a code to type, such as a one-time passcode.", use: "otp-input" },
  ],
  bestPractices: [
    "Name it (`label`) with what scanning does: « Calendar feed: scan to subscribe ». The image is read by that name.",
    "Keep the text short: a longer text makes a denser code that needs a bigger tile (size 176 px or more).",
    "Leave the colours alone: a scanner needs dark modules on a light tile, so the tile stays light in the dark theme.",
    "Pass `copyLabel` whenever the text is a link, for the person who reads this on the phone that would scan it.",
  ],
  accessibility: {
    keyboard: [{ keys: "Tab, Enter", action: "Reaches and activates the copy button, when there is one." }],
    notes: [
      "The code is an image named by `label`; the copy button says « copied » politely once the text is on the clipboard.",
      "The tile keeps a 1 px border so its edge is visible on a light page; the quiet zone is at least 2 modules (4 by default).",
      "The encoding happens in the browser (or on the server render): the text is never sent to a service.",
    ],
  },
  related: ["code-block", "otp-input"],
  web: {
    imports: ["QrCode"],
    examples: [
      { name: "basic", title: "From a text", description: "An address as a code, dark modules on a light tile." },
      { name: "calendar-feed", title: "A calendar feed", description: "A private feed address: scan it from the phone or copy the link." },
    ],
  },
  native: {
    imports: ["QrCode"],
    differences: [
      "Same API. Drawn with react-native-svg; `onCopy` receives the text and the app puts it on the clipboard (the library has no clipboard dependency).",
    ],
    examples: [{ name: "calendar-feed", title: "A calendar feed", description: "A private feed address: scan it or copy the link." }],
  },
} satisfies ComponentMeta;
