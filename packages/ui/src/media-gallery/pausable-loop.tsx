// @krizaka/ui/pausable-loop. Client (the page's load, the viewport, the reader's motion and data preferences). A muted, silent loop that previews a still or a
// film: poster first, nothing fetched before the page's `load`, playing only while on screen, with a visible pause / play
// control (WCAG 2.2.2). Under reduced motion or Save-Data the poster stays alone and there is nothing to pause.
import * as React from "react";

import { cn } from "../cn";
import { PauseGlyph, PlayGlyph } from "../glyphs";
import { playSafely, useInView, usePrefersReducedMotion } from "../media";

export type LoopSources = { webm?: string; mp4?: string };
export type LoopLabels = { pause: string; play: string };
export const loopLabels: LoopLabels = { pause: "Pause the animation", play: "Play the animation" };

const subscribeLoad = (notify: () => void) => {
  window.addEventListener("load", notify);
  return () => window.removeEventListener("load", notify);
};
/** `true` once the page has finished loading: a loop is not worth bytes before it. */
function usePageLoaded(): boolean {
  return React.useSyncExternalStore(subscribeLoad, () => document.readyState === "complete", () => false);
}

type SaveDataNavigator = Navigator & { connection?: { saveData?: boolean } };
/** `true` when the person asked for less motion or less data: a loop stays a poster. */
function useCalm(): boolean {
  const reduce = usePrefersReducedMotion();
  return reduce || (typeof navigator !== "undefined" && Boolean((navigator as SaveDataNavigator).connection?.saveData));
}

export type PausableLoopProps = {
  /** The loop's files; `mp4` and / or `webm`. */
  sources: LoopSources;
  /** The still under the loop, shown first and kept under reduced motion or Save-Data. */
  poster: string;
  /** Plays only while `true` (e.g. the slide in view). Default `true`. */
  active?: boolean;
  /** The pause / play words, passed translated. English by default. */
  labels?: LoopLabels;
  /** Classes of the `<video>`; default fills its frame, cropped. */
  className?: string;
};

/** A muted, silent loop over a still, with a visible pause / play. Drop it into a frame that is `relative`: `MediaPlayer`'s `preview`, `MediaCarousel`'s `renderLoop`. */
export function PausableLoop({ sources, poster, active = true, labels = loopLabels, className = "absolute inset-0 h-full w-full object-cover" }: Readonly<PausableLoopProps>) {
  const calm = useCalm();
  const loaded = usePageLoaded();
  const mounted = !calm && loaded;
  const holder = React.useRef<HTMLDivElement>(null);
  const video = React.useRef<HTMLVideoElement>(null);
  const [onScreen, setOnScreen] = React.useState(() => typeof IntersectionObserver === "undefined");
  const [paused, setPaused] = React.useState(false);
  useInView(holder, setOnScreen, mounted);
  const playing = mounted && onScreen && active && !paused;
  React.useEffect(() => {
    if (!video.current) return;
    if (playing) playSafely(video.current);
    else video.current.pause?.();
  }, [playing]);
  const Glyph = paused ? PlayGlyph : PauseGlyph;
  return (
    <>
      <div ref={holder} className="absolute inset-0">
        {mounted && (
          <video ref={video} className={className} poster={poster} muted loop playsInline preload="metadata" aria-hidden tabIndex={-1}>
            {sources.webm && <source src={sources.webm} type="video/webm" />}
            {sources.mp4 && <source src={sources.mp4} type="video/mp4" />}
          </video>
        )}
      </div>
      {!calm && (
        <button
          type="button"
          aria-label={paused ? labels.play : labels.pause}
          onClick={() => setPaused((p) => !p)}
          className={cn(
            "absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-scrim-strong text-fg-on-media transition-colors hover:bg-scrim " +
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none",
          )}
        >
          <Glyph className="h-4 w-4" />
        </button>
      )}
    </>
  );
}
