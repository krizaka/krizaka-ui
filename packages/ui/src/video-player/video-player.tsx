// Client. A `<video>` with its own controls, accessible from end to end: a named region the keyboard reaches (Space /
// K, arrows, J / L, M, F, C, Home / End, 0–9), every button named by a prop, the seek and volume sliders of
// `@krizaka/ui/slider` with the time read aloud. HLS plays natively where the browser can (Safari, iOS) and through
// hls.js elsewhere — loaded only then, by the app's `loadHls` (`() => import("hls.js")`): an optional peer, never in
// the bundle of a page that does not play HLS. A signed address can be resolved at the last moment (`src` as a
// function), again after an error; the video pauses when it leaves the screen; autoplay waits under reduced motion.
import * as React from "react";

import { CaptionsGlyph, FullscreenGlyph, PauseGlyph, PipGlyph, PlayGlyph, RetryGlyph, VolumeGlyph } from "../glyphs";
import { clamp, formatClock, playSafely, useInView, usePrefersReducedMotion } from "../media";
import { Slider } from "../slider";
import { tv } from "../tv";

export const videoPlayer = tv({
  slots: {
    root:
      "theme-dark group/player relative isolate w-full overflow-hidden rounded-xl bg-media text-fg-on-media " +
      "focus-visible:focus-ring data-[idle]:cursor-none",
    video: "absolute inset-0 h-full w-full object-contain",
    poster: "pointer-events-none absolute inset-0 h-full w-full object-contain",
    big:
      "absolute left-1/2 top-1/2 z-10 inline-flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full " +
      "bg-scrim-strong text-fg-on-media shadow-lg backdrop-blur-sm transition-transform hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100 " +
      "focus-visible:focus-ring",
    bar:
      "absolute inset-x-0 bottom-0 z-20 flex flex-col gap-1 bg-linear-to-t from-scrim-strong via-scrim to-transparent px-3 pb-2 pt-10 " +
      "transition-opacity duration-300 motion-reduce:transition-none group-data-[idle]/player:opacity-0 group-focus-within/player:opacity-100",
    row: "flex items-center gap-1",
    button:
      "inline-flex h-9 min-w-9 shrink-0 items-center justify-center gap-1 rounded-md px-1.5 text-xs font-semibold text-fg-on-media " +
      "transition-colors hover:bg-fg-on-media/15 focus-visible:focus-ring aria-pressed:bg-fg-on-media/20",
    time: "px-1.5 font-mono text-[11px] tabular-nums text-fg-on-media",
    volume: "hidden w-20 items-center sm:flex",
    status: "absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-scrim-strong p-6 text-center text-sm",
    spinner: "h-10 w-10 animate-spin rounded-full border-2 border-fg-on-media/30 border-t-fg-on-media motion-reduce:animate-none",
    overlay: "absolute inset-0 z-30",
  },
});

/** What `loadHls` resolves to: the module of hls.js (only the members the player uses are typed). */
export type HlsModule = {
  default: {
    new (config?: Record<string, unknown>): {
      loadSource(url: string): void;
      attachMedia(media: HTMLMediaElement): void;
      destroy(): void;
      startLoad(): void;
      recoverMediaError(): void;
      on(event: string, listener: (event: string, data: { fatal?: boolean; type?: string }) => void): void;
    };
    isSupported(): boolean;
    Events: { ERROR: string };
    ErrorTypes: { NETWORK_ERROR: string; MEDIA_ERROR: string };
  };
};

export type VideoTrack = {
  /** The WebVTT file. */
  src: string;
  /** Its language, BCP 47 (`"fr"`). */
  srcLang: string;
  /** Its name in the menu ("Français"), passed translated. */
  label: string;
  /** `subtitles` (default) or `captions` (with the sounds, for deaf viewers). */
  kind?: "subtitles" | "captions";
  /** Shown from the start. */
  default?: boolean;
};

