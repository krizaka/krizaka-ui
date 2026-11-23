// The motion tiers of a showroom page (krizaka-lab-design): `full` (depth, blur, the living loops), `light` (a weak device or
// Save-Data: transforms only), `still` (reduced motion: one plate, the final state, nothing moves). The tier is decided once
// from what the browser says; the CSS reads `data-tier`. Client: it reads the reader's preferences and the pointer.
import * as React from "react";

import { cn } from "../cn";

/** The three tiers, from the richest to none. */
export const MOTION_TIERS = ["full", "light", "still"] as const;
export type MotionTier = (typeof MOTION_TIERS)[number];

/** What the browser says about the reader and the device. Absent: it did not say. */
export type MotionSignals = {
  reducedMotion: boolean;
  /** `navigator.deviceMemory`, in GB. */
  deviceMemory?: number;
  /** `navigator.hardwareConcurrency`. */
  cores?: number;
  /** `navigator.connection.saveData`. */
  saveData?: boolean;
};

const REDUCED = "(prefers-reduced-motion: reduce)";
const WEAK_MEMORY_GB = 4;
const WEAK_CORES = 4;

/** The tier these signals afford: still under reduced motion, light on a weak device or Save-Data, full otherwise. Pure. */
export function motionTierOf(signals: Readonly<MotionSignals>): MotionTier {
  if (signals.reducedMotion) return "still";
  const weak = (signals.deviceMemory ?? WEAK_MEMORY_GB) < WEAK_MEMORY_GB || (signals.cores ?? WEAK_CORES) < WEAK_CORES || signals.saveData === true;
  return weak ? "light" : "full";
}

type Nav = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

function readTier(): MotionTier {
  const nav = (typeof navigator === "undefined" ? {} : navigator) as Partial<Nav>;
  return motionTierOf({
    reducedMotion: typeof matchMedia === "function" && matchMedia(REDUCED).matches,
    deviceMemory: nav.deviceMemory,
    cores: nav.hardwareConcurrency,
    saveData: nav.connection?.saveData,
  });
}

function onPreferenceChange(change: () => void) {
  if (typeof matchMedia !== "function") return () => {};
  const query = matchMedia(REDUCED);
  query.addEventListener?.("change", change);
  return () => query.removeEventListener?.("change", change);
}

/** The tier of this reader's device, following a change of the reduced-motion preference. `serverTier` is the server's render. */
export function useMotionTier(serverTier: MotionTier = "full"): MotionTier {
  return React.useSyncExternalStore(onPreferenceChange, readTier, () => serverTier);
}

export type DepthFieldProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Layers of depth that follow the pointer a little: it writes `--kz-px` and `--kz-py` (-1 to 1) on itself, one frame per
 * move, and `data-live` while it is on screen (the living loops run only then). `data-tier` says how much it may move;
 * under `still` it listens to nothing.
 */
export function DepthField({ className, children, ...props }: Readonly<DepthFieldProps>) {
  const ref = React.useRef<HTMLDivElement>(null);
  const tier = useMotionTier();
  React.useEffect(() => {
    const el = ref.current;
    if (!el || tier === "still") return;
    let frame = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = el.getBoundingClientRect();
        el.style.setProperty("--kz-px", (((e.clientX - box.left) / (box.width || 1)) * 2 - 1).toFixed(3));
        el.style.setProperty("--kz-py", (((e.clientY - box.top) / (box.height || 1)) * 2 - 1).toFixed(3));
      });
    };
    const seen = typeof IntersectionObserver === "undefined" ? undefined : new IntersectionObserver(([entry]) => el.toggleAttribute("data-live", entry?.isIntersecting ?? false));
    seen?.observe(el);
    el.addEventListener("pointermove", move, { passive: true });
    return () => {
      seen?.disconnect();
      el.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
    };
  }, [tier]);
  return (
    <div ref={ref} className={cn("kz-depth", className)} data-tier={tier} data-live={tier === "still" ? undefined : ""} {...props}>
      {children}
    </div>
  );
}
