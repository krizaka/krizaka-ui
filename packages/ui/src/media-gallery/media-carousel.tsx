// Client (the slide in view, the clock, the reader's motion, data and sound choices). Carousel v2 (ADR-010): a sequence of
// clips, screen demos and stills given as data, one at a time in one frame. The slides cross-fade in place (nothing
// travels); previous / next sit in a toolbar that also takes ← → Home End, a swipe turns one slide, a « n / N » count.
// With `autoplay` it advances by itself at the media's pace — the clock IS the CSS animation of the current progress
// tick, so holding it (the pause button, the pointer, the keyboard focus, a hidden tab, off screen) keeps it where it
// stood. Under reduced motion or Save-Data nothing advances and no clip is mounted: the posters and the buttons.
// Posters first, one clip (the slide in view) after the page's `load`; a clip that cannot play leaves its poster. Sound is
// an option: after a press on « Sound on », hovering or focusing the carousel plays the slide's audio.
import * as React from "react";
import { tv } from "tailwind-variants";

import { IconButton } from "../button/button";
import { ChevronGlyph, PauseGlyph, PlayGlyph, VolumeGlyph } from "../glyphs";
import { clamp, playSafely, useCalm, useInView, usePageHidden, usePageLoaded } from "../media";
import { MediaPlayer, type MediaPlayerProps } from "./media-player";

export const mediaCarousel = tv({
  slots: {
    root: "relative isolate w-full min-w-0",
    stage: "relative isolate w-full overflow-hidden bg-media",
    track: "m-0 grid list-none p-0 touch-pan-y",
    slide: "relative col-start-1 row-start-1 m-0 w-full overflow-hidden opacity-0 transition-opacity duration-500 motion-reduce:transition-none data-[active]:opacity-100",
    media: "absolute inset-0 h-full w-full object-cover",
    caption: "absolute inset-x-0 bottom-0 bg-linear-to-t from-scrim-strong to-transparent p-3 pt-8 text-xs font-semibold text-fg-on-media",
    ticks: "pointer-events-none absolute inset-x-3 bottom-2.5 z-10 flex gap-1.5",
    tick: "relative h-0.5 flex-1 overflow-hidden bg-fg-on-media/30 data-[state=done]:bg-fg-on-media data-[state=full]:bg-[var(--kz-hue,var(--kz-accent))]",
    fill: "kz-media-carousel-fill absolute inset-0 bg-[var(--kz-hue,var(--kz-accent))]",
    mark: "absolute top-0 h-full w-px bg-media",
    bar: "mt-3 flex items-start justify-between gap-3",
    barCaption: "m-0 min-w-0 font-mono text-[13px] leading-[19px] text-fg-secondary [overflow-wrap:anywhere]",
    count: "text-xs tabular-nums text-fg-secondary",
    buttons: "flex flex-none gap-2",
    text: "mt-2.5 text-sm text-fg-secondary [&_li]:my-1",
  },
  variants: {
    frame: {
      product: { stage: "rounded-xl border border-border-default" },
      cahier: { stage: "rounded-none border border-border-strong shadow-[4px_4px_0_var(--kz-border-strong)]", count: "mr-2.5 font-mono text-fg-primary" },
    },
  },
  defaultVariants: { frame: "product" },
});

/** What a slide is: a clip (a short generated or filmed shot), a screen demo (a product journey, often with chapters), a still. */
export type CarouselSlideKind = "clip" | "screen-demo" | "still";
/** A step of a screen demo: where it starts, in seconds, and its name. */
export type CarouselChapter = { at: number; label: string };

