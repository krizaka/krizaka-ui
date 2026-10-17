import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Step showcase",
  summary:
    "A product's guided tour in one device frame — a phone, a browser window or a macOS window (`DeviceFrame`): the steps listed beside it (number · title · one line, a bar filling under the current one), the frame playing the step's recording muted then moving on, the recordings crossfading. It plays only in view, holds on hover and focus, keeps a play / pause button and never shows native video controls; posters load first, the video once seen. On a phone: dots, swipe, the same auto-advance.",
  status: "beta",
  category: "blocks",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A product site's tour of the app; inside the phone app the real screens are the tour." }, desktop: "web" },
  whenToUse: [
    "A landing page's “see it work”: three to five steps of the real app recorded on the device it runs on.",
    "The same tour on several devices: one `StepShowcase` per tab (Web · Mobile · Mac).",
  ],
  whenNotToUse: [
    { when: "For a gallery of results that should move on its own.", use: "showcase" },
    { when: "For a single video with its controls.", use: "video-player" },
    { when: "For the steps of a form the person is filling.", use: "step-progress" },
  ],
  bestPractices: [
    "Record the real app (a demo persona, never a mock-up); 4–8 s per step, muted, no captions burnt in.",
    "Give every step a poster (the first frame) and an `alt`: it is what loads first and all that shows under reduced motion.",
    "A title of two or three words and one line per step; the order is the journey (sign in → make → ask → follow).",
    "WebM first, MP4 as the fallback; a step without a video stays `duration` ms.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "The current step, then play / pause." },
      { keys: "↑ ↓ ← →", action: "The previous or next step." },
      { keys: "Enter / Space", action: "On a step: show it. On play / pause: stops or restarts the tour." },
    ],
    notes: [
      "A region (`aria-roledescription=\"carousel\"`) named by `label`; the steps are a vertical `tablist`, the frame its `tabpanel` named by the current step.",
      "WCAG 2.2.2: a visible pause button; the tour also holds while the pointer is over it, while a focus is inside and while it is off screen.",
      "The video is decorative (`aria-hidden`): the poster's `alt` and the step's words carry the meaning. No native controls, never sound.",
      "Under `prefers-reduced-motion`: posters only, no autoplay, the steps change on demand.",
    ],
  },
  related: ["showcase", "video-player", "tabs", "landing-page"],
  web: {
    imports: ["StepShowcase", "DeviceFrame", "stepShowcaseLabels"],
    examples: [
      { name: "phone", title: "In your pocket", description: "Four steps of a phone app beside one phone; resize to a phone: dots, swipe." },
      { name: "desktop", title: "On your Mac", description: "A macOS window: the control panel, the local stack starting, the workspace." },
    ],
  },
} satisfies ComponentMeta;
