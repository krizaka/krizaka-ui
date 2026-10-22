// Headless: what the web (`vertical-video.tsx`) and the native (`native/vertical-video.tsx`) VerticalVideo share — the words,
// the content and the callbacks. Each platform adds its media (`src`/`poster` · `uri`/`posterUri`) and its frame.
import type * as React from "react";

export interface VerticalVideoLabels {
  /** "Play" / "Pause" — the tap target over the picture. */
  play: string;
  pause: string;
  /** "Like" / "Unlike" (the button's name; the state is `aria-pressed`). */
  like: string;
  comment: string;
  share: string;
  more: string;
  /** "Follow Elena" — `{name}` is replaced by the creator's name. */
  follow: string;
  /** "Following Elena". */
  following: string;
  /** "More" / "Less" on a long caption. */
  expand: string;
  collapse: string;
  /** The progress bar's name ("Progress"). */
  progress: string;
  /** The rail's name ("Actions"). */
  actions: string;
}

export const verticalVideoLabels: VerticalVideoLabels = {
  play: "Play",
  pause: "Pause",
  like: "Like",
  comment: "Comments",
  share: "Share",
  more: "More",
  follow: "Follow {name}",
  following: "Following {name}",
  expand: "More",
  collapse: "Less",
  progress: "Progress",
  actions: "Actions",
};

/** The props both platforms read: the same content, counts, state, callbacks and slots. */
export interface VerticalVideoShared {
  /** The video's accessible name ("Video: Night shoot, part 2"), passed translated. */
  title: string;
  /** Plays while `true`; a `ShortFeed` passes it for the slide in view. Default `true`. */
  active?: boolean;
  /** A pill beside the name: "AI-GENERATED" — said on the picture, never only in a page's footnote. */
  disclosure?: string;
  /** The caption: collapsed to two lines, expandable when long. */
  caption?: string;
  /** Tags under the caption (without `#`). */
  tags?: readonly string[];
  /** The sound or credit line ("Original sound — Elena"). */
  credit?: string;
  /** The like count under its button, compact (`12.4K`) in `locale`. */
  likes?: number;
  /** The comment count under its button. */
  comments?: number;
  /** The share count under its button. */
  shares?: number;
  /** Whether the viewer likes it: `aria-pressed` on the like button. */
  liked?: boolean;
  /** Whether the viewer follows the creator: the "+" on the avatar becomes a check. */
  following?: boolean;
  /** The viewer likes or unlikes (the button, `L`, a double tap). */
  onLike?: (liked: boolean) => void;
  /** Opens the comments; without it the button still shows. */
  onComment?: () => void;
  /** Opens the share sheet. */
  onShare?: () => void;
  /** The viewer follows or unfollows; without it the avatar has no "+". */
  onFollow?: (following: boolean) => void;
  /** The "more" button's action (report, hide); without it the button is not drawn. */
  onMore?: () => void;
  /** The product's own action on the rail: a tip, an unlock — a button of yours (≥ 44 px, named). */
  tipSlot?: React.ReactNode;
  /** Top left: a chip over the picture (an auction's time left). */
  topStart?: React.ReactNode;
  /** Above the caption: a goal gauge, a challenge's progress. */
  aboveCaption?: React.ReactNode;
  /** The locale of the counts. Default `en`. */
  locale?: string;
  /** Every word, passed translated. */
  labels?: Partial<VerticalVideoLabels>;
}
