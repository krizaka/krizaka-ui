// Client (the slide in view, the reader's motion preference). A few realisations in one frame: a scroll-snap track moved by
// a swipe, previous / next buttons in a toolbar that also takes the arrow keys, a « n / N » count. Nothing advances by itself and nothing moves under the pointer; a loop plays only on the
// slide in view (a still under reduced motion); a slide with a film opens it in the MediaPlayer lightbox.
import * as React from "react";
import { tv } from "tailwind-variants";

import { IconButton } from "../button/button";
import { ChevronGlyph } from "../glyphs";
import { usePrefersReducedMotion } from "../media";
import { MediaPlayer, type MediaPlayerProps } from "./media-player";
import { loopLabels, LoopToggle, LoopVideo, useLoop } from "./pausable-loop";

export const mediaCarousel = tv({
  slots: {
    root: "relative isolate w-full",
    track: "m-0 flex list-none snap-x snap-mandatory gap-3 overflow-hidden p-0 touch-pan-y",
    slide: "relative m-0 w-full shrink-0 snap-center overflow-hidden rounded-xl border border-border-default bg-media",
    media: "absolute inset-0 h-full w-full object-cover",
    caption: "absolute inset-x-0 bottom-0 bg-linear-to-t from-scrim-strong to-transparent p-3 pt-8 text-xs font-semibold text-fg-on-media",
    bar: "mt-3 flex items-center justify-between gap-3",
    count: "text-xs tabular-nums text-fg-secondary",
    buttons: "flex gap-2",
  },
});
const s = mediaCarousel();

export type CarouselSlide = {
  /** A stable id. */
  id: string;
  /** The still, or the poster of a loop or a film. */
  src: string;
  /** What it shows, in words. */
  alt: string;
  /** « Fig. 1a »: one line over the foot of the slide. */
  caption?: string;
  /** A muted loop playing while the slide is the one in view and on screen, after the page's `load`, with a visible pause; a still under reduced motion. On a `film` slide it previews the film. */
  video?: { webm?: string; mp4?: string };
  /** A film opened by a press, with sound, in the lightbox of the MediaPlayer. */
  film?: Pick<MediaPlayerProps, "src" | "title" | "tracks" | "loadHls" | "labels" | "ratio"> & { playLabel: string; vertical?: boolean };
};

export type MediaCarouselLabels = { previous: string; next: string; close: string; slide: string; pauseLoop: string; playLoop: string };
export const mediaCarouselLabels: MediaCarouselLabels = {
  previous: "Previous",
  next: "Next",
  close: "Close",
  slide: "{n} of {total}",
  pauseLoop: loopLabels.pause,
  playLoop: loopLabels.play,
};

export type MediaCarouselProps = Omit<React.ComponentProps<"section">, "children"> & {
  /** The slides, in order: 3 to 4 realisations. */
  slides: readonly CarouselSlide[];
  /** The carousel's accessible name, passed translated. */
  label: string;
  /** The frame ratio of every slide (width / height). Default `16 / 10`. */
  ratio?: string;
  /** The words, passed translated; English by default. `slide` takes `{n}` and `{total}`. */
  labels?: Partial<MediaCarouselLabels>;
  /** The words of the lightbox player of every film (speed, captions, time…), passed translated; a slide's own `film.labels` wins. */
  playerLabels?: MediaPlayerProps["labels"];
};

/** How far a swipe travels, in CSS pixels, before it turns the slide. */
const SWIPE_DISTANCE = 40;

/** The slide in view and the one way to change it: the track scrolls only from here, so it holds no scroll of its own to reach. */
function useActiveSlide(track: React.RefObject<HTMLUListElement | null>, count: number) {
  const [active, setActive] = React.useState(0);
  const reduce = usePrefersReducedMotion();
  const go = (to: number) => {
    const el = track.current;
    if (!el) return active;
    const next = Math.min(count - 1, Math.max(0, to));
    el.scrollTo({ left: next * (el.scrollWidth / count), behavior: reduce ? "auto" : "smooth" });
    setActive(next);
    return next;
  };
  return { active, go };
}

/** A horizontal swipe on the track turns one slide; a vertical one stays the page's scroll (`touch-action: pan-y`). */
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

/** At an end the button just used is disabled: the focus moves to the other one, never to the page. */
function keepFocus(toolbar: HTMLElement | null, at: number, count: number) {
  if (!toolbar?.contains(document.activeElement) || count < 2) return;
  const [previous, next] = toolbar.querySelectorAll("button");
  if (at === 0) next?.focus();
  if (at === count - 1) previous?.focus();
}