export type VideoPlayerLabels = {
  play: string;
  pause: string;
  mute: string;
  unmute: string;
  volume: string;
  seek: string;
  /** The speed button: `(rate) => "Speed " + rate + "×"`. */
  speed: (rate: number) => string;
  /** The captions button: `(track) => "Subtitles: " + (track ?? "off")`, the track's label or `null` when off. */
  captions: (track: string | null) => string;
  fullscreen: string;
  exitFullscreen: string;
  pictureInPicture: string;
  /** Read while the video waits for data. */
  loading: string;
  /** The video cannot play. */
  error: string;
  /** Tries again (resolves a signed `src` again). */
  retry: string;
  /** The seek slider's value: `(time, duration) => "1:05 of 3:20"`. */
  time: (time: string, duration: string) => string;
};

export const videoPlayerLabels: VideoPlayerLabels = {
  play: "Play",
  pause: "Pause",
  mute: "Mute",
  unmute: "Unmute",
  volume: "Volume",
  seek: "Seek",
  speed: (rate) => `Speed ${rate}×`,
  captions: (track) => `Subtitles: ${track ?? "off"}`,
  fullscreen: "Full screen",
  exitFullscreen: "Exit full screen",
  pictureInPicture: "Picture in picture",
  loading: "Loading",
  error: "This video cannot be played.",
  retry: "Try again",
  time: (time, duration) => `${time} of ${duration}`,
};

export type VideoPlayerProps = {
  /** The address of the video (MP4, WebM, or an HLS `.m3u8`), or a function that resolves a signed one when needed. */
  src: string | (() => Promise<string>);
  /** `auto` (default): HLS when the address ends in `.m3u8`. */
  type?: "auto" | "hls" | "file";
  /** Loads hls.js when the browser cannot play HLS itself: `() => import("hls.js")`. Without it, HLS needs Safari. */
  loadHls?: () => Promise<HlsModule>;
  /** The accessible name of the player ("Video: Sunset over Montréal"), passed translated. */
  title: string;
  /** The picture shown before playback. */
  poster?: string;
  /** Starts playing, muted (browsers refuse sound without a gesture) — not under reduced motion. */
  autoPlay?: boolean;
  /** Starts muted. */
  muted?: boolean;
  /** Plays again from the start at the end. */
  loop?: boolean;
  /** How much to fetch before playback: `none` (a list of many videos), `metadata` (default), `auto`. */
  preload?: "none" | "metadata" | "auto";
  /** Subtitles or captions (WebVTT): the C key and a button cycle through them. */
  tracks?: readonly VideoTrack[];
  /** The speeds offered by the speed button. Default `[0.5, 1, 1.25, 1.5, 2]`. */
  playbackRates?: readonly number[];
  /** Pauses when less than a quarter of the player is on screen. Default `true`. */
  pauseWhenHidden?: boolean;
  /** Shows the controls (default). `false`: a bare video (a background loop) — give it no sound. */
  controls?: boolean;
  /** Covers the video and hides the controls: a gate (sign in, unlock, age check) drawn by the app. */
  overlay?: React.ReactNode;
  /** The width / height ratio of the frame. Default `"16 / 9"`; `"9 / 16"` for a vertical video. */
  aspectRatio?: string;
  /** Called when playback starts. */
  onPlay?: () => void;
  /** Called when playback pauses. */
  onPause?: () => void;
  /** Called at the end. */
  onEnded?: () => void;
  /** Called as the time moves, in seconds (a few times a second). */
  onTimeUpdate?: (time: number) => void;
  /** Called when the video cannot play (a network failure, an expired address). */
  onError?: (error: unknown) => void;
  /** The words, passed translated; English by default. */
  labels?: Partial<VideoPlayerLabels>;
  /** Classes merged on the root. */
  className?: string;
};

