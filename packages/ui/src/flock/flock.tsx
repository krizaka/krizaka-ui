"use client";

// The flock, alive: birds standing on a stage, each at ease in character (Mascot `life`), and the moments between
// them — two birds glance at each other, the pigeon carries its parcel across, a bird looks up when you come near or tap
// it. Transform and opacity only: CSS for each bird's own life, a timer for the moments (no frame loop), and nothing at
// all when the flock is off screen, the tab is hidden or the person asked for less motion.
import * as React from "react";

import { cn } from "../cn";
import type { MascotBird, MascotLook } from "../mascots";
import { Mascot } from "../mascots";

export interface FlockBird {
  /** Which bird. */
  bird: MascotBird;
  /** Where its feet are, across the stage: 0 to 100 (% of the stage's width). */
  x: number;
  /** Where its feet are, down the stage: 0 to 100 (% of the stage's height). */
  y: number;
  /** How wide it is: % of the stage's width. */
  size: number;
}

export interface FlockMoments {
  /** Two neighbours look at each other now and then. Default `true`. */
  glance?: boolean;
  /** The pigeon, when the flock has one, carries its parcel across to another bird and comes back. Default `true`. */
  courier?: boolean;
  /** A bird looks up when the pointer comes near, and jumps a little when tapped. Default `true`. */
  react?: boolean;
}

export type FlockProps = Omit<React.ComponentProps<"div">, "children"> &
  FlockMoments & {
    /** The birds on the stage. */
    birds: readonly FlockBird[];
    /** The stage's shape, width over height (default 16 / 9). It keeps its ratio at any width, so the birds keep their places. */
    ratio?: number;
    /** The birds' colours: the host's accent (`brand`, default) or the Krizaka story's (`own`). */
    tone?: "brand" | "own";
    /** The source of chance (default `Math.random`): give it a fixed one in a test. */
    random?: () => number;
  };

// @fixed: the rhythm of the moments — how long a glance lasts, how often one happens, how long a delivery takes. A
// choreography's pace, not a business parameter.
const GLANCE_HOLD_MS = [1500, 2400] as const;
const GLANCE_EVERY_MS = [4200, 9000] as const;
const COURIER_FIRST_MS = 9000;
const COURIER_EVERY_MS = [26000, 38000] as const;
const FLIGHT_MS = 2600;
const HAND_OVER_MS = 1300;
const LOOK_BACK_MS = 1600;

const between = (random: () => number, [lo, hi]: readonly [number, number]) => lo + random() * (hi - lo);

/** `true` while the page may move: no reduced-motion request, the tab visible. */
function useMayMove(): boolean {
  const [may, setMay] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMay(!query.matches && document.visibilityState !== "hidden");
    update();
    query.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      query.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return may;
}

