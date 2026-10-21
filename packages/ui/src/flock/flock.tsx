"use client";

// The flock, alive: birds standing on a stage, each at ease in character (Mascot `life`), and the moments between
// them — two birds glance at each other, the pigeon carries its parcel across, a bird looks up when you come near or tap
// it. Transform and opacity only: CSS for each bird's own life, a timer for the moments (no frame loop), and nothing at
// all when the flock is off screen, the tab is hidden or the person asked for less motion.
import * as React from "react";

import { cn } from "../cn";
import type { MascotBird, MascotLook } from "../mascots";
import { Mascot } from "../mascots";
import { BEATS, neighbourOf, Prop, receive, type Shown, type Stage } from "./scenes";

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
  /**
   * Scenes, true to each bird's promise: the owl reads a book, the flamingo and the lovebird talk with a speech mark, the
   * crane steps and bows, the beaver taps a log, the magpie takes a shiny point, the duck builds, the falcon scans — and the
   * pigeon hands its parcel over, which the receiver opens in its own way. One at a time, at random. Default `false`.
   */
  scenes?: boolean;
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
    /** How lively the moments are: 1 is calm (default), 2 doubles how often neighbours glance and the pigeon delivers. */
    tempo?: number;
    /** A bird the page points at (a product the reader is on): it looks up and jumps once each time it changes. */
    active?: MascotBird | null;
    /** The birds greet the reader once as the flock first comes into view: each jumps in turn, left to right. */
    greet?: boolean;
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

const between = (random: () => number, [lo, hi]: readonly [number, number], tempo = 1) => (lo + random() * (hi - lo)) / tempo;
// @fixed: the scenes' pace — the wait between two beats, and the rarer long pause.
const SCENE_EVERY_MS = [2600, 5200] as const;
const SCENE_PAUSE_MS = [8000, 12000] as const;
const GREET_STEP_MS = 110;
const POKE_MS = 700;