const RATES = [0.5, 1, 1.25, 1.5, 2] as const;
const isHls = (url: string, type: VideoPlayerProps["type"]) => type === "hls" || (type !== "file" && /\.m3u8(\?|#|$)/i.test(url));

/** Shows the text track `index` of a video (and hides the others); -1 hides them all. */
function showTrack(element: HTMLVideoElement, index: number) {
  const list = element.textTracks;
  for (let i = 0; i < list.length; i += 1) list[i]!.mode = i === index ? "showing" : "disabled";
}

/** A video player with accessible controls, HLS on demand, signed sources, subtitles, speed, full screen. */
export function VideoPlayer({
  src,
  type = "auto",
  loadHls,
  title,
  poster,
  autoPlay,
  muted: initiallyMuted = false,
  loop,
  preload = "metadata",
  tracks = [],
  playbackRates = RATES,
  pauseWhenHidden = true,
  controls = true,
  overlay,
  aspectRatio = "16 / 9",
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  onError,
  labels: given,
  className,
}: VideoPlayerProps) {
  const labels = { ...videoPlayerLabels, ...given };
  const s = videoPlayer();
  const root = React.useRef<HTMLDivElement>(null);
  const video = React.useRef<HTMLVideoElement>(null);
  const reduce = usePrefersReducedMotion();
  const [resolved, setResolved] = React.useState<{ attempt: number; url: string } | null>(null);
  const [attempt, setAttempt] = React.useState(0);
  const [wanted, setWanted] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const [time, setTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [volume, setVolume] = React.useState(1);
  const [muted, setMuted] = React.useState(initiallyMuted || Boolean(autoPlay));
  const [rate, setRate] = React.useState(1);
  const [caption, setCaption] = React.useState(() => tracks.findIndex((t) => t.default));
  const [fullscreen, setFullscreen] = React.useState(false);
  const [waiting, setWaiting] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const [idle, setIdle] = React.useState(false);
  // The poster is an image over the video until the first play: it loads like any image (lazy, decoded once), the
  // same in every browser — the `poster` attribute is painted late and differently.
  const [started, setStarted] = React.useState(false);
  const idleTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const url = typeof src === "string" ? src : resolved?.attempt === attempt ? resolved.url : null;
  const needSource = typeof src === "function" && (preload !== "none" || wanted || (autoPlay && !reduce));

  // A signed source is resolved when it is needed, and again on "Try again".
  React.useEffect(() => {
    if (typeof src !== "function" || !needSource) return;
    let live = true;
    src().then(
      (next) => live && setResolved({ attempt, url: next }),
      (error: unknown) => {
        if (!live) return;
        setFailed(true);
        onError?.(error);
      },
    );
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `onError` is a callback, not a reason to resolve again
  }, [src, needSource, attempt]);

  // Attaches the source: natively, or through hls.js when the browser needs it.
  React.useEffect(() => {
    const element = video.current;
    if (!element || !url) return;
    let hls: InstanceType<HlsModule["default"]> | null = null;
    let live = true;
    const fail = (error: unknown) => {
      if (!live) return;
      setFailed(true);
      onError?.(error);
    };
    if (isHls(url, type) && !element.canPlayType("application/vnd.apple.mpegurl")) {
      if (!loadHls) fail(new Error("VideoPlayer: HLS needs `loadHls` in this browser."));
      else
        loadHls().then(({ default: Hls }) => {
          if (!live) return;
          if (!Hls.isSupported()) return fail(new Error("VideoPlayer: HLS is not supported here."));
          hls = new Hls({ enableWorker: true, backBufferLength: 60 });
          hls.on(Hls.Events.ERROR, (_event, data) => {
            if (!data.fatal) return;
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls?.startLoad();
            else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls?.recoverMediaError();
            else fail(data);
          });
          hls.loadSource(url);
          hls.attachMedia(element);
        }, fail);
    } else element.src = url;
    return () => {
      live = false;
      hls?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `onError` and `loadHls` are callbacks
  }, [url, type]);

  // Plays once the source is there, when it was asked for (a click before a signed source resolved, an autoplay).
  React.useEffect(() => {
    const element = video.current;
    if (!element || !url || !(wanted || (autoPlay && !reduce))) return;
    playSafely(element);
  }, [url, wanted, autoPlay, reduce]);

  React.useEffect(() => {
    if (video.current) showTrack(video.current, caption);
  }, [caption, tracks.length]);

  React.useEffect(() => {
    const change = () => setFullscreen(document.fullscreenElement === root.current);
    document.addEventListener("fullscreenchange", change);
    return () => document.removeEventListener("fullscreenchange", change);
  }, []);
  React.useEffect(() => () => clearTimeout(idleTimer.current), []);

  useInView(root, (visible) => !visible && video.current && !video.current.paused && video.current.pause(), pauseWhenHidden);

  const play = () => {
    setWanted(true);
    setFailed(false);
    playSafely(video.current);
  };
  const toggle = () => (playing ? video.current?.pause() : play());
  const seek = (to: number) => {
    if (!video.current) return;
    video.current.currentTime = clamp(to, 0, duration || video.current.duration || 0);
    setTime(video.current.currentTime);
  };
  const changeVolume = (to: number) => {
    if (!video.current) return;
    const next = clamp(to, 0, 1);
    video.current.volume = next;
    video.current.muted = next === 0;
    setVolume(next);
    setMuted(next === 0);
  };
  const toggleMute = () => {
    if (!video.current) return;
    if (muted && volume === 0) changeVolume(0.5);
    video.current.muted = !muted;
    setMuted(!muted);
  };
  const cycleRate = () => {
    const next = playbackRates[(playbackRates.indexOf(rate) + 1) % playbackRates.length] ?? 1;
    if (video.current) video.current.playbackRate = next;
    setRate(next);
  };
  const cycleCaption = () => tracks.length > 0 && setCaption((c) => (c + 2) % (tracks.length + 1) - 1);
  const toggleFullscreen = () => {
    const element = root.current;
    if (!element) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else if (element.requestFullscreen) void element.requestFullscreen();
    else (video.current as HTMLVideoElement & { webkitEnterFullscreen?: () => void })?.webkitEnterFullscreen?.();
  };
  const pip = () => {
    if (document.pictureInPictureElement) void document.exitPictureInPicture();
    else void video.current?.requestPictureInPicture?.();
  };
  const wake = () => {
    setIdle(false);
    clearTimeout(idleTimer.current);
    if (playing) idleTimer.current = setTimeout(() => setIdle(true), 2500);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const target = event.target as HTMLElement;
    const inControl = target.getAttribute("role") === "slider";
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    const now = video.current?.currentTime ?? 0;
    const actions: Record<string, (() => void) | undefined> = {
      " ": target.tagName === "BUTTON" ? undefined : toggle,
      k: toggle,
      j: () => seek(now - 10),
      l: () => seek(now + 10),
      m: toggleMute,
      f: toggleFullscreen,
      c: tracks.length ? cycleCaption : undefined,
      ArrowLeft: inControl ? undefined : () => seek(now - 5),
      ArrowRight: inControl ? undefined : () => seek(now + 5),
      ArrowUp: inControl ? undefined : () => changeVolume(volume + 0.1),
      ArrowDown: inControl ? undefined : () => changeVolume(volume - 0.1),
      Home: inControl ? undefined : () => seek(0),
      End: inControl ? undefined : () => seek(duration),
    };
    const action = /^[0-9]$/.test(key) && !inControl ? () => seek((Number(key) / 10) * duration) : actions[key];
    if (!action || event.metaKey || event.ctrlKey || event.altKey) return;
    event.preventDefault();
    action();
    wake();
  };

  const showControls = controls && !overlay;
  const pipSupported = typeof document !== "undefined" && "pictureInPictureEnabled" in document && document.pictureInPictureEnabled;

  return (
    <div
      ref={root}
      role="region"
      aria-label={title}
      tabIndex={showControls ? 0 : undefined}
      data-idle={idle && playing ? "" : undefined}
      data-state={playing ? "playing" : "paused"}
      className={s.root({ className })}
      style={{ aspectRatio }}
      onKeyDown={showControls ? onKeyDown : undefined}
      onPointerMove={showControls ? wake : undefined}
      onPointerLeave={() => playing && setIdle(true)}
    >
      <video
        ref={video}
        className={s.video()}
        preload={preload}
        loop={loop}
        muted={muted}
        playsInline
        crossOrigin={tracks.length ? "anonymous" : undefined}
        onClick={showControls ? toggle : undefined}
        onPlay={() => {
          setStarted(true);
          setPlaying(true);
          wake();
          onPlay?.();
        }}
        onPause={() => {
          setPlaying(false);
          setIdle(false);
          onPause?.();
        }}
        onEnded={() => onEnded?.()}
        onTimeUpdate={(event) => {
          setTime(event.currentTarget.currentTime);
          onTimeUpdate?.(event.currentTarget.currentTime);
        }}
        onDurationChange={(event) => setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)}
        onWaiting={() => setWaiting(true)}
        onPlaying={() => setWaiting(false)}
        onCanPlay={() => setWaiting(false)}
        onError={(event) => {
          setFailed(true);
          onError?.(event.currentTarget.error);
        }}
      >
        {tracks.map((track) => (
          <track key={track.src} src={track.src} srcLang={track.srcLang} label={track.label} kind={track.kind ?? "subtitles"} default={track.default} />
        ))}
      </video>

      {poster && !started ? <img src={poster} alt="" aria-hidden decoding="async" className={s.poster()} /> : null}

      {showControls && !playing && !failed && !waiting && (
        <button type="button" className={s.big()} aria-label={labels.play} onClick={play}>
          <PlayGlyph className="ml-1 h-7 w-7" />
        </button>
      )}

      {waiting && !failed && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <span className={s.spinner()} aria-hidden />
          <span role="status" className="sr-only">
            {labels.loading}
          </span>
        </div>
      )}

      {failed && (
        <div role="alert" className={s.status()}>
          <p>{labels.error}</p>
          <button
            type="button"
            className={s.button({ className: "border border-fg-on-media/40 px-3" })}
            onClick={() => {
              setFailed(false);
              setAttempt((a) => a + 1);
              video.current?.load();
            }}
          >
            <RetryGlyph className="h-4 w-4" />
            {labels.retry}
          </button>
        </div>
      )}

      {overlay ? <div className={s.overlay()}>{overlay}</div> : null}

      {showControls && (
        <div className={s.bar()}>
          <Slider
            label={labels.seek}
            min={0}
            max={duration || 1}
            step={0.1}
            value={Math.min(time, duration || 1)}
            onValueChange={seek}
            formatValue={(v) => labels.time(formatClock(v), formatClock(duration))}
            disabled={!duration}
            className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
          />
          <div className={s.row()}>
            <button type="button" className={s.button()} aria-label={playing ? labels.pause : labels.play} onClick={toggle}>
              {playing ? <PauseGlyph className="h-5 w-5" /> : <PlayGlyph className="h-5 w-5" />}
            </button>
            <button type="button" className={s.button()} aria-label={muted ? labels.unmute : labels.mute} onClick={toggleMute}>
              <VolumeGlyph muted={muted} className="h-5 w-5" />
            </button>
            <div className={s.volume()}>
              <Slider label={labels.volume} min={0} max={1} step={0.05} value={muted ? 0 : volume} onValueChange={changeVolume} formatValue={(v) => `${Math.round(v * 100)} %`} className="w-full" />
            </div>
            <span className={s.time()} aria-hidden>
              {formatClock(time)} / {formatClock(duration)}
            </span>
            <span className="flex-1" />
            {playbackRates.length > 1 && (
              <button type="button" className={s.button()} aria-label={labels.speed(rate)} onClick={cycleRate}>
                {rate}×
              </button>
            )}
            {tracks.length > 0 && (
              <button type="button" className={s.button()} aria-pressed={caption >= 0} aria-label={labels.captions(caption >= 0 ? (tracks[caption]?.label ?? null) : null)} onClick={cycleCaption}>
                <CaptionsGlyph className="h-5 w-5" />
              </button>
            )}
            {pipSupported && (
              <button type="button" className={s.button()} aria-label={labels.pictureInPicture} onClick={pip}>
                <PipGlyph className="h-5 w-5" />
              </button>
            )}
            <button type="button" className={s.button()} aria-label={fullscreen ? labels.exitFullscreen : labels.fullscreen} onClick={toggleFullscreen}>
              <FullscreenGlyph exit={fullscreen} className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
