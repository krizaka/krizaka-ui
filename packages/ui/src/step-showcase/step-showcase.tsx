// Client (timers through the video, observers, swipe). A guided sequence in one device frame: the steps listed beside
// it (a vertical tab list: number · title · one line, a bar filling under the current one), the frame playing the
// step's recording muted, then moving on to the next; the recordings crossfade. It plays only while in view, holds on
// hover and focus, keeps a visible play / pause button, and never shows a video's native controls. Recordings load
// lazily (posters first, the current step's video once the block has been seen). Reduced motion: posters, manual steps.
// Below `md` the list becomes dots under the frame, the frame swipes, the current step's words show under it.
import * as React from "react";

import { cn } from "../cn";
import { DeviceFrame, type DeviceKind } from "./device-frame";

const FILL_CSS = ".kz-step-fill{transform-origin:left;animation:kz-step-fill var(--kz-step-ms,6000ms) linear forwards}@keyframes kz-step-fill{from{transform:scaleX(0)}to{transform:scaleX(1)}}";
const REDUCED = "(prefers-reduced-motion: reduce)";
const noop = () => () => undefined;
const readReduced = () => Boolean(typeof window !== "undefined" && window.matchMedia?.(REDUCED).matches);
const subscribeReduced = (notify: () => void) => {
  const q = window.matchMedia?.(REDUCED);
  q?.addEventListener?.("change", notify);
  return () => q?.removeEventListener?.("change", notify);
};

export interface ShowcaseStep {
  /** A stable key. */
  id: string;
  /** The step's name (“Make an image”), passed translated. */
  title: string;
  /** One line under it. */
  description: string;
  /** The still shown first, and the only picture under reduced motion. */
  poster: string;
  /** What the poster shows, for assistive technology. */
  alt: string;
  /** The recording: WebM and / or MP4. Without one, the poster stays `duration` ms. */
  video?: { webm?: string; mp4?: string };
  /** Milliseconds a step without a video stays. @default 6000 */
  duration?: number;
}

export interface StepShowcaseLabels {
  /** The button's name while paused. */
  play: string;
  /** The button's name while it plays. */
  pause: string;
  /** A step's position in words: `(2, 4) => "Step 2 of 4"`. */
  step: (n: number, total: number) => string;
}

export const stepShowcaseLabels: StepShowcaseLabels = {
  play: "Play the steps",
  pause: "Pause the steps",
  step: (n, total) => `Step ${n} of ${total}`,
};

export interface StepShowcaseProps extends Omit<React.ComponentProps<"section">, "children"> {
  /** The sequence's accessible name (“Orazaka in your pocket”), passed translated. */
  label: string;
  /** The steps, in the order of the journey. */
  steps: readonly ShowcaseStep[];
  /** The device the recordings were made on. */
  device: DeviceKind;
  /** The browser's address or the window's title. */
  deviceTitle?: string;
  /** Moves on by itself (never under reduced motion). @default true */
  autoplay?: boolean;
  /** The controls' words, translated. */
  labels?: StepShowcaseLabels;
  /** The step shown first. @default 0 */
  defaultIndex?: number;
  /** Called when the step changes — `user` is true when the visitor asked for it. */
  onIndexChange?: (index: number, user: boolean) => void;
}

