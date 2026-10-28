import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Video trimmer",
  summary: "The trim timeline of a video editor: two edge handles over a filmstrip frame the part kept, the outside dimmed, a playhead to scrub — every part stylable, the keyboard included.",
  status: "deprecated",
  deprecated: {
    since: "3.55.0",
    removedIn: "4.0.0",
    reason: "No product or site imports it and no filed need names it (ADR-006 audit, 2026-10-25): there is no replacement.",
  },
  category: "media",
  domain: "media",
  platforms: "web",
  parity: { native: { status: "gap", issue: "krizaka/krizaka-ui#278", reason: "An upload from the phone will need it." }, desktop: "web" },
  whenToUse: [
    "To keep a part of a clip before publishing it: a story, a highlight, a reply.",
    "To choose a segment of any timeline (a sound with a waveform as `children`, a recording).",
  ],
  whenNotToUse: [
    { when: "For one value or a range of numbers without a media: a slider.", use: "slider" },
    { when: "To play a video: the video player.", use: "video-player" },
  ],
  bestPractices: [
    "Render the preview on `onValueCommit` (the end of a drag), not on every move.",
    "Set `minLength` to the shortest clip the product accepts, and `largeStep` to a second.",
    "Make the filmstrip from a few frames of the clip (8 to 12), the same width each.",
    "Restyle any part with `classNames` and the handles with `renderHandle`; the alignment stays (each handle on its value by its outer edge).",
  ],
  accessibility: {
    keyboard: [
      { keys: "Arrow keys", action: "Move the focused handle (or the playhead) by `step`; with Shift by `largeStep`." },
      { keys: "Page Up / Page Down", action: "Move by `largeStep`." },
      { keys: "Home / End", action: "To the start or the end, as far as the other handle allows." },
    ],
    notes: [
      "Each handle is a `slider` named by a prop (“Start”, “End”), its bounds set by the other handle and `minLength`.",
      "The values are read as times (`aria-valuetext`, `formatTime`), not as seconds.",
      "The playhead is a slider too when `onSeek` is given; read-only otherwise.",
    ],
  },
  related: ["slider", "video-player", "audio-player"],
  web: {
    imports: ["VideoTrimmer"],
    examples: [
      { name: "filmstrip", title: "Filmstrip", description: "A 42-second clip, 12 seconds kept, frames in the track." },
      { name: "playhead", title: "With the playhead", description: "`time` and `onSeek`: the playhead stays within the part kept." },
      { name: "custom", title: "Custom parts", description: "`classNames` and `renderHandle`: thin handles over a waveform band." },
    ],
  },
} satisfies ComponentMeta;
