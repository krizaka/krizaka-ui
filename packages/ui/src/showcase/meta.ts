import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Showcase",
  summary:
    "A slideshow that advances by itself and shows it: a segmented progress bar — the current segment fills over the interval, each one a button — with a counter, previous / next and a visible pause button. It waits for the pointer, the keyboard focus, a hidden tab and a scroll away, and never advances under reduced motion.",
  status: "beta",
  category: "data-display",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: [
    "A gallery of results that should move on its own — prompt and image, before and after, three steps of a product — where each slide is a small composition (a picture, words, an action).",
    "A landing page's proof: the reader sees it moving, can stop it and can jump to any slide.",
  ],
  whenNotToUse: [
    { when: "For content the reader must compare or read in order: lay the items out." },
    { when: "For a band of logos or short quotes that slides continuously.", use: "marquee" },
    { when: "For cards to swipe away and decide on.", use: "swipe-deck" },
  ],
  bestPractices: [
    "Give every slide the same size (an aspect ratio): only the slide in view and its neighbours are mounted, and the height must not jump.",
    "Pass `labels` translated — the controls, the counter (“Image 1 of 17”) and each slide's “n of N”; `getTitle` names the slide in the counter.",
    "5–8 seconds per slide for a picture and a sentence; the bar shows the time, so the reader can decide to stay.",
    "Type a text with `useTypedText` only when it is short, and keep the full text for assistive technology (`sr-only`).",
    "The bar's fill is a CSS animation and its end moves the show: its rules ship with the component, nothing to import.",
  ],
  accessibility: {
    keyboard: [
      { keys: "← / →", action: "Previous or next slide (the show then reads the new slide aloud)." },
      { keys: "Home / End", action: "First or last slide." },
      { keys: "Tab", action: "The current segment, previous, pause / play, next, then the content of the slide in view." },
      { keys: "Enter / Space", action: "On a segment: that slide. On the pause button: stops or restarts the show." },
    ],
    notes: [
      "A region with `aria-roledescription=\"carousel\"` named by `label`; each slide is a `group` (`aria-roledescription=\"slide\"`) named “n of N”; the slides out of view are hidden and inert.",
      "WCAG 2.2.2: a visible pause button; the show also stops while the pointer is over it, while a keyboard focus is inside, while the tab is hidden and while it is off screen.",
      "The live region is `polite` only after the visitor navigates — the automatic changes are never announced.",
      "Under `prefers-reduced-motion` the show never advances by itself: no pause button, the current segment is drawn full, the navigation is manual.",
      "On a phone: swipe the pages; Reduce Motion turns the autoplay off; the app in the background holds it.",
    ],
  },
  related: ["marquee", "swipe-deck", "step-progress", "tabs"],
  web: {
    imports: ["Showcase", "useTypedText", "showcaseLabels"],
    examples: [
      { name: "prompt-image", title: "Prompt → image", description: "An image on the left, its prompt typed on the right with the action: moves on every 6 s, the bar shows how long is left." },
      { name: "slides", title: "Any content", description: "Text slides, 4 s each, the slide transition, no loop: the last slide stays." },
    ],
  },
  native: {
    imports: ["Showcase", "showcaseLabels"],
    differences: [
      "Swipeable pages (a paging `FlatList`) instead of a crossfade; the bar, the counter and the buttons are the same.",
      "No hover or keyboard: the autoplay holds while the finger drags, while the app is in the background and with Reduce Motion on.",
    ],
    examples: [{ name: "slides", title: "Any content", description: "Swipe or wait: the bar fills over 5 s and moves on." }],
  },
} satisfies ComponentMeta;
