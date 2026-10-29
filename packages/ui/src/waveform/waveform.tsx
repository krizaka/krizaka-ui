// Client (the idle motion and the pause off screen). The bars of a waveform, drawn on their own: a decorative
// waveform for a card, a banner or a sound's identity. Hidden from assistive technology unless it has a `label`.
// Its motion runs only while `playing`, never under prefers-reduced-motion, and pauses when it leaves the screen.
import * as React from "react";
import { tv } from "tailwind-variants";

import { useInView } from "../media";
import { resamplePeaks } from "./bars";

export const waveform = tv({
  slots: {
    root: "flex w-full items-center justify-center gap-[2px]",
    bar: "min-w-[2px] flex-1 rounded-full",
  },
  variants: {
    size: {
      sm: { root: "h-6" },
      md: { root: "h-10" },
      lg: { root: "h-16" },
    },
    tone: {
      accent: { bar: "bg-accent" },
      neutral: { bar: "bg-border-strong" },
    },
  },
  defaultVariants: { size: "md", tone: "accent" },
});

// The idle motion: each bar breathes between 45 % and its height, staggered by its index. It is declared under a
// no-preference query only, so a reduced-motion reader gets the still bars; `data-paused` holds it off screen.
const MOTION =
  "@keyframes kz-wave{0%,100%{transform:scaleY(.45)}50%{transform:scaleY(1)}}" +
  "@media (prefers-reduced-motion: no-preference){.kz-wave[data-playing] [data-bar]{animation:kz-wave 1.6s ease-in-out infinite;animation-delay:var(--kz-wave-delay,0s)}}" +
  ".kz-wave[data-paused] [data-bar]{animation-play-state:paused}";

export type WaveformProps = {
  /** The peaks, between 0 and 1, as many as you like (resampled to `bars`). Without them: a flat line. */
  peaks?: readonly number[];
  /** How many bars. Default 32. */
  bars?: number;
  /** sm · md (default) · lg: the height of the drawing. */
  size?: "sm" | "md" | "lg";
  /** accent (default, the brand's colour) · neutral (a quiet line beside text). */
  tone?: "accent" | "neutral";
  /** Moves gently while `true` (a sound playing); still otherwise. */
  playing?: boolean;
  /** When given, it is an image named by this (“Voice note, 0:42”); otherwise decorative and hidden from assistive technology. */
  label?: string;
  /** Classes merged last. */
  className?: string;
};

/** A decorative waveform: the bars of a sound, in the accent or a neutral tone, breathing gently while it plays. */
export function Waveform({ peaks, bars = 32, size, tone, playing = false, label, className }: WaveformProps) {
  const s = waveform({ size, tone });
  const root = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(true);
  useInView(root, setVisible, playing);
  const shape = React.useMemo(() => resamplePeaks(peaks ?? [], bars), [peaks, bars]);
  const labelled = label !== undefined;

  return (
    <>
      <style>{MOTION}</style>
      <div
        ref={root}
        className={s.root({ className: ["kz-wave", className].filter(Boolean).join(" ") })}
        data-playing={playing || undefined}
        data-paused={playing && !visible ? "" : undefined}
        role={labelled ? "img" : undefined}
        aria-label={label}
        aria-hidden={labelled ? undefined : true}
      >
        {shape.map((peak, i) => (
          <span
            key={i}
            data-bar
            aria-hidden
            className={s.bar()}
            style={{ height: `${Math.round(peak * 100)}%`, "--kz-wave-delay": `${-((i * 7) % 11) * 0.14}s` } as React.CSSProperties}
          />
        ))}
      </div>
    </>
  );
}
