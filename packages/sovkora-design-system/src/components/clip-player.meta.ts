import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Clip player",
  summary:
    "A short clip that is plainly a clip: a muted loop that plays in view, a badge with its length, play/pause and sound buttons, and a click that opens it larger.",
  why: "A 5-second generated clip is shown as a loop, not as a video page: it must read as a video at a glance (badge), play by itself only while it is on screen, stay quiet, give the visitor the controls on hover and focus, and open large with the native controls. @krizaka/ui's player is built for long videos; this one is the product's way to show a result.",
  status: "beta",
  category: "data-display",
  platforms: "web",
  builtOn: ["ui/button", "ui/dialog"],
  whenToUse: [
    "A generated clip of a few seconds in a gallery, a result page or a card.",
    "Anywhere a loop must start and stop with the viewport and respect reduced motion.",
  ],
  whenNotToUse: [
    { when: "A long video, subtitles, chapters or streaming.", use: "ui/video-player" },
    { when: "A decorative background loop with no controls: a muted `<video>` is enough." },
  ],
  bestPractices: [
    "Give both files: `webm` is tried first, `mp4` is the fallback every browser reads.",
    "Give the poster: it is what reduced motion and the first paint show.",
    "Name the clip in a sentence (`title`): it is the video's accessible name and the dialog's title.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Reaches the frame (open larger), play/pause and sound." },
      { keys: "Enter / Space", action: "Activates the focused button." },
      { keys: "Escape", action: "Closes the large view." },
    ],
    notes: [
      "Nothing plays by itself under `prefers-reduced-motion`: the poster and a play button.",
      "The clip is muted and `playsInline`; the sound button is a toggle (`aria-pressed`).",
      "A pause by hand sticks: scrolling away and back does not restart it.",
    ],
  },
  related: ["video-result", "run-facts", "ui/video-player"],
  web: {
    imports: ["ClipPlayer"],
    examples: [
      {
        name: "tea-pour",
        title: "A loop in a card",
        description: "Eric's tea-pour shot: badge, controls on hover, opens larger on click.",
      },
    ],
  },
} satisfies ComponentMeta;
