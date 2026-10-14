// Client (state, timers' observers, keys). A slideshow that advances by itself — and shows it: a segmented progress bar
// (one segment per slide, the current one fills over the interval, each one a button) with a counter, previous / next and a
// visible pause button (WCAG 2.2.2). The time IS the CSS animation of the current segment (`.kz-showcase-fill`):
// when it ends, the next slide comes — so what you see filling is exactly what decides, and pausing the animation pauses
// the show. Its two rules travel with the component (a hoisted, deduplicated <style>): no stylesheet to import. It waits while the pointer is over it, while a keyboard focus is inside, while the tab is hidden and while it
// is off screen; under reduced motion it never advances by itself. Slides are slots: any content.
import * as React from "react";

import { cn } from "../cn";

const FILL_CSS = ".kz-showcase-fill{transform-origin:left;animation:kz-showcase-fill 6s linear forwards}@keyframes kz-showcase-fill{from{transform:scaleX(0)}to{transform:scaleX(1)}}";
const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeNothing = () => () => undefined;
const readReduced = () => Boolean(typeof window !== "undefined" && window.matchMedia?.(REDUCED).matches);
function subscribeReduced(notify: () => void) {
  const query = window.matchMedia?.(REDUCED);
  query?.addEventListener?.("change", notify);
  return () => query?.removeEventListener?.("change", notify);
}
const readHidden = () => document.visibilityState === "hidden";
function subscribeVisibility(notify: () => void) {
  document.addEventListener("visibilitychange", notify);
  return () => document.removeEventListener("visibilitychange", notify);
}

export interface ShowcaseLabels {
  /** The previous button's name. */
  previous: string;
  /** The next button's name. */
  next: string;
  /** The pause button's name while it plays. */
  pause: string;
  /** The same button's name while it is paused. */
  play: string;
  /** A progress segment's name: `(3, 17) => "Go to image 3"`. */
  goTo: (n: number, total: number) => string;
  /** The position in words, beside the title: `(1, 17) => "Image 1 of 17"`. */
  counter: (n: number, total: number) => string;
  /** The slide's accessible name: `(1, 17) => "1 of 17"`. */
  slide: (n: number, total: number) => string;
}

/** English defaults — pass your own translated `labels`. */
export const showcaseLabels: ShowcaseLabels = {
  previous: "Previous slide",
  next: "Next slide",
  pause: "Pause the slideshow",
  play: "Play the slideshow",
  goTo: (n) => `Go to slide ${n}`,
  counter: (n, total) => `Slide ${n} of ${total}`,
  slide: (n, total) => `${n} of ${total}`,
};

export interface ShowcaseSlideState {
  index: number;
  /** The slide in view. */
  active: boolean;
}

export interface ShowcaseProps<T> extends Omit<React.ComponentProps<"section">, "children" | "onChange"> {
  /** The slideshow's accessible name (“Prompt to image”), passed translated. */
  label: string;
  /** The slides, in order. */
  items: readonly T[];
  /** A stable key for an item. */
  getId: (item: T) => string;
  /** One slide's content. Only the slide in view and its neighbours are mounted (the rest stay empty): give slides the same size. */
  renderItem: (item: T, state: ShowcaseSlideState) => React.ReactNode;
  /** A slide's title, shown before the counter (“Golden-hour editorial”). */
  getTitle?: (item: T) => string;
  /** Milliseconds a slide stays (the time the segment takes to fill). @default 6000 */
  interval?: number;
  /** Advances by itself. Never under `prefers-reduced-motion`. @default true */
  autoplay?: boolean;
  /** `fade` crossfades; `slide` also moves the slides a few pixels. @default "fade" */
  transition?: "fade" | "slide";
  /** After the last slide, go back to the first. @default true */
  loop?: boolean;
  /** The slide in view (controlled). */
  index?: number;
  /** The slide shown first. @default 0 */
  defaultIndex?: number;
  /** Called when the slide in view changes — `user` is true when the visitor asked for it. */
  onIndexChange?: (index: number, user: boolean) => void;
  /** The words of the controls, translated. */
  labels?: ShowcaseLabels;
}

