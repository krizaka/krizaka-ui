// Client (a dialog, the video player). ONE designed media player: the same frame inline, in a lightbox, or vertical (9:16).
// Inline it is the VideoPlayer of `@krizaka/ui/video-player`; as a lightbox a poster with a play button opens the player in a
// dialog, started by that press, with sound. Nothing moves under the pointer: the poster's hover is a colour.
import * as React from "react";
import { tv } from "tailwind-variants";

import { PlayGlyph } from "../glyphs";
import { useControllable } from "../media";
import { VideoPlayer, type VideoPlayerProps } from "../video-player";
import { type LoopLabels, loopLabels, type LoopSources, LoopToggle, LoopVideo, useLoop } from "./pausable-loop";

// The dialog and the player of the lightbox load when the poster is pressed, not with the page.
const PlayerLightbox = React.lazy(() => import("./player-lightbox"));

export const mediaPlayer = tv({
  slots: {
    frame: "relative isolate block w-full overflow-hidden rounded-xl border border-border-default bg-media p-0 text-fg-on-media",
    poster:
      "group absolute inset-0 block h-full w-full cursor-pointer border-0 bg-transparent p-0 text-fg-on-media " +
      "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
    image: "absolute inset-0 h-full w-full object-cover",
    play:
      "absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full " +
      "bg-scrim-strong text-fg-on-media transition-colors group-hover:bg-scrim",
    caption: "pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-scrim-strong to-transparent p-3 pt-8 text-left text-xs font-semibold",
  },
});
const s = mediaPlayer();

export type MediaPlayerProps = Pick<
  VideoPlayerProps,
  "src" | "poster" | "title" | "tracks" | "loadHls" | "labels" | "onPlay" | "onPause" | "onEnded" | "onError"
> & {
  /** `inline`: the player itself. `lightbox`: a poster that opens it in a dialog. Default `inline`. */
  mode?: "inline" | "lightbox";
  /** `9 / 16` frame for a vertical film; default `16 / 9`. */
  vertical?: boolean;
  /** Any frame ratio (`19 / 16`, `4 / 3`): wins over `vertical`. Default `16 / 9` (`9 / 16` when `vertical`). */
  ratio?: string;
  /** The poster's words in the lightbox ("Play the film"), passed translated. Required for `lightbox`. */
  playLabel?: string;
  /** The close button's words, passed translated. Default `Close`. */
  closeLabel?: string;
  /** What the poster shows, in words (the `alt` of its image); default is empty (decorative: `playLabel` names the button). */
  posterAlt?: string;
  /** A line over the foot of the poster (« Fig. 1a »). */
  caption?: string;
  /** Lightbox: a muted, silent loop previewing the poster. Fetched after the page's `load`, plays only on screen, has a visible pause; a still under reduced motion or Save-Data. */
  preview?: LoopSources;
  /** The preview's pause / play words, passed translated. English by default. */
  previewLabels?: LoopLabels;
  /** Lightbox: opens or closes it from outside (controlled). With it, `onOpenChange` is how the lightbox asks to close. */
  open?: boolean;
  /** Lightbox: starts open (uncontrolled). */
  defaultOpen?: boolean;
  /** Lightbox: replaces the poster with your own opener (`(open) => <button onClick={open}>…`); `null` draws nothing, for a lightbox driven by `open` alone. */
  trigger?: ((open: () => void) => React.ReactNode) | null;
  /** Called when the lightbox opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Classes merged on the player or the poster. */
  className?: string;
};

/** A video in one frame: inline, in a lightbox (a press opens it with sound), 16:9 or vertical. */
export function MediaPlayer({
  mode = "inline",
  vertical = false,
  playLabel,
  closeLabel = "Close",
  posterAlt = "",
  caption,
  preview,
  previewLabels,
  open: given,
  defaultOpen = false,
  trigger,
  onOpenChange,
  ratio: freeRatio,
  className,
  ...player
}: MediaPlayerProps) {
  const ratio = freeRatio ?? (vertical ? "9 / 16" : "16 / 9");
  const [open, setOpen] = useControllable(given, defaultOpen, onOpenChange);
  // The dialog hands the focus back to whatever opened it (the poster or the page's own trigger) when it closes.
  if (mode === "inline") return <VideoPlayer {...player} aspectRatio={ratio} className={className} />;
  const opener =
    trigger === undefined ? (
      <PosterFrame {...{ ratio, className, caption, posterAlt, preview, previewLabels }} name={playLabel ?? player.title} poster={player.poster} onOpen={() => setOpen(true)} />
    ) : (
      trigger?.(() => setOpen(true))
    );
  return (
    <>
      {opener}
      {open && (
        <React.Suspense fallback={null}>
          <PlayerLightbox player={player} ratio={ratio} closeLabel={closeLabel} onClose={() => setOpen(false)} />
        </React.Suspense>
      )}
    </>
  );
}

type PosterFrameProps = Readonly<{
  ratio: string;
  className?: string;
  caption?: string;
  posterAlt: string;
  poster?: string;
  name: string;
  preview?: LoopSources;
  previewLabels?: LoopLabels;
  onOpen: () => void;
}>;

/** The default opener: the poster (and its loop) in a frame, one button named by `playLabel`; the pause is a sibling, never nested. */
function PosterFrame({ ratio, className, caption, posterAlt, poster, name, preview, previewLabels, onOpen }: PosterFrameProps) {
  const loop = useLoop();
  return (
    <div className={s.frame({ className })} style={{ aspectRatio: ratio }}>
      {poster && <img src={poster} alt={posterAlt} loading="lazy" decoding="async" className={s.image()} />}
      {preview && poster && <LoopVideo loop={loop} sources={preview} poster={poster} className={s.image()} />}
      <button type="button" className={s.poster()} aria-label={caption ? `${caption}. ${name}` : name} onClick={onOpen}>
        <span className={s.play()} aria-hidden>
          <PlayGlyph className="ml-1 h-6 w-6" />
        </span>
        {caption && <span className={s.caption()}>{caption}</span>}
      </button>
      {preview && <LoopToggle loop={loop} labels={previewLabels ?? loopLabels} />}
    </div>
  );
}