export type CarouselSlide = {
  /** A stable id. */
  id: string;
  /** What it is. Default: `clip` with a `video`, `still` without. */
  kind?: CarouselSlideKind;
  /** The poster of a clip or a film, or the still: 16:9, drawn first. */
  src: string;
  /** What it shows, in words. */
  alt: string;
  /** « Fig. 1a — … »: over the foot of the slide, or in the bar with `caption="bar"`. */
  caption?: string;
  /** The slide's line in the text version; `alt` when absent. */
  text?: string;
  /** The clip: one rendition, two encodes (VP9 `webm` first, H.264 `mp4` for Safari). Muted; plays while the slide is in view, on screen, after the page's `load`; never under reduced motion or Save-Data. */
  video?: { webm?: string; mp4?: string };
  /** The clip's length in seconds, as measured on the file (`krizaka-media-guard` reports it): with `autoplay`, the slide's time on screen. */
  duration?: number;
  /** The clip's file has an audio track (the guard checks it says the truth): « Sound on » can then play it. */
  audio?: boolean;
  /** A screen demo's steps: marks on the progress tick, the caption follows the step under the playhead, listed in the text version. */
  chapters?: readonly CarouselChapter[];
  /** A film opened by a press, with sound, in the lightbox of the MediaPlayer. */
  film?: Pick<MediaPlayerProps, "src" | "title" | "tracks" | "loadHls" | "labels" | "ratio"> & { playLabel: string; vertical?: boolean };
};

export type MediaCarouselLabels = {
  previous: string;
  next: string;
  close: string;
  /** A slide's name, with `{n}` and `{total}`. */
  slide: string;
  /** The pause button while something moves. */
  pause: string;
  /** The same button once paused. */
  play: string;
  /** The sound toggle (pressed or not). */
  soundOn: string;
  /** The summary of the text version. */
  textVersion: string;
  /** The carousel's role description (`aria-roledescription`). */
  carousel: string;
  /** A slide's role description. */
  slideRole: string;
};
export const mediaCarouselLabels: MediaCarouselLabels = {
  previous: "Previous",
  next: "Next",
  close: "Close",
  slide: "{n} of {total}",
  pause: "Pause the carousel",
  play: "Play the carousel",
  soundOn: "Sound on",
  textVersion: "Text version",
  carousel: "carousel",
  slideRole: "slide",
};

/** The bounds of a slide's time on screen, in seconds. */
export type CarouselAutoplay = { minDwell?: number; maxDwell?: number };

// @fixed: the shortest time a slide stays, in seconds: reading a caption (ADR-010 §3), not a setting.
export const CAROUSEL_MIN_DWELL = 5;
// @fixed: the longest, in seconds: the longest screen journey of a product demo (krizaka-internal#2655).
export const CAROUSEL_MAX_DWELL = 45;
// @fixed: a still (or a clip of unknown length) stays a reading time and a breath, in seconds.
const STILL_EXTRA = 1.5;

/** How long a slide stays with `autoplay`, in milliseconds: its media's duration within the bounds, or a reading time for a still. */
export function carouselDwell(slide: Pick<CarouselSlide, "duration" | "video">, bounds: CarouselAutoplay = {}): number {
  const min = bounds.minDwell ?? CAROUSEL_MIN_DWELL;
  const max = Math.max(min, bounds.maxDwell ?? CAROUSEL_MAX_DWELL);
  const seconds = slide.video && slide.duration && slide.duration > 0 ? clamp(slide.duration, min, max) : clamp(min + STILL_EXTRA, min, max);
  return Math.round(seconds * 1000);
}

/** The chapter under the playhead: the last one that has started. */
export function chapterAt(chapters: readonly CarouselChapter[] | undefined, seconds: number): number {
  if (!chapters?.length) return -1;
  let found = -1;
  chapters.forEach((c, i) => {
    if (seconds >= c.at) found = i;
  });
  return found;
}

