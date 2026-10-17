import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Terminal replay",
  summary:
    "A terminal session played back: each command typed at the prompt, its output line by line, the screen following the last line — or the whole session at rest, as the server renders it.",
  status: "beta",
  category: "media",
  platforms: "web",
  parity: { native: { status: "n/a", reason: "A recorded terminal session shown on a site's page." }, desktop: { status: "n/a", reason: "A public site's page, not a window of the Mac app." } },
  whenToUse: [
    "Show how a command-line tool works from a recording of a real session: install, start, run.",
    "A getting-started page where the reader should see the order of the commands and what each one answers.",
  ],
  whenNotToUse: [
    { when: "For commands the reader copies and runs, with nothing to watch.", use: "kbd" },
    { when: "For a video of an application's screens: record the screens, not a terminal.", use: "video-player" },
    { when: "For output you wrote by hand: replay what the tool really printed, or show none." },
  ],
  bestPractices: [
    "Replay a real session, captured from the tool itself — never an invented output.",
    "Keep each step short: a long output is trimmed where it repeats, and says it was trimmed.",
    "Name the screen (`label`) by what it shows; the words of the controls arrive as props, translated.",
    "Give the copy button (`copyLabel`) when the commands are meant to be run.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Focuses the play, pause or replay control, the copy button, then the screen, which scrolls with the arrow keys." },
    ],
    notes: [
      "The screen is a named region holding the whole transcript for assistive technology; the characters being typed are hidden from it — never read letter by letter.",
      "It starts when it scrolls into view and waits while it is off screen; a control pauses it, plays it or replays it (WCAG 2.2.2).",
      "Under `prefers-reduced-motion`, without JavaScript and before it plays, the whole session is shown at rest; the caret does not blink.",
      "The copy button says it copied in a polite live region.",
    ],
  },
  related: ["kbd", "video-player", "stepper"],
  web: {
    imports: ["TerminalReplay"],
    examples: [
      { name: "session", title: "A session", description: "Three commands typed one after the other, their output line by line; it starts when it scrolls into view." },
      { name: "at-rest", title: "At rest", description: "`autoPlay={false}`: the whole session is shown until the reader presses play — a page that should stay still." },
    ],
  },
} satisfies ComponentMeta;
