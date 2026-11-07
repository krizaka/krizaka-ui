import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Video result",
  summary:
    "What a video run of a Studio leaves: the clip in its player (a muted loop in view, badge, controls, opens larger), the exact prompt, what the run recorded, the command that makes it again, and a download.",
  why: "Orazaka's promise is that a result is proven, not claimed: a generated clip comes with its prompt, its model, its seed, its frame, its length, its time, its cost and the id of the run that made it, and says how to make it again. @krizaka/ui has the player and the code block; this composite is the product's way of showing a run's result once, the same on every screen.",
  status: "beta",
  category: "data-display",
  platforms: "web",
  builtOn: ["ui/code-block", "ui/button"],
  whenToUse: [
    "On the page of a finished run of a video Studio, in the console and in the gallery of a site.",
    "Anywhere a generated clip must come with what proves where it came from.",
  ],
  whenNotToUse: [
    { when: "For a short looping accent with no words: a muted `<video>` that plays in view is enough." },
    { when: "For a clip the visitor must control in depth (subtitles, speed, chapters).", use: "ui/video-player" },
  ],
  bestPractices: [
    "Say the real source in the facts (`Made by DigitalOcean serverless inference · run by Orazaka`), never a flattering one.",
    "Give the frame the clip was really made in (`orientation`), never crop a landscape clip into a portrait one.",
    "Every word is a prop (`labels`, `facts`): the app translates them; the prompt stays as the model received it.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Enter / Space", action: "Activates the focused button: open larger, play or pause, sound." },
      { keys: "Tab", action: "Moves through the player controls, the copy button and the download link." },
    ],
    notes: [
      "The video is named (`title`); it is a muted loop that plays only in view, never under reduced motion (poster and a play button).",
      "The facts are a description list; the command is a code block with a polite copy confirmation.",
      'The prompt is marked `lang="en"`: it is what the model received, whatever the page\'s language.',
    ],
  },
  related: ["clip-player", "run-facts", "ui/video-player", "ui/code-block"],
  web: {
    imports: ["VideoResult"],
    examples: [
      {
        name: "tea-pour",
        title: "A landscape clip with its run",
        description:
          "Eric's tea-pour shot: the poster, the prompt, the facts of the run, the command and the download.",
      },
      {
        name: "assistant",
        title: "A clip without its command",
        description: "The player, the prompt and the facts of the run; no command, no download.",
      },
    ],
  },
} satisfies ComponentMeta;