export type MediaCarouselProps = Omit<React.ComponentProps<"section">, "children"> & {
  /** The slides, in order. */
  slides: readonly CarouselSlide[];
  /** The carousel's accessible name, passed translated. */
  label: string;
  /** The frame ratio of every slide (width / height). Default `16 / 9`, the house ratio. */
  ratio?: string;
  /** Advances by itself (wrapping), each slide for its `duration` within the bounds (`true`: 5–45 s). Never under reduced motion or Save-Data; held by the pause button, a hidden tab, off screen (and, with `holds="pointer-focus"`, the pointer and a keyboard focus). */
  autoplay?: boolean | CarouselAutoplay;
  /** What holds the autoplay clock besides the visible pause, a hidden tab, off screen, reduced motion and Save-Data. `pause-only` (default, WCAG 2.2.2): nothing else, so a resting pointer or a click on next never freezes it. `pointer-focus`: the pointer (not a touch) and a keyboard focus inside hold it too. */
  holds?: "pause-only" | "pointer-focus";
  /** Offers « Sound on » when a slide declares `audio`: after the press, hovering or focusing the carousel plays that slide's sound. Never without the press. */
  sound?: boolean;
  /** `product` (default): the product register's rounded frame. `cahier`: the company's sites — square, a solid paper shadow, the count in the typewriter face. */
  frame?: "product" | "cahier";
  /** Where a slide's caption sits: over its foot (`overlay`, default) or in the bar under the frame (`bar`). */
  caption?: "overlay" | "bar";
  /** Renders the text version under the carousel: every slide's caption and text (and chapters), in a native `<details>`. */
  textVersion?: boolean;
  /** Rendered inside the text version (the host's sources, a link to the film); after the carousel without one. */
  children?: React.ReactNode;
  /** The words, passed translated; English by default. `slide` takes `{n}` and `{total}`. */
  labels?: Partial<MediaCarouselLabels>;
  /** The words of the lightbox player of every film (speed, captions, time…), passed translated; a slide's own `film.labels` wins. */
  playerLabels?: MediaPlayerProps["labels"];
  /** Called with the index of the slide in view when it changes. */
  onSlideChange?: (index: number) => void;
  /**
   * Draws a slide's `video` in place of the carousel's own clip.
   * @deprecated Since carousel v2 (ADR-010) the carousel draws its clips itself, with its pause in the toolbar. Removed in 4.0.
   */
  renderLoop?: (video: NonNullable<CarouselSlide["video"]>, context: { poster: string; inView: boolean }) => React.ReactNode;
};

const CLOCK_CSS =
  ".kz-media-carousel-fill{transform-origin:left;transform:scaleX(0);animation-name:kz-media-carousel-fill;animation-timing-function:linear;animation-fill-mode:forwards}" +
  "@keyframes kz-media-carousel-fill{from{transform:scaleX(0)}to{transform:scaleX(1)}}";

/** How far a swipe travels, in CSS pixels, before it turns the slide. */
const SWIPE_DISTANCE = 40;
const SOUND_KEY = "kz-media-carousel-sound";
const SOUND_EVENT = "kz-media-carousel-sound";

/** A horizontal swipe turns one slide; a vertical one stays the page's scroll (`touch-action: pan-y`). */
function useSwipe(turn: (delta: 1 | -1) => void) {
  const from = React.useRef<number | null>(null);
  return {
    onPointerDown: (event: React.PointerEvent) => {
      from.current = event.clientX;
    },
    onPointerUp: (event: React.PointerEvent) => {
      const start = from.current;
      from.current = null;
      if (start === null) return;
      const distance = event.clientX - start;
      if (Math.abs(distance) >= SWIPE_DISTANCE) turn(distance < 0 ? 1 : -1);
    },
    onPointerCancel: () => {
      from.current = null;
    },
  };
}

const subscribeSound = (notify: () => void) => {
  globalThis.addEventListener(SOUND_EVENT, notify);
  return () => globalThis.removeEventListener(SOUND_EVENT, notify);
};
const readSound = () => {
  try {
    return globalThis.sessionStorage.getItem(SOUND_KEY) === "1";
  } catch {
    return false;
  }
};
/** The visitor's choice of sound, for this session (off on the server and before any press). */
function useSoundChoice(): [boolean, () => void] {
  const on = React.useSyncExternalStore(subscribeSound, readSound, () => false);
  const toggle = () => {
    try {
      globalThis.sessionStorage.setItem(SOUND_KEY, on ? "0" : "1");
    } catch {
      // No storage (a private window): the choice holds until the next render only.
    }
    globalThis.dispatchEvent(new Event(SOUND_EVENT));
  };
  return [on, toggle];
}

