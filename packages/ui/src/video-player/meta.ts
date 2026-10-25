import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Video player",
  summary: "A video with accessible controls — HLS through an hls.js loaded only when needed, signed sources resolved at the last moment, subtitles, speed, full screen, a pause when it leaves the screen.",
  status: "beta",
  category: "media",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: [
    "To play a video on a page: a watch page, a lesson, a product tour, a creator's clip.",
    "With `src` as a function when the address is signed and short-lived: it is fetched when needed, and again after an error.",
    "With `overlay` to draw a gate over the video (sign in, unlock, age check) without forking the player.",
  ],
  whenNotToUse: [
    { when: "For a short decorative loop with no sound: `controls={false}`, `autoPlay`, `loop`, `muted` — or a still image under reduced motion." },
    { when: "For a sound without a picture: the audio player.", use: "audio-player" },
  ],
  bestPractices: [
    "Pass hls.js as `loadHls={() => import(\"hls.js\")}`: the module is downloaded only by browsers without native HLS (Chrome, Firefox), never by Safari or iOS.",
    "Name the player by its content (`title=\"Video: Sunset over Montréal\"`) and pass every control's words in `labels`.",
    "Use `preload=\"none\"` in a list of many videos, `metadata` (default) on a watch page.",
    "Give subtitles (`tracks`, WebVTT): the C key and a button cycle through them.",
    "In React Native, import it from `@krizaka/ui/native/video-player` (expo-video, an optional peer).",
  ],
  accessibility: {
    keyboard: [
      { keys: "Space / K", action: "Play or pause (the player has the focus)." },
      { keys: "Arrow Left / Arrow Right", action: "Back or forward 5 seconds." },
      { keys: "J / L", action: "Back or forward 10 seconds." },
      { keys: "Arrow Up / Arrow Down", action: "Volume up or down." },
      { keys: "M · F · C", action: "Mute, full screen, subtitles." },
      { keys: "Home / End · 0–9", action: "Start, end, or a tenth of the video." },
    ],
    notes: [
      "A `region` named by `title`, focusable; every button is named by a prop and says its state (“Pause”, “Unmute”).",
      "Seek and volume are sliders (`@krizaka/ui/slider`) whose value is read as a time (“1:05 of 3:20”) or a percentage.",
      "A failure is announced (`role=\"alert\"`) with a retry; waiting for data is a status (“Loading”).",
      "Under reduced motion autoplay waits for a gesture and the controls appear without fading.",
    ],
  },
  related: ["audio-player", "slider"],
  web: {
    imports: ["VideoPlayer"],
    examples: [
      { name: "default", title: "Default", description: "An MP4 with its poster and the full set of controls." },
      { name: "signed-source", title: "Signed source", description: "`src` as a function: a short-lived address asked from the server on the first play." },
      { name: "vertical", title: "Vertical", description: "A 9:16 clip, muted, looping — autoplay waits under reduced motion." },
      { name: "gated", title: "With a gate", description: "`overlay`: the app draws its own gate over the video, the controls step aside." },
    ],
  },
  native: {
    entry: "@krizaka/ui/native/video-player",
    imports: ["VideoPlayer"],
    differences: [
      "Its own entry, `@krizaka/ui/native/video-player`, on expo-video (an optional peer): an app that plays no video installs nothing.",
      "The platform's controls (`nativeControls`, default `true`): accessible, full screen and picture in picture by the system.",
      "`source` is an object (`uri`, `contentType`, `headers`); `paused` stops it off screen (a FlatList's viewability).",
    ],
    examples: [{ name: "default", title: "Default", description: "An HLS source with its poster until the first frame." }],
  },
} satisfies ComponentMeta;
