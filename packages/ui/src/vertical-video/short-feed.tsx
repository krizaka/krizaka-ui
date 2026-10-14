// Client (an observer, keys). A vertical feed of short videos: one slide per screen, CSS scroll-snap, the slide in view
// plays and the others pause, the next one preloads, only the slides near the one in view are mounted (the rest keep their
// height). ↑/↓ (and PageUp/PageDown) go to the previous / next, with the focus following.
import * as React from "react";

import { cn } from "../cn";

export interface ShortFeedProps<T> extends Omit<React.ComponentProps<"section">, "children"> {
  /** The feed's accessible name ("Videos"), passed translated. */
  label: string;
  /** The videos, in order. */
  items: readonly T[];
  /** A stable key for an item. */
  getId: (item: T) => string;
  /** One slide: `active` is true for the one in view, `preload` for the next, `near` false for the ones kept empty. */
  renderItem: (item: T, state: { active: boolean; preload: "none" | "metadata" | "auto"; index: number }) => React.ReactNode;
  /** The slides mounted around the one in view (before and after). Default 1; the others keep their height empty. */
  window?: number;
  /** Called when the slide in view changes. */
  onActiveChange?: (index: number, item: T) => void;
}

/** A vertical snap-scrolling feed that plays the video in view, preloads the next and pauses the rest. */
export function ShortFeed<T>({ label, items, getId, renderItem, window: around = 1, onActiveChange, className, onKeyDown, ...props }: ShortFeedProps<T>) {
  const root = React.useRef<HTMLElement>(null);
  const [active, setActive] = React.useState(0);
  const slides = React.useRef<(HTMLDivElement | null)[]>([]);

  React.useEffect(() => {
    const host = root.current;
    if (!host || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.6) continue;
          const index = Number((entry.target as HTMLElement).dataset.index);
          setActive(index);
        }
      },
      { root: host, threshold: [0.6] },
    );
    for (const slide of slides.current) if (slide) observer.observe(slide);
    return () => observer.disconnect();
  }, [items.length]);

  const first = React.useRef(true);
  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const item = items[active];
    if (item !== undefined) onActiveChange?.(active, item);
    // Only a change of the slide in view is an event.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const go = (index: number) => {
    const target = slides.current[Math.max(0, Math.min(items.length - 1, index))];
    if (!target) return;
    target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    target.querySelector<HTMLElement>("article")?.focus({ preventScroll: true });
  };

  return (
    <section
      ref={root}
      aria-label={label}
      aria-roledescription="carousel"
      className={cn("h-dvh snap-y snap-mandatory overflow-y-auto overscroll-contain bg-surface-0 [scrollbar-width:none]", className)}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === "ArrowDown" || event.key === "PageDown") {
          event.preventDefault();
          go(active + 1);
        } else if (event.key === "ArrowUp" || event.key === "PageUp") {
          event.preventDefault();
          go(active - 1);
        }
      }}
      {...props}
    >
      {items.map((item, index) => {
        const near = Math.abs(index - active) <= around;
        return (
          <div
            key={getId(item)}
            ref={(el) => {
              slides.current[index] = el;
            }}
            data-index={index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} / ${items.length}`}
            className="mx-auto flex h-dvh max-w-[calc(100dvh*9/16)] snap-start snap-always items-center"
          >
            {near ? renderItem(item, { active: index === active, preload: index === active + 1 ? "auto" : index === active ? "auto" : "none", index }) : null}
          </div>
        );
      })}
    </section>
  );
}