/** The keyboard put the focus there (`:focus-visible`): only then does a focus hold the clock; a click does not. */
function keyboardFocus(target: EventTarget | null): boolean {
  try {
    return target instanceof Element && target.matches(":focus-visible");
  } catch {
    return true;
  }
}

/** At an end the button just used is disabled: the focus moves to the other one, never to the page. */
function keepFocus(toolbar: HTMLElement | null, at: number, count: number) {
  if (!toolbar?.contains(document.activeElement)) return;
  const buttons = toolbar.querySelectorAll("button");
  const previous = buttons[0];
  const next = buttons[buttons.length - 1];
  if (at === 0) next?.focus();
  if (at === count - 1) previous?.focus();
}

type ClipProps = Readonly<{
  video: NonNullable<CarouselSlide["video"]>;
  poster: string;
  playing: boolean;
  muted: boolean;
  onBroken: () => void;
  onTime?: (seconds: number) => void;
}>;

/** The slide's clip: muted until the sound is chosen, looping while its slide stays (never a held last frame), gone if no source plays. */
function SlideClip({ video, poster, playing, muted, onBroken, onTime }: ClipProps) {
  const ref = React.useRef<HTMLVideoElement>(null);
  React.useEffect(() => {
    if (ref.current) ref.current.muted = muted;
  }, [muted]);
  React.useEffect(() => {
    if (!ref.current) return;
    if (playing) playSafely(ref.current);
    else ref.current.pause?.();
  }, [playing]);
  const last = video.mp4 ? "mp4" : "webm";
  return (
    <video
      ref={ref}
      className={mediaCarousel().media()}
      poster={poster}
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden
      tabIndex={-1}
      onTimeUpdate={onTime ? (e) => onTime(e.currentTarget.currentTime) : undefined}
    >
      {video.webm && <source src={video.webm} type="video/webm" onError={last === "webm" ? onBroken : undefined} />}
      {video.mp4 && <source src={video.mp4} type="video/mp4" onError={onBroken} />}
    </video>
  );
}

type SlideMediaProps = Readonly<{ slide: CarouselSlide; first: boolean; drawn: boolean; clip: React.ReactNode; ratio: string; closeLabel: string; overlay: boolean; playerLabels?: MediaPlayerProps["labels"] }>;

/** A poster that opens its film, or a still; its clip plays over it while the slide is the one in view. */
function SlideMedia({ slide, first, drawn, clip, ratio, closeLabel, overlay, playerLabels }: SlideMediaProps) {
  const s = mediaCarousel();
  if (slide.film) {
    return (
      <MediaPlayer
        {...slide.film}
        labels={slide.film.labels ?? playerLabels}
        mode="lightbox"
        poster={slide.src}
        posterAlt={slide.alt}
        caption={overlay ? slide.caption : undefined}
        closeLabel={closeLabel}
        preview={clip}
        className="h-full rounded-none border-0"
      />
    );
  }
  return (
    <>
      {drawn && <img src={slide.src} alt={slide.alt} loading={first ? undefined : "lazy"} decoding="async" draggable={false} className={s.media()} style={{ aspectRatio: ratio }} />}
      {clip}
      {overlay && slide.caption && <figcaption className={s.caption()}>{slide.caption}</figcaption>}
    </>
  );
}

/** A tick's state: before the current one, the current one (filling, or full when nothing advances), still to come. */
function tickState(i: number, active: number, filling: boolean): "done" | "now" | "full" | undefined {
  if (i < active) return "done";
  if (i !== active) return undefined;
  return filling ? "now" : "full";
}