/** `true` while the page may move: no reduced-motion request, the tab visible. */
function useMayMove(): boolean {
  const [may, setMay] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    // The page settles first: `html[data-motion="settling"]` (MotionObserver) holds every loop until it is `ready`.
    const settled = () => document.documentElement.getAttribute("data-motion") !== "settling";
    const update = () => setMay(!query.matches && document.visibilityState !== "hidden" && settled());
    update();
    query.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    const watch = typeof MutationObserver === "undefined" ? null : new MutationObserver(update);
    watch?.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
    return () => {
      query.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
      watch?.disconnect();
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
export function Flock({ birds, ratio = 16 / 9, tone = "brand", glance = true, courier = true, react = true, scenes = false, random = Math.random, tempo = 1, active = null, greet = false, className, style, ...props }: FlockProps) {
  const stage = React.useRef<HTMLDivElement>(null);
  const bodies = React.useRef<(HTMLDivElement | null)[]>([]);
  const may = useMayMove();
  const onScreen = useOnScreen(stage);
  const running = may && onScreen;
  const [looks, setLooks] = React.useState<Record<number, MascotLook>>({});
  const [flying, setFlying] = React.useState<{ index: number; bank: number } | null>(null);
  const [poked, setPoked] = React.useState<Record<number, boolean>>({});
  const [shown, setShown] = React.useState<Shown[]>([]);
  const [empty, setEmpty] = React.useState<Record<number, boolean>>({});
  // Birds a scene holds (a glance or a trip leaves them alone), and the scene or the trip in progress.
  const held = React.useRef(new Set<number>());
  const busy = React.useRef<"scene" | "trip" | null>(null);
  const ids = React.useRef(0);

  // Left to right: a bird's neighbours are the birds beside it on the stage.
  const order = React.useMemo(() => birds.map((_, i) => i).sort((a, b) => birds[a]!.x - birds[b]!.x), [birds]);
  const look = React.useCallback((index: number, to: MascotLook) => setLooks((l) => (l[index] === to ? l : { ...l, [index]: to })), []);
  const rest = React.useCallback((...indexes: number[]) => setLooks((l) => Object.fromEntries(Object.entries(l).filter(([k]) => !indexes.includes(Number(k))))), []);

  // What a scene can do, bound to one run of an effect: every timer and animation it starts ends with the run.
  const stageFor = React.useCallback((run: { timers: Set<ReturnType<typeof setTimeout>>; anims: Set<Animation> }): Stage => {
    const later = (fn: () => void, ms: number) => {
      const t = setTimeout(() => {
        run.timers.delete(t);
        fn();
      }, ms);
      run.timers.add(t);
    };
    const poke = (index: number, ms = POKE_MS) => {
      setPoked((p) => ({ ...p, [index]: true }));
      later(() => setPoked((p) => ({ ...p, [index]: false })), ms);
    };
    const show = (index: number, kind: Shown["kind"], ms: number, side?: 1 | -1, mark?: string) => {
      const item: Shown = { id: ++ids.current, at: index, kind, ms, side, mark };
      setShown((all) => [...all, item]);
      later(() => setShown((all) => all.filter((x) => x.id !== item.id)), ms);
    };
    return {
      birds,
      order,
      random,
      look,
      rest,
      poke,
      show,
      say: (index, mark, ms) => show(index, "say", ms, undefined, mark),
      wait: (ms) => new Promise<void>((resolve) => later(resolve, ms)),
      move: async (index, keyframes, ms) => {
        const el = bodies.current[index];
        if (!el || typeof el.animate !== "function") return;
        const animation = el.animate(keyframes, { duration: ms });
        run.anims.add(animation);
        await animation.finished.catch(() => undefined);
        run.anims.delete(animation);
      },
    };
  }, [birds, order, random, look, rest]);

  // Glances: two neighbours turn towards each other, hold, and look away.
  React.useEffect(() => {
    if (!running || !glance || order.length < 2) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let back: ReturnType<typeof setTimeout> | undefined;
    const next = () => {
      timer = setTimeout(() => {
        const at = Math.floor(random() * (order.length - 1));
        const [a, b] = [order[at]!, order[at + 1]!];
        if (held.current.has(a) || held.current.has(b)) return next();
        look(a, "right");
        look(b, "left");
        back = setTimeout(() => {
          rest(a, b);
          next();
        }, between(random, GLANCE_HOLD_MS));
      }, between(random, GLANCE_EVERY_MS, tempo));
    };
    next();
    return () => {
      clearTimeout(timer);
      clearTimeout(back);
    };
  }, [running, glance, order, random, tempo, look, rest]);

  // The delivery: the pigeon takes its parcel across to the farthest bird, hands it over, and flies back.
  React.useEffect(() => {
    const pigeon = birds.findIndex((b) => b.bird === "pigeon");
    if (!running || !courier || pigeon < 0 || birds.length < 2) return;
    let alive = true;
    const heldNow = held.current;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let animation: Animation | undefined;
    const run = { timers: new Set<ReturnType<typeof setTimeout>>(), anims: new Set<Animation>() };
    // The farthest bird from the pigeon, so the parcel crosses the whole stage.
    const from = birds[pigeon]!;
    const target = birds.reduce((far, b, i) => (i !== pigeon && Math.abs(b.x - from.x) > Math.abs(birds[far]!.x - from.x) ? i : far), pigeon === 0 ? 1 : 0);
    const wait = (ms: number) => new Promise<void>((resolve) => (timer = setTimeout(resolve, ms)));
    const trip = async () => {
      // With scenes, the trip waits for the beat in progress and holds the stage while it lasts.
      while (alive && scenes && busy.current === "scene") await wait(400);
      if (!alive) return;
      busy.current = "trip";
      const el = bodies.current[pigeon];
      const box = stage.current?.getBoundingClientRect();
      if (!el || !box || typeof el.animate !== "function") return;
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
      held.current.add(target);
      await fly(0, dx);
      if (!alive) return;
      // The hand-over: the receiver looks at the pigeon, the pigeon hops on the doorstep.
      setPoked((p) => ({ ...p, [pigeon]: true }));
      if (scenes) {
        // …and the parcel changes hands: the receiver takes it and reacts in character, the pigeon flies back light.
        setEmpty((e) => ({ ...e, [pigeon]: true }));
        const reaction = receive(stageFor(run), target, pigeon);
        await wait(HAND_OVER_MS);
        if (!alive) return;
        setPoked((p) => ({ ...p, [pigeon]: false }));
        await reaction;
      } else {
        await wait(HAND_OVER_MS);
        if (!alive) return;
        setPoked((p) => ({ ...p, [pigeon]: false }));
      }
      if (!alive) return;
      look(target, "up");
      await fly(dx, 0);
      animation?.cancel();
      setEmpty((e) => ({ ...e, [pigeon]: false }));
      rest(target);
    };
    const schedule = (ms: number) => {
      timer = setTimeout(async () => {
        await trip();
        busy.current = null;
        held.current.delete(target);
        if (alive) schedule(between(random, COURIER_EVERY_MS, tempo));
      }, ms);
    };
    schedule(COURIER_FIRST_MS / tempo);
    return () => {
      alive = false;
      clearTimeout(timer);
      animation?.cancel();
      run.timers.forEach(clearTimeout);
      run.anims.forEach((a) => a.cancel());
      if (scenes) {
        setShown([]);
        setEmpty({});
        heldNow.clear();
        busy.current = null;
      }
      setFlying(null);
    };
  }, [running, courier, birds, random, tempo, scenes, stageFor, look, rest]);

  // The scenes: one beat at a time, picked at random from what the flock holds — never the same bird twice in a row, never
  // at a regular beat (short waits, now and then a long pause) — so the minute is never the same twice.
  React.useEffect(() => {
    if (!running || !scenes || birds.length < 1) return;
    let alive = true;
    const heldNow = held.current;
    const run = { timers: new Set<ReturnType<typeof setTimeout>>(), anims: new Set<Animation>() };
    const st = stageFor(run);
    const beats = BEATS.flatMap((beat) => birds.flatMap((b, i) => (b.bird === beat.bird ? [{ beat, index: i }] : [])));
    if (!beats.length) return;
    let last = -1;
    const next = async () => {
      const long = random() < 0.2;
      await st.wait(between(random, long ? SCENE_PAUSE_MS : SCENE_EVERY_MS, tempo));
      while (alive && busy.current === "trip") await st.wait(600);
      if (!alive) return;
      const pool = beats.filter((x) => x.index !== last);
      const pick = (pool.length ? pool : beats)[Math.floor(random() * (pool.length ? pool.length : beats.length))]!;
      last = pick.index;
      busy.current = "scene";
      // The scene's birds are held, so no glance cuts across it.
      const near = neighbourOf(st, pick.index);
      held.current.add(pick.index);
      if (near !== null) held.current.add(near);
      await pick.beat.run(st, pick.index);
      held.current.delete(pick.index);
      if (near !== null) held.current.delete(near);
      if (busy.current === "scene") busy.current = null;
      if (alive) void next();
    };
    void next();
    return () => {
      alive = false;
      run.timers.forEach(clearTimeout);
      run.anims.forEach((a) => a.cancel());
      setShown([]);
      heldNow.clear();
      busy.current = null;
    };
  }, [running, scenes, birds, random, tempo, stageFor]);

  // The greeting: the first time the flock is on screen, each bird jumps in turn.
  const greeted = React.useRef(false);
  React.useEffect(() => {
    if (!running || !greet || greeted.current) return;
    greeted.current = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    order.forEach((index, n) => {
      timers.push(setTimeout(() => setPoked((p) => ({ ...p, [index]: true })), n * GREET_STEP_MS));
      timers.push(setTimeout(() => setPoked((p) => ({ ...p, [index]: false })), n * GREET_STEP_MS + POKE_MS));
    });
    return () => timers.forEach(clearTimeout);
  }, [running, greet, order]);

  // The bird the page points at looks up and jumps.
  React.useEffect(() => {
    const index = active ? birds.findIndex((b) => b.bird === active) : -1;
    if (!running || index < 0) return;
    const start = setTimeout(() => {
      look(index, "up");
      setPoked((p) => ({ ...p, [index]: true }));
    }, 0);
    const t = setTimeout(() => setPoked((p) => ({ ...p, [index]: false })), POKE_MS);
    return () => {
      clearTimeout(start);
      clearTimeout(t);
      setPoked((p) => ({ ...p, [index]: false }));
      rest(index);
    };
  }, [active, running, birds, look, rest]);

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
      data-motion-scope=""
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
            carrying={!empty[i]}
            size={120}
            style={{ width: "100%", height: "100%", display: "block", overflow: "visible" }}
          />
          {shown
            .filter((x) => x.at === i)
            .map((x) => (
              <Prop key={x.id} shown={x} size={b.size} />
            ))}
        </div>
      ))}
    </div>
  );
}
