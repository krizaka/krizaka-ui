import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Waveform",
  summary:
    "The bars of a sound, drawn on their own: decorative by default, in the brand's accent or a quiet tone, breathing gently while it plays and still under reduced motion.",
  status: "beta",
  category: "data-display",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: [
    "On a card or a banner, to show that a product speaks: a voice, a sound, a call.",
    "Beside a sound's title when the shape is the identity (a voice note, a podcast episode) and nothing is seekable.",
  ],
  whenNotToUse: [
    { when: "For a sound a person plays, seeks or speeds up.", use: "audio-player" },
    { when: "For a figure on its own, with its trend.", use: "stat" },
  ],
  bestPractices: [
    "Leave it decorative (no `label`) when the text beside it already says what it is; give it a `label` only when the shape carries information.",
    "Pass the peaks of the real sound when you have them; without peaks it is a flat line, which reads as a quiet placeholder.",
    "Move it only while the sound plays (`playing`): a still waveform is the calm default.",
  ],
  accessibility: {
    keyboard: [],
    notes: [
      "Decorative by default: `aria-hidden`, so a screen reader skips it. With a `label` it is an image named by that label.",
      "The motion is a gentle breathing of the bars, declared only under `prefers-reduced-motion: no-preference`; it pauses when the waveform leaves the screen.",
      "Colour comes from the tokens (the accent or the neutral border), never a fixed value: it reads in dark and light.",
    ],
  },
  related: ["audio-player", "progress", "meter"],
  web: {
    imports: ["Waveform"],
    examples: [
      { name: "card", title: "On a card", description: "A voice's waveform beside its name, moving while the sound plays." },
      { name: "sizes", title: "Sizes and tones", description: "Small, medium and large, in the accent and in a neutral tone." },
    ],
  },
  native: {
    imports: ["Waveform"],
    differences: [
      "Same API. The bars breathe on the native driver; under reduced motion or while the app is in the background they stay still.",
      "No intersection observer on the phone: a waveform scrolled out of view keeps moving until its screen unmounts it.",
    ],
    examples: [{ name: "card", title: "On a card", description: "A voice's waveform beside its name, moving while the sound plays." }],
  },
} satisfies ComponentMeta;