/** A screen demo's steps, as marks on its progress tick (where each starts, over the clip's length). */
function ChapterMarks({ slide, className }: Readonly<{ slide: CarouselSlide; className: string }>) {
  const length = slide.duration ?? 0;
  if (!slide.chapters?.length || length <= 0) return null;
  return slide.chapters.map((c) => <i key={c.at} className={className} style={{ left: `${(c.at / length) * 100}%` }} />);
}

/** The step of the current slide under the playhead, followed only for a slide with chapters. */
function useChapter(slide: CarouselSlide | undefined) {
  const [chapter, setChapter] = React.useState(-1);
  const [shown, setShown] = React.useState(slide?.id);
  if (shown !== slide?.id) {
    setShown(slide?.id);
    setChapter(-1);
  }
  const onTime = slide?.chapters?.length ? (seconds: number) => setChapter(chapterAt(slide.chapters, seconds)) : undefined;
  return { chapter: slide?.chapters?.[chapter], onTime };
}

/** What holds the clock and what lets the sound play: the pointer (not a touch), any focus inside, a keyboard focus inside. */
function useHolds() {
  const [hovered, setHovered] = React.useState(false);
  const [focusIn, setFocusIn] = React.useState(false);
  const [keyboardIn, setKeyboardIn] = React.useState(false);
  const handlers = {
    onPointerEnter: (e: React.PointerEvent) => setHovered(e.pointerType !== "touch"),
    onPointerLeave: () => setHovered(false),
    onFocus: (e: React.FocusEvent) => {
      setFocusIn(true);
      setKeyboardIn(keyboardFocus(e.target));
    },
    onBlur: (e: React.FocusEvent) => {
      if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
      setFocusIn(false);
      setKeyboardIn(false);
    },
  };
  return { hovered, focusIn, keyboardIn, handlers };
}

type TicksProps = Readonly<{ slides: readonly CarouselSlide[]; active: number; calm: boolean; dwell: number; advancing: boolean; onEnd: () => void; s: ReturnType<typeof mediaCarousel> }>;

/** One hairline per slide; the current one fills over its dwell — the clock — and holds with the carousel. */
function CarouselTicks({ slides, active, calm, dwell, advancing, onEnd, s }: TicksProps) {
  return (
    <div className={s.ticks()} aria-hidden>
      {slides.map((slide, i) => (
        <span key={slide.id} className={s.tick()} data-state={tickState(i, active, !calm)}>
          {i === active && !calm && (
            <span
              key={`${active}`}
              className={s.fill()}
              style={{ animationDuration: `${dwell}ms`, animationPlayState: advancing ? "running" : "paused" }}
              onAnimationEnd={() => advancing && onEnd()}
            />
          )}
          {i === active && <ChapterMarks slide={slide} className={s.mark()} />}
        </span>
      ))}
    </div>
  );
}

type ToolbarProps = Readonly<{
  labels: MediaCarouselLabels;
  turns: boolean;
  atStart: boolean;
  atEnd: boolean;
  moving: boolean;
  paused: boolean;
  onPause: () => void;
  sound: { shown: boolean; on: boolean; toggle: () => void };
  onTurn: (delta: number) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  className: string;
}>;

/** Previous, pause / play, « Sound on », next: one toolbar that also takes ← → Home End. */
const CarouselToolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(function CarouselToolbar(
  { labels, turns, atStart, atEnd, moving, paused, onPause, sound, onTurn, onKeyDown, className },
  ref,
) {
  return (
    <div ref={ref} role="toolbar" aria-orientation="horizontal" className={className} onKeyDown={onKeyDown}>
      {turns && (
        <IconButton variant="secondary" label={labels.previous} disabled={atStart} onClick={() => onTurn(-1)}>
          <ChevronGlyph direction="left" className="h-5 w-5" />
        </IconButton>
      )}
      {moving && (
        <IconButton variant="secondary" label={paused ? labels.play : labels.pause} aria-pressed={paused} onClick={onPause}>
          {paused ? <PlayGlyph className="h-4 w-4" /> : <PauseGlyph className="h-4 w-4" />}
        </IconButton>
      )}
      {sound.shown && (
        <IconButton variant="secondary" label={labels.soundOn} aria-pressed={sound.on} onClick={sound.toggle}>
          <VolumeGlyph muted={!sound.on} className="h-4 w-4" />
        </IconButton>
      )}
      {turns && (
        <IconButton variant="secondary" label={labels.next} disabled={atEnd} onClick={() => onTurn(1)}>
          <ChevronGlyph direction="right" className="h-5 w-5" />
        </IconButton>
      )}
    </div>
  );
});