/** An auto-advancing slideshow with a visible, clickable progress bar, a counter, prev / next and a pause button. */
export function Showcase<T>({
  label,
  items,
  getId,
  renderItem,
  getTitle,
  interval = 6000,
  autoplay = true,
  transition = "fade",
  loop = true,
  index: controlled,
  defaultIndex = 0,
  onIndexChange,
  labels = showcaseLabels,
  className,
  onKeyDown,
  onFocus,
  onBlur,
  onPointerEnter,
  onPointerLeave,
  ...props
}: ShowcaseProps<T>) {
  const total = items.length;
  const root = React.useRef<HTMLElement>(null);
  const [inner, setInner] = React.useState(defaultIndex);
  const current = Math.min(Math.max(controlled ?? inner, 0), Math.max(total - 1, 0));
  const mounted = React.useSyncExternalStore(subscribeNothing, () => true, () => false);
  const reduced = React.useSyncExternalStore(subscribeReduced, readReduced, () => false);
  const hidden = React.useSyncExternalStore(subscribeVisibility, readHidden, () => false);
  const [paused, setPaused] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const [inView, setInView] = React.useState(true);
  const [announce, setAnnounce] = React.useState(false);

  React.useEffect(() => {
    const host = root.current;
    if (!host || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => setInView(entries.some((e) => e.isIntersecting)), { threshold: 0.2 });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  const move = (to: number, user: boolean) => {
    if (total === 0) return;
    const next = loop ? (to + total) % total : Math.min(Math.max(to, 0), total - 1);
    if (next === current) return;
    setAnnounce(user);
    if (controlled === undefined) setInner(next);
    onIndexChange?.(next, user);
  };

  const playing = autoplay && mounted && !reduced && total > 1;
  const running = playing && !paused && !hover && !focus && !hidden && inView;
  const lastStop = !loop && current === total - 1;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target as HTMLElement;
    if (target.closest("input, textarea, select, [contenteditable='true']")) return;
    const to = event.key === "ArrowRight" ? current + 1 : event.key === "ArrowLeft" ? current - 1 : event.key === "Home" ? 0 : event.key === "End" ? total - 1 : null;
    if (to === null) return;
    event.preventDefault();
    move(to, true);
  };

  const item = items[current];
  const title = item !== undefined ? getTitle?.(item) : undefined;
  const button = "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-default bg-surface-1 text-fg-secondary transition-colors hover:text-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40";

  return (
    <section
      ref={root}
      aria-roledescription="carousel"
      aria-label={label}
      data-running={running ? "" : undefined}
      className={cn("flex flex-col gap-3", className)}
      onKeyDown={handleKeyDown}
      onPointerEnter={(e) => {
        onPointerEnter?.(e);
        if (e.pointerType === "mouse") setHover(true);
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        setHover(false);
      }}
      onFocus={(e) => {
        onFocus?.(e);
        // A mouse click on a button is not a reason to stop: only a keyboard focus is.
        let visible = true;
        try {
          visible = e.target.matches(":focus-visible");
        } catch {
          /* a stand-in without :focus-visible */
        }
        if (visible) setFocus(true);
      }}
      onBlur={(e) => {
        onBlur?.(e);
        if (!e.currentTarget.contains(e.relatedTarget)) setFocus(false);
      }}
      {...props}
    >
      <style href="kz-showcase" precedence="medium">
        {FILL_CSS}
      </style>
      <div aria-live={announce ? "polite" : "off"} className="grid grid-cols-[minmax(0,1fr)]">
        {items.map((slide, i) => {
          const active = i === current;
          const gap = Math.abs(i - current);
          const near = gap <= 1 || (loop && total - gap <= 1);
          const side = i < current ? "-translate-x-4" : "translate-x-4";
          return (
            <div
              key={getId(slide)}
              role="group"
              aria-roledescription="slide"
              aria-label={labels.slide(i + 1, total)}
              aria-hidden={active ? undefined : true}
              inert={active ? undefined : true}
              data-active={active ? "" : undefined}
              className={cn(
                "col-start-1 row-start-1 min-w-0 transition-[opacity,translate,visibility] duration-500 motion-reduce:transition-none",
                active ? "visible opacity-100" : "invisible opacity-0",
                transition === "slide" && (active ? "translate-x-0" : side),
              )}
            >
              {near ? renderItem(slide, { index: i, active }) : null}
            </div>
          );
        })}
      </div>

      <div className="flex gap-1">
        {items.map((slide, i) => (
          <button
            key={getId(slide)}
            type="button"
            aria-label={labels.goTo(i + 1, total)}
            aria-current={i === current ? "true" : undefined}
            tabIndex={i === current ? 0 : -1}
            onClick={() => move(i, true)}
            className="group/seg relative flex h-6 min-w-0 flex-1 cursor-pointer items-center rounded-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="relative block h-1 w-full overflow-hidden rounded-full bg-surface-3 transition-[height] group-hover/seg:h-1.5">
              {i < current || (i === current && (!playing || lastStop)) ? <span className="absolute inset-0 bg-accent" /> : null}
              {i === current && playing && !lastStop ? (
                <span
                  key={`${current}`}
                  data-segment-fill
                  className="kz-showcase-fill absolute inset-0 bg-accent"
                  style={{ animationDuration: `${interval}ms`, animationPlayState: running ? "running" : "paused" }}
                  onAnimationEnd={() => running && move(current + 1, false)}
                />
              ) : null}
            </span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <p className="m-0 min-w-0 flex-1 truncate text-sm text-fg-secondary">
          {title ? <span className="font-medium text-fg">{title}</span> : null}
          {title ? <span aria-hidden> · </span> : null}
          <span>{labels.counter(current + 1, total)}</span>
        </p>
        <div className="flex items-center gap-1.5">
          <button type="button" aria-label={labels.previous} disabled={!loop && current === 0} onClick={() => move(current - 1, true)} className={button}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          {playing ? (
            <button type="button" aria-label={paused ? labels.play : labels.pause} onClick={() => setPaused(!paused)} className={button}>
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                {paused ? <path d="M8 5.5v13l10-6.5Z" /> : <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />}
              </svg>
            </button>
          ) : null}
          <button type="button" aria-label={labels.next} disabled={!loop && current === total - 1} onClick={() => move(current + 1, true)} className={button}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

/**
 * The typed reveal of a text, kept minimal: the visible prefix grows at `speed` characters per second while `active`;
 * under reduced motion (or when not active) it is the whole text at once. Render the full text for assistive technology
 * (`sr-only`) and this one `aria-hidden`.
 */
export function useTypedText(text: string, { active = true, speed = 45 }: { active?: boolean; speed?: number } = {}) {
  const [typed, setTyped] = React.useState({ of: "", count: 0 });
  const reduced = React.useSyncExternalStore(subscribeReduced, readReduced, () => false);
  React.useEffect(() => {
    if (!active || reduced) return;
    const id = window.setInterval(() => {
      setTyped((state) => {
        const count = state.of === text ? state.count + 1 : 1;
        if (count >= text.length) window.clearInterval(id);
        return { of: text, count };
      });
    }, Math.max(10, 1000 / speed));
    return () => window.clearInterval(id);
  }, [text, active, reduced, speed]);
  const count = typed.of === text ? typed.count : 0;
  const done = !active || reduced || count >= text.length;
  return { text: done ? text : text.slice(0, count), done };
}
