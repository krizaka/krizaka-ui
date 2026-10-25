import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Retro TV",
  summary: "A vertical video presented in a detailed television cabinet, with an accessible player, channel label, scanlines and an animated off-state.",
  status: "deprecated",
  deprecated: {
    since: "3.55.0",
    removedIn: "4.0.0",
    reason: "No product or site imports it and no filed need names it (ADR-006 audit, 2026-10-25): there is no replacement.",
  },
  category: "media",
  platforms: "web",
  parity: {
    native: { status: "n/a", reason: "The CSS cabinet and SVG static belong to the web presentation; use the native video player for mobile playback.", use: "video-player" },
    desktop: "web",
  },
  whenToUse: [
    "To give a shop's latest reel or story a place on its wall, while keeping the video itself the focus.",
    "For a vertical clip whose presentation should feel like a television, in either cabinet or portable style.",
  ],
  whenNotToUse: [
    { when: "For video without a decorative television frame: use the accessible video player.", use: "video-player" },
    { when: "For a feed of creator clips with an action rail and caption: use vertical video.", use: "vertical-video" },
  ],
  bestPractices: [
    "Give the player a title, poster and translated `labels`; pass WebVTT captions as `tracks`.",
    "Keep autoplay muted; it starts only while the player is on screen and waits under reduced motion.",
    "Use `off` for the static screen; the video is not loaded or played in this state.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Space / K", action: "Play or pause the focused video." },
      { keys: "Tab", action: "Move through the player's named controls." },
    ],
    notes: [
      "The cabinet, scanlines and static are decorative; the embedded video player keeps its named region and keyboard-accessible controls.",
      "The focus ring remains visible around the screen, and the channel name is visible text.",
      "Under reduced motion the power-on and static effects stop, and autoplay waits for a gesture.",
    ],
  },
  related: ["video-player", "vertical-video", "audio-player"],
  web: {
    imports: ["RetroTv"],
    examples: [
      { name: "cabinet", title: "Wood cabinet", description: "A vertical shop story in the cabinet television, with its channel label and player controls." },
      { name: "portable", title: "Portable set", description: "The same vertical story in a compact cream television cabinet." },
    ],
  },
} satisfies ComponentMeta;