/** `true` while the element is on screen. */
function useOnScreen(ref: React.RefObject<Element | null>): boolean {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setOn(Boolean(entry?.isIntersecting)), { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return on;
}

/**
 * The flock on its stage, alive. Decorative (`aria-hidden`): put the words beside it. Each bird idles in character; every
 * few seconds two neighbours glance at each other; every half minute the pigeon carries its parcel to another bird and
 * returns; a bird looks up when you come near. All of it pauses off screen and in a hidden tab, and the flock is still
 * under `prefers-reduced-motion`.
 */
export function Flock({ birds, ratio = 16 / 9, tone = "brand", glance = true, courier = true, react = true, random = Math.random, className, style, ...props }: FlockProps) {
  const stage = React.useRef<HTMLDivElement>(null);
  const bodies = React.useRef<(HTMLDivElement | null)[]>([]);
  const may = useMayMove();
  const onScreen = useOnScreen(stage);
  const running = may && onScreen;
  const [looks, setLooks] = React.useState<Record<number, MascotLook>>({});
  const [flying, setFlying] = React.useState<{ index: number; bank: number } | null>(null);
  const [poked, setPoked] = React.useState<Record<number, boolean>>({});

  // Left to right: a bird's neighbours are the birds beside it on the stage.
  const order = React.useMemo(() => birds.map((_, i) => i).sort((a, b) => birds[a]!.x - birds[b]!.x), [birds]);
  const look = (index: number, to: MascotLook) => setLooks((l) => (l[index] === to ? l : { ...l, [index]: to }));
  const rest = (...indexes: number[]) => setLooks((l) => Object.fromEntries(Object.entries(l).filter(([k]) => !indexes.includes(Number(k)))));

  // Glances: two neighbours turn towards each other, hold, and look away.
  React.useEffect(() => {
    if (!running || !glance || order.length < 2) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let back: ReturnType<typeof setTimeout> | undefined;
    const next = () => {
      timer = setTimeout(() => {
        const at = Math.floor(random() * (order.length - 1));
        const [a, b] = [order[at]!, order[at + 1]!];
        look(a, "right");
        look(b, "left");
        back = setTimeout(() => {
          rest(a, b);
          next();
        }, between(random, GLANCE_HOLD_MS));
      }, between(random, GLANCE_EVERY_MS));
    };
    next();
    return () => {
      clearTimeout(timer);
      clearTimeout(back);
    };
  }, [running, glance, order, random]);

  // The delivery: the pigeon takes its parcel across to the farthest bird, hands it over, and flies back.
  React.useEffect(() => {
    const pigeon = birds.findIndex((b) => b.bird === "pigeon");
    if (!running || !courier || pigeon < 0 || birds.length < 2) return;
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let animation: Animation | undefined;
    const wait = (ms: number) => new Promise<void>((resolve) => (timer = setTimeout(resolve, ms)));
    const trip = async () => {
      const el = bodies.current[pigeon];
      const box = stage.current?.getBoundingClientRect();
      if (!el || !box || typeof el.animate !== "function") return;
      // The farthest bird from the pigeon, so the parcel crosses the whole stage.
      const from = birds[pigeon]!;
      const target = birds.reduce((far, b, i) => (i !== pigeon && Math.abs(b.x - from.x) > Math.abs(birds[far]!.x - from.x) ? i : far), pigeon === 0 ? 1 : 0);
      const to = birds[target]!;
      const side = to.x > from.x ? 1 : -1;
      // It lands beside the receiver, not on it.
      const dx = ((to.x - from.x) / 100) * box.width - side * (to.size / 100) * box.width * 0.55;
      const lift = (from.size / 100) * box.width * 0.35;
      const fly = async (fromX: number, toX: number) => {
        setFlying({ index: pigeon, bank: Math.sign(toX - fromX) });
        animation = el.animate(
          [
            { transform: `translate(${fromX}px, 0)`, easing: "ease-out" },
            { transform: `translate(${(fromX + toX) / 2}px, ${-lift}px)`, easing: "ease-in", offset: 0.5 },
            { transform: `translate(${toX}px, 0)` },
          ],
          { duration: FLIGHT_MS, fill: "forwards" },
        );
        await animation.finished.catch(() => undefined);
        setFlying(null);
      };
      look(target, side > 0 ? "left" : "right");
      await fly(0, dx);
      if (!alive) return;
      // The hand-over: the receiver looks at the pigeon, the pigeon hops on the doorstep.
      setPoked((p) => ({ ...p, [pigeon]: true }));
      await wait(HAND_OVER_MS);
      if (!alive) return;
      setPoked((p) => ({ ...p, [pigeon]: false }));
      look(target, "up");
      await fly(dx, 0);
      animation?.cancel();
      rest(target);
    };
    const schedule = (ms: number) => {
      timer = setTimeout(async () => {
        await trip();
        if (alive) schedule(between(random, COURIER_EVERY_MS));
      }, ms);
    };
    schedule(COURIER_FIRST_MS);
    return () => {
      alive = false;
      clearTimeout(timer);
      animation?.cancel();
      setFlying(null);
    };
  }, [running, courier, birds, random]);

  // A bird looks up when you come near, and jumps when you tap it.
  const hover = (index: number, event: React.PointerEvent) => {
    if (!running || !react || event.pointerType !== "mouse") return;
    look(index, "up");
  };
  const leave = (index: number) => {
    if (!react) return;
    rest(index);
  };
  const tap = (index: number) => {
    if (!running || !react) return;
    look(index, "up");
    setPoked((p) => ({ ...p, [index]: true }));
    setTimeout(() => {
      setPoked((p) => ({ ...p, [index]: false }));
      rest(index);
    }, LOOK_BACK_MS);
  };

  return (
    <div
      ref={stage}
      aria-hidden
      data-flock=""
      data-running={running ? "" : undefined}
      className={cn("relative w-full", className)}
      style={{ aspectRatio: String(ratio), containerType: "inline-size", ...style }}
      {...props}
    >
      {birds.map((b, i) => (
        <div
          key={`${b.bird}-${i}`}
          ref={(el) => {
            bodies.current[i] = el;
          }}
          data-flock-bird={b.bird}
          className="absolute touch-manipulation"
          style={{ left: `${b.x - b.size / 2}%`, width: `${b.size}%`, top: `calc(${b.y}% - ${b.size * 0.9}cqw)`, aspectRatio: "1", pointerEvents: react ? "auto" : "none" }}
          onPointerEnter={(event) => hover(i, event)}
          onPointerLeave={() => leave(i)}
          onPointerDown={() => tap(i)}
        >
          <Mascot
            bird={b.bird}
            tone={tone}
            life
            look={looks[i]}
            flying={flying?.index === i}
            bank={flying?.index === i ? flying.bank : 0}
            poked={poked[i]}
            size={120}
            style={{ width: "100%", height: "100%", display: "block", overflow: "visible" }}
          />
        </div>
      ))}
    </div>
  );
}
