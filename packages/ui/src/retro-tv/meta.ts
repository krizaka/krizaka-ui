import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Retro TV",
  summary: "A vertical video presented in a detailed television cabinet, with an accessible player, channel label, scanlines and an animated off-state.",
  status: "beta",
  category: "media",
  domain: "media",
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
    "`playlist` plays the programmes in order, then loops; `transition` is `channel`, `crossfade` or `slide` and is a plain cut under reduced motion. Sound starts off: remember the visitor's choice from `onMutedChange`.",
    "A programme without `src` is a slot: fill it with `renderEmbed` (an `EmbedFacade` behind its consent click); the library loads no third-party script.",
    "A platform's short video (TikTok, YouTube Shorts, Instagram) goes in as `children`, an `EmbedFacade`: the television's screen shows the facade, and nothing is requested from the platform before the visitor's click.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Space / K", action: "Play or pause the focused video." },
      { keys: "N / P", action: "Next or previous programme of a playlist." },
      { keys: "M", action: "Turn the sound on or off." },
      { keys: "Arrow left / right", action: "Seek 5 seconds." },
      { keys: "Tab", action: "Move through the player's named controls." },
    ],
    notes: [
      "The cabinet, scanlines and static are decorative; the embedded video player keeps its named region and keyboard-accessible controls.",
      "The focus ring remains visible around the screen, and the channel name is visible text.",
      "Under reduced motion the power-on and static effects stop, and autoplay waits for a gesture.",
    ],
  },
  related: ["video-player", "vertical-video", "audio-player", "embed-facade"],
  web: {
    imports: ["RetroTv"],
    examples: [
      { name: "cabinet", title: "Wood cabinet", description: "A vertical shop story in the cabinet television, with its channel label and player controls." },
      { name: "portable", title: "Portable set", description: "The same vertical story in a compact cream television cabinet." },
      { name: "playlist-channel", title: "Playlist, channel switch", description: "`playlist` with `transition=\"channel\"`: static and a roll between programmes, in order, then looping." },
      { name: "playlist-crossfade", title: "Playlist, crossfade", description: "`transition=\"crossfade\"`: one programme dissolves into the next." },
      { name: "playlist-slide", title: "Playlist, slide", description: "`transition=\"slide\"`: the next programme pushes the last one out." },
      { name: "facade", title: "A platform's reel behind a facade", description: "`children`: an `EmbedFacade` on the screen, nothing loaded until the click." },
    ],
  },
} satisfies ComponentMeta;
