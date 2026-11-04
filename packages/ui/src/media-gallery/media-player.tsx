// Client (a dialog, the video player). ONE designed media player: the same frame inline, in a lightbox, or vertical (9:16).
// Inline it is the VideoPlayer of `@krizaka/ui/video-player`; as a lightbox a poster with a play button opens the player in a
// dialog, started by that press, with sound. Nothing moves under the pointer: the poster's hover is a colour.
import * as React from "react";
import { tv } from "tailwind-variants";

import { PlayGlyph } from "../glyphs";
import { VideoPlayer, type VideoPlayerProps } from "../video-player";

// The dialog and the player of the lightbox load when the poster is pressed, not with the page.
const PlayerLightbox = React.lazy(() => import("./player-lightbox"));

export const mediaPlayer = tv({
  slots: {
    poster:
      "group relative isolate block w-full overflow-hidden rounded-xl border border-border-default bg-media p-0 text-fg-on-media " +
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
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
  /** The poster's words in the lightbox ("Play the film"), passed translated. Required for `lightbox`. */
  playLabel?: string;
  /** The close button's words, passed translated. Default `Close`. */
  closeLabel?: string;
  /** What the poster shows, in words (the `alt` of its image); default is empty (decorative: `playLabel` names the button). */
  posterAlt?: string;
  /** A line over the foot of the poster (« Fig. 1a »). */
  caption?: string;
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
  onOpenChange,
  className,
  ...player
}: MediaPlayerProps) {
  const ratio = vertical ? "9 / 16" : "16 / 9";
  const [open, setOpen] = React.useState(false);
  const poster = React.useRef<HTMLButtonElement>(null);
  const toggle = React.useCallback(
    (next: boolean) => {
      setOpen(next);
      onOpenChange?.(next);
      if (!next) poster.current?.focus();
    },
    [onOpenChange],
  );
  if (mode === "inline") return <VideoPlayer {...player} aspectRatio={ratio} className={className} />;
  return (
    <>
      <button ref={poster} type="button" className={s.poster({ className })} style={{ aspectRatio: ratio }} aria-label={caption ? `${caption}. ${playLabel ?? player.title}` : (playLabel ?? player.title)} onClick={() => toggle(true)}>
        {player.poster && <img src={player.poster} alt={posterAlt} loading="lazy" decoding="async" className={s.image()} />}
        <span className={s.play()} aria-hidden>
          <PlayGlyph className="ml-1 h-6 w-6" />
        </span>
        {caption && <span className={s.caption()}>{caption}</span>}
      </button>
      {open && (
        <React.Suspense fallback={null}>
          <PlayerLightbox player={player} ratio={ratio} vertical={vertical} closeLabel={closeLabel} onClose={() => toggle(false)} />
        </React.Suspense>
      )}
    </>
  );
}
