import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Vertical video",
  summary: "A 9:16 short video with the action rail of a short-video feed — follow, like, comments, share, your own tip button — and the creator's caption over the picture; `ShortFeed` stacks them as a snap-scrolling feed that plays the one in view.",
  status: "beta",
  category: "media",
  domain: "media",
  platforms: "both",
  parity: { desktop: "web" },
  whenToUse: [
    "A creator's short clips: a feed, stories, an explore grid that opens on a video.",
    "A phone-first product page where the video is the page (a video feed, the home gallery's phone).",
    "With `tipSlot`, `topStart` (an auction's time left) and `aboveCaption` (a goal gauge) for what is the product's own.",
  ],
  whenNotToUse: [
    { when: "For a watch page with a seek bar, subtitles and speed: the full player.", use: "video-player" },
  ],
  bestPractices: [
    "Give every word in `labels` and a `title` that names the clip; the rail's buttons are named, 44 px and say their state (`aria-pressed`).",
    "Counts are compact in the viewer's `locale` (12.4K): pass numbers, not strings.",
    "In a `ShortFeed`, pass `active` and `preload` from `renderItem`: the one in view plays, the next preloads, the rest pause and stay unmounted.",
    "Put product actions in slots, never a fork: a tip, an unlock, a report.",
    "In a box that has its own size (a bento tile, a grid cell), pass `fit=\"fill\"`: the clip covers the box edge to edge, never a small 9:16 floating in it.",
  ],
  accessibility: {
    keyboard: [
      { keys: "Space / K", action: "Play or pause the focused video." },
      { keys: "L", action: "Like it." },
      { keys: "Arrow Up / Arrow Down", action: "In a feed: the previous or next video, the focus follows." },
      { keys: "Tab", action: "The tap target, then the rail's buttons, then the caption's “More”." },
    ],
    notes: [
      "Each video is an `article` named by `title`; the picture is one button (tap to pause or play, double tap to like) and the rail a named group.",
      "The progress hairline is a `progressbar` named by its label.",
      "Under reduced motion nothing autoplays: the poster and a play button; the like heart shows without growing.",
      "Over the picture everything reads on `scrim` and `fg-on-media`, which do not change with the theme.",
    ],
  },
  related: ["video-player", "profile-card", "avatar"],
  web: {
    imports: ["VerticalVideo", "ShortFeed", "verticalVideoLabels"],
    examples: [
      { name: "rail", title: "The rail and the caption", description: "Follow, like, comments, share and a tip button on the right; creator, caption, tags and credit bottom-left." },
      { name: "feed", title: "A feed", description: "`ShortFeed`: one video per screen, the one in view plays, the next preloads; ↑ ↓ move." },
    ],
  },
  native: {
    entry: "@krizaka/ui/native/vertical-video",
    deprecated: { since: "3.55.0", removedIn: "4.0.0", reason: "No app imports `@krizaka/ui/native/vertical-video` (ADR-006 audit, 2026-10-25). The web entry stays." },
    imports: ["VerticalVideo", "ShortFeed", "verticalVideoLabels"],
    differences: [
      "Its own entry (`@krizaka/ui/native/vertical-video`): it plays on expo-video, an optional peer.",
      "`uri` and `posterUri` instead of `src` and `poster`; `creator.avatarUri`; a long press likes (there is no double click).",
      "`ShortFeed` pages a FlatList: give it the page's `height`; the slide in view is the viewable one.",
    ],
    examples: [{ name: "rail", title: "The rail and the caption", description: "The same composition on a phone: follow, like, comments, share and your tip button; caption bottom-left." }],
  },
} satisfies ComponentMeta;