// Client (the page's load, the viewport, the reader's motion and data preferences). A muted, silent loop that previews a still or a
// film: poster first, nothing fetched before the page's `load`, playing only while on screen, with a visible pause / play
// control (WCAG 2.2.2). Under reduced motion or Save-Data the poster stays alone and there is nothing to pause.
import * as React from "react";

import { cn } from "../cn";
import { PauseGlyph, PlayGlyph } from "../glyphs";
import { playSafely, usePrefersReducedMotion } from "../media";

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
export function useCalm(): boolean {
  const reduce = usePrefersReducedMotion();
  return reduce || (typeof navigator !== "undefined" && Boolean((navigator as SaveDataNavigator).connection?.saveData));
}

/** The state of one loop: whether to show it, whether it plays, and the person's pause. The elements arrive through callback refs. */
export function useLoop(active = true) {
  const calm = useCalm();
  const loaded = usePageLoaded();
  const [holder, setHolder] = React.useState<HTMLDivElement | null>(null);
  const [video, setVideo] = React.useState<HTMLVideoElement | null>(null);
  const [onScreen, setOnScreen] = React.useState(() => typeof IntersectionObserver === "undefined");
  const [paused, setPaused] = React.useState(false);
  React.useEffect(() => {
    if (calm || !holder || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => entry && setOnScreen(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(holder);
    return () => observer.disconnect();
  }, [calm, holder]);
  const mounted = !calm && loaded;
  const playing = mounted && onScreen && active && !paused;
  React.useEffect(() => {
    if (!video) return;
    if (playing) playSafely(video);
    else video.pause?.();
  }, [playing, video]);
  return { calm, mounted, playing, paused, toggle: () => setPaused((p) => !p), attachHolder: setHolder, attachVideo: setVideo };
}

export type LoopState = ReturnType<typeof useLoop>;

/** The loop's picture: sits over the poster, under whatever the slide draws on top. */
export function LoopVideo({ loop, sources, poster, className }: Readonly<{ loop: LoopState; sources: LoopSources; poster: string; className: string }>) {
  const { mounted, attachHolder, attachVideo } = loop;
  return (
    <div ref={attachHolder} className="absolute inset-0">
      {mounted && (
        <video ref={attachVideo} className={className} poster={poster} muted loop playsInline preload="metadata" aria-hidden tabIndex={-1}>
          {sources.webm && <source src={sources.webm} type="video/webm" />}
          {sources.mp4 && <source src={sources.mp4} type="video/mp4" />}
        </video>
      )}
    </div>
  );
}

/** The visible pause / play of the loop; nothing under reduced motion (nothing moves). */
export function LoopToggle({ loop, labels, className }: Readonly<{ loop: LoopState; labels: LoopLabels; className?: string }>) {
  if (loop.calm) return null;
  const Glyph = loop.paused ? PlayGlyph : PauseGlyph;
  return (
    <button
      type="button"
      aria-label={loop.paused ? labels.play : labels.pause}
      onClick={loop.toggle}
      className={cn(
        "absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-scrim-strong text-fg-on-media transition-colors hover:bg-scrim " +
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none",
        className,
      )}
    >
      <Glyph className="h-4 w-4" />
    </button>
  );
}