/** Every slide's caption and text, and a screen demo's chapters, in a native `<details>`; the host's `children` inside. */
function TextVersion({ slides, summary, className, children }: Readonly<{ slides: readonly CarouselSlide[]; summary: string; className: string; children?: React.ReactNode }>) {
  return (
    <details className={className}>
      <summary>{summary}</summary>
      <ol>
        {slides.map((slide) => (
          <li key={slide.id}>
            {slide.caption && <b>{slide.caption}</b>} {slide.text ?? slide.alt}
            {slide.chapters?.length ? (
              <ol>
                {slide.chapters.map((c) => (
                  <li key={c.at}>{c.label}</li>
                ))}
              </ol>
            ) : null}
          </li>
        ))}
      </ol>
      {children}
    </details>
  );
}

/** The caption shown in the bar: the slide's, with the chapter under the playhead. */
function barCaptionOf(placement: "overlay" | "bar", slide: CarouselSlide | undefined, chapter: CarouselChapter | undefined) {
  if (placement !== "bar" || !slide?.caption) return undefined;
  return chapter ? [slide.caption, chapter.label].join(" · ") : slide.caption;
}

/** A sequence of clips, screen demos and stills, one at a time: buttons, arrow keys, swipe, and with `autoplay` it advances at the media's pace. */
export function MediaCarousel({
  slides,
  label,
  ratio = "16 / 9",
  autoplay,
  holds = "pause-only",
  sound,
  frame = "product",
  caption = "overlay",
  textVersion,
  children,
  labels: given,
  playerLabels,
  onSlideChange,
  renderLoop,
  className,
  ...props
}: Readonly<MediaCarouselProps>) {
  const labels = { ...mediaCarouselLabels, ...given };
  const s = mediaCarousel({ frame });
  const total = slides.length;
  const root = React.useRef<HTMLElement>(null);
  const toolbar = React.useRef<HTMLDivElement>(null);
  const calm = useCalm();
  const loaded = usePageLoaded();
  const hidden = usePageHidden();
  const [soundChosen, toggleSound] = useSoundChoice();
  const [active, setActive] = React.useState(0);
  const [seen, setSeen] = React.useState<ReadonlySet<number>>(() => new Set([0]));
  const [broken, setBroken] = React.useState<ReadonlySet<string>>(() => new Set());
  const [paused, setPaused] = React.useState(false);
  const { hovered, focusIn, keyboardIn, handlers } = useHolds();
  const [onScreen, setOnScreen] = React.useState(() => typeof IntersectionObserver === "undefined");
  useInView(root, setOnScreen);

  const current = slides[active];
  const { chapter, onTime } = useChapter(current);
  const bounds = typeof autoplay === "object" ? autoplay : {};
  const wraps = Boolean(autoplay) && total > 1;
  const ownClips = !renderLoop && slides.some((slide) => slide.video);
  const moving = !calm && (wraps || ownClips);
  const held = holds === "pointer-focus" && (hovered || keyboardIn);
  const advancing = wraps && !calm && !paused && !held && onScreen && !hidden;
  const clipPlaying = onScreen && !paused && !hidden;
  const hasAudio = Boolean(sound) && !calm && ownClips && slides.some((slide) => slide.audio && slide.video);
  const audible = hasAudio && soundChosen && Boolean(current?.audio) && (hovered || focusIn);

  const show = (to: number) => {
    setActive(to);
    setSeen((before) => new Set(before).add(to));
    onSlideChange?.(to);
  };
  const turn = (delta: number) => {
    const to = wraps ? (active + delta + total) % total : clamp(active + delta, 0, total - 1);
    if (to === active) return;
    show(to);
    if (!wraps) keepFocus(toolbar.current, to, total);
  };
  const swipe = useSwipe(turn);
  const keys = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const moves: Partial<Record<string, () => void>> = {
      ArrowRight: () => turn(1),
      ArrowLeft: () => turn(-1),
      Home: () => turn(-active),
      End: () => turn(total - 1 - active),
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    move();
  };
  const name = (i: number) => labels.slide.replace("{n}", String(i + 1)).replace("{total}", String(total));
  const clipOf = (slide: CarouselSlide, i: number): React.ReactNode => {
    if (!slide.video) return null;
    if (renderLoop) return renderLoop(slide.video, { poster: slide.src, inView: i === active });
    if (i !== active || calm || !loaded || broken.has(slide.id)) return null;
    return (
      <SlideClip
        key={slide.id}
        video={slide.video}
        poster={slide.src}
        playing={clipPlaying}
        muted={!audible}
        onTime={onTime}
        onBroken={() => setBroken((before) => new Set(before).add(slide.id))}
      />
    );
  };
  const dwell = current ? carouselDwell(current, bounds) : 0;
  const barCaption = barCaptionOf(caption, current, chapter);
  const showBar = total > 1 || moving || Boolean(barCaption);

  return (
    <section
      ref={root}
      aria-roledescription={labels.carousel}
      aria-label={label}
      data-frame={frame}
      data-advancing={advancing ? "" : undefined}
      className={s.root({ className })}
      {...handlers}
      {...props}
    >
      {wraps && (
        <style href="kz-media-carousel" precedence="medium">
          {CLOCK_CSS}
        </style>
      )}
      <div className={s.stage()} style={{ aspectRatio: ratio }}>
        <ul className={s.track()} {...swipe}>
          {slides.map((slide, i) => {
            const here = i === active;
            return (
              <li
                key={slide.id}
                aria-roledescription={labels.slideRole}
                aria-label={name(i)}
                data-kind={slide.kind ?? (slide.video ? "clip" : "still")}
                data-active={here ? "" : undefined}
                className={s.slide()}
                style={{ aspectRatio: ratio }}
                aria-hidden={here ? undefined : true}
                inert={here ? undefined : true}
              >
                <figure className="m-0 h-full w-full">
                  <SlideMedia
                    slide={slide}
                    first={i === 0}
                    drawn={seen.has(i) || i === (active + 1) % total}
                    clip={clipOf(slide, i)}
                    ratio={ratio}
                    closeLabel={labels.close}
                    overlay={caption === "overlay"}
                    playerLabels={playerLabels}
                  />
                </figure>
              </li>
            );
          })}
        </ul>
        {wraps && <CarouselTicks slides={slides} active={active} calm={calm} dwell={dwell} advancing={advancing} onEnd={() => turn(1)} s={s} />}
      </div>
      {showBar && (
        <div className={s.bar()}>
          <p className={s.barCaption()} aria-live={advancing ? "off" : "polite"}>
            {total > 1 && (
              <span className={s.count()}>
                {active + 1} / {total}
              </span>
            )}
            {barCaption && <> {barCaption}</>}
          </p>
          <CarouselToolbar
            ref={toolbar}
            labels={labels}
            turns={total > 1}
            atStart={!wraps && active === 0}
            atEnd={!wraps && active === total - 1}
            moving={moving}
            paused={paused}
            onPause={() => setPaused((p) => !p)}
            sound={{ shown: hasAudio, on: soundChosen, toggle: toggleSound }}
            onTurn={turn}
            onKeyDown={keys}
            className={s.buttons()}
          />
        </div>
      )}
      {textVersion ? (
        <TextVersion slides={slides} summary={labels.textVersion} className={s.text()}>
          {children}
        </TextVersion>
      ) : (
        children
      )}
    </section>
  );
}