/** The arrow keys of the toolbar: right turns forward, left back. */
const ARROWS: Partial<Record<string, 1 | -1>> = { ArrowRight: 1, ArrowLeft: -1 };

type SlideMediaProps = Readonly<{ slide: CarouselSlide; inView: boolean; ratio: string; labels: MediaCarouselLabels; playerLabels?: MediaPlayerProps["labels"] }>;

function SlideMedia(props: SlideMediaProps) {
  return props.slide.film ? <FilmSlide {...props} /> : <StillSlide {...props} />;
}

const loopWords = (labels: MediaCarouselLabels) => ({ pause: labels.pauseLoop, play: labels.playLoop });

/** A poster that opens its film; its loop, when it has one, previews the film. */
function FilmSlide({ slide, labels, playerLabels }: SlideMediaProps) {
  if (!slide.film) return null;
  const { playLabel, vertical, labels: own, ...film } = slide.film;
  return (
      <MediaPlayer
        {...film}
        labels={own ?? playerLabels}
        mode="lightbox"
        poster={slide.src}
        posterAlt={slide.alt}
        playLabel={playLabel}
        vertical={vertical}
        caption={slide.caption}
        closeLabel={labels.close}
        preview={slide.video}
        previewLabels={loopWords(labels)}
        className="h-full rounded-none border-0"
      />
  );
}

/** A still, with a loop over it while the slide is the one in view. */
function StillSlide({ slide, inView, ratio, labels }: SlideMediaProps) {
  const loop = useLoop(inView);
  return (
    <>
      <img src={slide.src} alt={slide.alt} loading="lazy" decoding="async" draggable={false} className={s.media()} style={{ aspectRatio: ratio }} />
      {slide.video && <LoopVideo loop={loop} sources={slide.video} poster={slide.src} className={s.media()} />}
      {slide.caption && <figcaption className={s.caption()}>{slide.caption}</figcaption>}
      {slide.video && <LoopToggle loop={loop} labels={loopWords(labels)} />}
    </>
  );
}

/** A few realisations in one frame, one at a time: swipe, buttons or arrow keys on them; nothing advances by itself. */
export function MediaCarousel({ slides, label, ratio = "16 / 10", labels: given, playerLabels, className, ...props }: Readonly<MediaCarouselProps>) {
  const labels = { ...mediaCarouselLabels, ...given };
  const track = React.useRef<HTMLUListElement>(null);
  const toolbar = React.useRef<HTMLDivElement>(null);
  const { active, go } = useActiveSlide(track, slides.length);
  const turn = (delta: 1 | -1) => keepFocus(toolbar.current, go(active + delta), slides.length);
  const swipe = useSwipe(turn);
  const keys = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const delta = ARROWS[event.key];
    if (!delta) return;
    event.preventDefault();
    turn(delta);
  };
  const name = (i: number) => labels.slide.replace("{n}", String(i + 1)).replace("{total}", String(slides.length));
  return (
    <section aria-roledescription="carousel" aria-label={label} className={s.root({ className })} {...props}>
      <ul ref={track} className={s.track()} {...swipe}>
        {slides.map((slide, i) => (
          <li key={slide.id} aria-roledescription="slide" aria-label={name(i)} className={s.slide()} style={{ aspectRatio: ratio }} aria-hidden={i === active ? undefined : true} inert={i === active ? undefined : true}>
            <figure className="m-0 h-full w-full">
              <SlideMedia slide={slide} inView={i === active} ratio={ratio} labels={labels} playerLabels={playerLabels} />
            </figure>
          </li>
        ))}
      </ul>
      {slides.length > 1 && (
      <div className={s.bar()}>
        <span className={s.count()} aria-live="polite">{active + 1} / {slides.length}</span>
        <div ref={toolbar} role="toolbar" aria-orientation="horizontal" className={s.buttons()} onKeyDown={keys}>
          <IconButton variant="secondary" label={labels.previous} disabled={active === 0} onClick={() => turn(-1)}>
            <ChevronGlyph direction="left" className="h-5 w-5" />
          </IconButton>
          <IconButton variant="secondary" label={labels.next} disabled={active === slides.length - 1} onClick={() => turn(1)}>
            <ChevronGlyph direction="right" className="h-5 w-5" />
          </IconButton>
        </div>
      </div>
      )}
    </section>
  );
}