/** One device frame, its steps beside it, playing each recording then the next — a product's guided tour. */
export function StepShowcase({ label, steps, device, deviceTitle, autoplay = true, labels = stepShowcaseLabels, defaultIndex = 0, onIndexChange, className, ...props }: StepShowcaseProps) {
  const total = steps.length;
  const id = React.useId();
  const root = React.useRef<HTMLElement>(null);
  const video = React.useRef<HTMLVideoElement>(null);
  const bar = React.useRef<HTMLSpanElement>(null);
  const swipe = React.useRef<number | null>(null);
  const [index, setIndex] = React.useState(defaultIndex);
  const [paused, setPaused] = React.useState(false);
  const [hold, setHold] = React.useState({ hover: false, focus: false });
  const [inView, setInView] = React.useState(false);
  const [seen, setSeen] = React.useState(false);
  const reduced = React.useSyncExternalStore(subscribeReduced, readReduced, () => false);
  const mounted = React.useSyncExternalStore(noop, () => true, () => false);
  const current = steps[Math.min(index, total - 1)];
  const auto = autoplay && !reduced && mounted;
  const running = auto && !paused && !hold.hover && !hold.focus && inView;

  React.useEffect(() => {
    const host = root.current;
    if (!host || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((e) => {
      const visible = e.some((x) => x.isIntersecting);
      setInView(visible);
      if (visible) setSeen(true);
    }, { threshold: 0.35 });
    io.observe(host);
    return () => io.disconnect();
  }, []);

  const go = React.useCallback(
    (to: number, user: boolean) => {
      const next = (to + total) % total;
      setIndex(next);
      if (bar.current) bar.current.style.transform = "scaleX(0)";
      onIndexChange?.(next, user);
    },
    [total, onIndexChange],
  );

  // The recording runs only while the sequence does; its time is the bar.
  React.useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (running) v.play()?.catch?.(() => undefined);
    else v.pause();
  }, [running, index, seen]);

  const playable = Boolean(current?.video) && seen && !reduced;
  const onTime = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.currentTarget;
    if (bar.current && v.duration) bar.current.style.transform = `scaleX(${v.currentTime / v.duration})`;
  };

  return (
    <section
      ref={root}
      aria-roledescription="carousel"
      aria-label={label}
      className={cn("grid items-center gap-6 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-10", className)}
      onPointerEnter={() => setHold((h) => ({ ...h, hover: true }))}
      onPointerLeave={() => setHold((h) => ({ ...h, hover: false }))}
      onFocus={() => setHold((h) => ({ ...h, focus: true }))}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHold((h) => ({ ...h, focus: false }));
      }}
      {...props}
    >
      <style href="kz-step-showcase" precedence="medium">{FILL_CSS}</style>
      <div className="order-2 grid gap-3 md:order-1">
        <div role="tablist" aria-orientation="vertical" aria-label={label} className="flex justify-center gap-2 md:grid md:gap-1">
          {steps.map((s, i) => {
            const active = i === index;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                id={`${id}-tab-${i}`}
                aria-selected={active}
                aria-controls={`${id}-panel`}
                tabIndex={active ? 0 : -1}
                onClick={() => go(i, true)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown" || e.key === "ArrowRight") go(i + 1, true);
                  else if (e.key === "ArrowUp" || e.key === "ArrowLeft") go(i - 1, true);
                  else return;
                  e.preventDefault();
                }}
                className={cn(
                  "group relative rounded-xl text-left outline-hidden transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                  "max-md:h-2.5 max-md:w-2.5 max-md:rounded-full max-md:bg-border-strong max-md:aria-selected:w-6 max-md:aria-selected:bg-accent",
                  "md:overflow-hidden md:p-4 md:hover:bg-surface-2 md:aria-selected:bg-surface-2",
                )}
              >
                <span className="max-md:sr-only">
                  <span className="flex items-baseline gap-3">
                    <span className={cn("font-mono text-xs", active ? "text-fg-accent" : "text-fg-secondary")}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={cn("text-sm font-semibold", active ? "text-fg" : "text-fg-secondary")}>{s.title}</span>
                  </span>
                  <span className="mt-1 block pl-8 text-xs leading-relaxed text-fg-secondary">{s.description}</span>
                </span>
                {active && auto && (
                  <span aria-hidden className="absolute inset-x-4 bottom-0 hidden h-0.5 overflow-hidden rounded-full bg-border-subtle md:block">
                    <span
                      key={`${s.id}-${playable}`}
                      ref={bar}
                      data-fill
                      className={cn("block h-full bg-accent", !playable && "kz-step-fill")}
                      style={{ transform: playable ? "scaleX(0)" : undefined, animationPlayState: running ? "running" : "paused", ["--kz-step-ms" as string]: `${s.duration ?? 6000}ms` }}
                      onAnimationEnd={() => go(index + 1, false)}
                    />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <p aria-hidden className="text-center text-sm md:hidden">
          <span className="font-semibold text-fg">{current?.title}</span> <span className="text-fg-secondary">{current?.description}</span>
        </p>
        {auto && (
          <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused} className="mx-auto inline-flex h-8 items-center gap-2 rounded-full border border-border-subtle px-3 text-xs font-medium text-fg-secondary hover:text-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring md:mx-0 md:w-fit">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
              {paused ? <path d="M8 5v14l11-7z" /> : <path d="M7 5h4v14H7zM13 5h4v14h-4z" />}
            </svg>
            {paused ? labels.play : labels.pause}
          </button>
        )}
      </div>

      <div
        id={`${id}-panel`}
        role="tabpanel"
        aria-roledescription="slide"
        aria-labelledby={`${id}-tab-${index}`}
        className="order-1 touch-pan-y md:order-2"
        onPointerDown={(e) => {
          swipe.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (swipe.current === null) return;
          const dx = e.clientX - swipe.current;
          swipe.current = null;
          if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1), true);
        }}
      >
        <DeviceFrame kind={device} title={deviceTitle}>
          {steps.map((s, i) => {
            const active = i === index;
            return (
              <div key={s.id} data-step={s.id} aria-hidden={!active} className={cn("absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none", active ? "opacity-100" : "opacity-0")}>
                <img src={s.poster} alt={active ? s.alt : ""} loading={i === 0 ? "eager" : "lazy"} decoding="async" className="h-full w-full object-cover" />
                {active && playable && s.video && (
                  <video
                    ref={video}
                    key={s.id}
                    muted
                    playsInline
                    preload="metadata"
                    poster={s.poster}
                    aria-hidden
                    tabIndex={-1}
                    onTimeUpdate={onTime}
                    onEnded={() => go(index + 1, false)}
                    className="absolute inset-0 h-full w-full object-cover"
                  >
                    {s.video.webm && <source src={s.video.webm} type="video/webm" />}
                    {s.video.mp4 && <source src={s.video.mp4} type="video/mp4" />}
                  </video>
                )}
              </div>
            );
          })}
        </DeviceFrame>
        <span className="sr-only" aria-live="off">
          {labels.step(index + 1, total)}
        </span>
      </div>
    </section>
  );
}
