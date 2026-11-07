"use client";

/**
 * @file ClipPlayer.tsx
 * @description A short clip that is plainly a clip: a muted loop that plays in view, a badge, play/pause and sound
 * buttons, and a click that opens it larger. Words are props; nothing is fetched.
 */
import { MuteIcon, PauseIcon, PlayIcon, SoundIcon, VideoIcon } from "@krizaka/icons";
import { Button } from "@krizaka/ui/button";
import { cn } from "@krizaka/ui/cn";
import { Dialog } from "@krizaka/ui/dialog";
import * as React from "react";

/** The files of a clip: H.264 `mp4` (the fallback), `webm` (tried first) and the poster. */
export interface ClipSources {
  mp4: string;
  /** The VP9 file, tried first by the browsers that read it. */
  webm?: string;
  poster: string;
}

/** Every word of the player, translated by the app. */
export interface ClipPlayerLabels {
  /** The badge that says it is a video, with its length: `Video · 5 s`. */
  badge: string;
  play: string;
  pause: string;
  mute: string;
  /** The sound button while the clip is muted. */
  unmute: string;
  /** The name of the button that opens the clip larger (the whole frame is that button). */
  enlarge: string;
  /** The close button of the large view. */
  close: string;
}

/** Props of {@link ClipPlayer}. */
export interface ClipPlayerProps {
  /** The files. */
  sources: ClipSources;
  /** The accessible name of the video: what it shows, in a sentence. */
  title: string;
  /** The words. */
  labels: ClipPlayerLabels;
  /** The shape of the frame: a 16:9 one by default, a portrait one as tall as a phone allows. */
  orientation?: "landscape" | "portrait";
  /** Extra classes on the video, merged last. */
  className?: string;
}

const REDUCED = "(prefers-reduced-motion: reduce)";
const readReducedMotion = () => (typeof window.matchMedia === "function" ? window.matchMedia(REDUCED).matches : false);
function subscribeReducedMotion(notify: () => void) {
  const query = typeof window.matchMedia === "function" ? window.matchMedia(REDUCED) : null;
  query?.addEventListener?.("change", notify);
  return () => query?.removeEventListener?.("change", notify);
}

const control = "pointer-events-auto bg-surface-0/80 backdrop-blur";

/**
 * A clip that is plainly a clip: muted loop that plays only while on screen (and pauses off screen and in a hidden
 * tab), a badge, play/pause and sound buttons on hover and focus (always shown where the pointer cannot hover), and a
 * click anywhere on the frame opens it larger in a dialog with the native controls. Under `prefers-reduced-motion` it
 * never plays by itself: the poster and a play button. Plain files, `playsInline`, `preload="none"`.
 *
 * @param props - {@link ClipPlayerProps}
 * @returns The player of a short clip.
 */
export function ClipPlayer({
  sources,
  title,
  labels,
  orientation = "landscape",
  className,
}: Readonly<ClipPlayerProps>) {
  const ref = React.useRef<HTMLVideoElement>(null);
  const userPaused = React.useRef(false);
  const [playing, setPlaying] = React.useState(false);
  const [muted, setMuted] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  // On the server nothing plays (the preference is unknown); in the browser it is the visitor's.
  const reduced = React.useSyncExternalStore(subscribeReducedMotion, readReducedMotion, () => true);

  React.useEffect(() => {
    const video = ref.current;
    if (!video || reduced || typeof IntersectionObserver === "undefined") return;
    let visible = false;
    const sync = () => {
      if (visible && !document.hidden && !userPaused.current && !open) void video.play?.()?.catch?.(() => undefined);
      else video.pause?.();
    };
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        sync();
      },
      { threshold: 0.35 },
    );
    observer.observe(video);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      video.pause?.();
    };
  }, [reduced, open]);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      void video.play?.()?.catch?.(() => undefined);
    } else {
      userPaused.current = true;
      video.pause?.();
    }
  };
  const toggleSound = () => {
    const video = ref.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };
  const frame = orientation === "portrait" ? "aspect-[9/16] max-h-[70vh] w-auto" : "aspect-[26/15] w-full";

  return (
    <>
      <div className="group relative overflow-hidden" data-clip-player>
        <video
          ref={ref}
          aria-label={title}
          poster={sources.poster}
          muted
          loop
          playsInline
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          data-reduced-motion={reduced ? "true" : undefined}
          className={cn("mx-auto block object-cover", frame, className)}
        >
          {sources.webm && <source src={sources.webm} type="video/webm" />}
          <source src={sources.mp4} type="video/mp4" />
        </video>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={labels.enlarge}
          className="absolute inset-0 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <span
          className={cn(
            control,
            "pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-border-default px-2.5 py-1 font-mono text-xs text-fg",
          )}
          data-clip-badge
        >
          <VideoIcon size={14} />
          {labels.badge}
        </span>
        {reduced && !playing && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Button
              type="button"
              variant="primary"
              size="lg"
              shape="pill"
              className="pointer-events-auto"
              onClick={toggle}
              aria-label={labels.play}
            >
              <PlayIcon size={20} />
            </Button>
          </span>
        )}
        <div className="pointer-events-none absolute bottom-3 right-3 flex gap-2 opacity-100 transition-opacity [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within:opacity-100 [@media(hover:hover)]:group-hover:opacity-100">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className={control}
            onClick={toggle}
            aria-label={playing ? labels.pause : labels.play}
          >
            {playing ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className={control}
            onClick={toggleSound}
            aria-label={muted ? labels.unmute : labels.mute}
            aria-pressed={!muted}
          >
            {muted ? <MuteIcon size={16} /> : <SoundIcon size={16} />}
          </Button>
        </div>
      </div>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content closeLabel={labels.close} className="max-w-5xl">
          <Dialog.Header>
            <Dialog.Title>{title}</Dialog.Title>
          </Dialog.Header>
          <video
            aria-label={title}
            poster={sources.poster}
            controls
            autoPlay
            loop
            playsInline
            className="mx-auto block max-h-[75vh] w-full rounded-lg bg-surface-2"
          >
            {sources.webm && <source src={sources.webm} type="video/webm" />}
            <source src={sources.mp4} type="video/mp4" />
          </video>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}
