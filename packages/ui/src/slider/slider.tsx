// Client. Radix Slider: role="slider" on each thumb, arrows / Page Up / Page Down / Home / End, a range with two
// thumbs, horizontal or vertical. The words arrive as props: `label` names the thumb(s), `formatValue` gives the
// aria-valuetext and the value shown (above the track, or floating over the thumb while it is touched). `ticks` draws the
// graduations of the steps (and `marks` their words under the track); `tone` fills with the brand's gradient or its
// accent alone.
import { Slider as SliderPrimitive } from "radix-ui";
import * as React from "react";

import { tv } from "../tv";

export const slider = tv({
  slots: {
    root: "flex flex-col gap-2 data-[orientation=vertical]:h-full data-[orientation=vertical]:items-center",
    header: "flex items-baseline justify-between gap-3 text-xs font-semibold text-fg-secondary",
    value: "font-mono text-[11px] tabular-nums text-fg-secondary",
    control:
      "relative flex touch-none select-none items-center data-disabled:cursor-not-allowed data-disabled:opacity-40 " +
      "data-[orientation=horizontal]:h-6 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-6 data-[orientation=vertical]:flex-col",
    track:
      "relative grow overflow-hidden rounded-full bg-surface-3 inset-shadow-well " +
      "data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
    range: "absolute rounded-full data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
    thumb:
      "group/thumb relative block h-5 w-5 cursor-grab rounded-full border-2 border-accent bg-fg-on-media shadow-raised transition-[box-shadow,scale] duration-150 " +
      "hover:ring-4 hover:ring-accent/15 focus-visible:outline-hidden focus-visible:focus-ring active:scale-110 active:cursor-grabbing motion-reduce:transition-none motion-reduce:active:scale-100",
    // The value over the thumb: shown while the thumb is hovered, focused or held.
    bubble:
      "pointer-events-none absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2 whitespace-nowrap rounded-lg bg-fg px-2 py-1 font-mono text-[11px] font-semibold tabular-nums text-surface-0 opacity-0 shadow-floating " +
      "transition-opacity duration-150 after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-fg " +
      "group-hover/thumb:opacity-100 group-focus-visible/thumb:opacity-100 group-active/thumb:opacity-100 data-[always]:opacity-100 motion-reduce:transition-none",
    bubbleVertical: "bottom-auto left-full top-1/2 mb-0 ml-3 -translate-x-0 -translate-y-1/2 after:hidden",
    ticks: "pointer-events-none absolute inset-0",
    tick: "absolute rounded-full bg-border-strong data-[on]:bg-on-accent/70 data-[orientation=horizontal]:top-1/2 data-[orientation=horizontal]:h-1 data-[orientation=horizontal]:w-px data-[orientation=horizontal]:-translate-x-1/2 data-[orientation=horizontal]:-translate-y-1/2 data-[orientation=vertical]:left-1/2 data-[orientation=vertical]:h-px data-[orientation=vertical]:w-1 data-[orientation=vertical]:-translate-x-1/2 data-[orientation=vertical]:translate-y-1/2",
    marks: "relative h-4 w-full text-[11px] font-medium tabular-nums text-fg-secondary",
    mark: "absolute top-0 -translate-x-1/2 whitespace-nowrap first:translate-x-0 last:-translate-x-full",
  },
  variants: {
    tone: {
      /** The brand's signature: accent → accent-2, a glow under it. */
      gradient: { range: "bg-linear-to-r from-accent to-accent-2 shadow-glow data-[orientation=vertical]:bg-linear-to-t" },
      /** The accent alone. */
      solid: { range: "bg-accent" },
    },
    size: {
      md: {},
      lg: {
        track: "data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5",
        thumb: "h-6 w-6",
        control: "data-[orientation=horizontal]:h-8 data-[orientation=vertical]:w-8",
      },
    },
  },
  defaultVariants: { tone: "gradient", size: "md" },
});

export type SliderValue = number | [number, number];

export type SliderMark = {
  /** Where the mark stands. */
  value: number;
  /** Its words under the track ("0", "50 %", "Max"), passed translated. */
  label: string;
};

export type SliderProps<V extends SliderValue = number> = Omit<
  React.ComponentProps<typeof SliderPrimitive.Root>,
  "value" | "defaultValue" | "onValueChange" | "onValueCommit" | "children"
> & {
  /** One number (a thumb) or two (a range). Controlled with `onValueChange`. */
  value?: V;
  /** The value at first, uncontrolled: one number, or two for a range. */
  defaultValue?: V;
  /** Called on every move, with one number or two. */
  onValueChange?: (value: V) => void;
  /** Called once the drag or the key press ends. */
  onValueCommit?: (value: V) => void;
  /** The accessible name — of the thumb, or of both thumbs of a range — passed translated. */
  label: string;
  /** For a range: each thumb's own name (["Minimum", "Maximum"]), passed translated. */
  thumbLabels?: [string, string];
  /** The value as words (aria-valuetext) and as shown: "1.5×", "−12 %", "3 min". */
  formatValue?: (value: number) => string;
  /** Shows the label and the value above the track. Without it, `label` only names the thumb. */
  showLabel?: boolean;
  /** Shows the value floating over the thumb while it is hovered, focused or held (`"always"`: at all times). */
  floatingValue?: boolean | "always";
  /** Fills from this value instead of the minimum (a ±range from 0: brightness, balance). One horizontal thumb only. */
  origin?: number;
  /** Draws a graduation at every step (`true`, up to 40 of them) or at the values given. */
  ticks?: boolean | readonly number[];
  /** Words under the track at some values (`[{ value: 0, label: "0" }, { value: 100, label: "100" }]`). Horizontal only. */
  marks?: readonly SliderMark[];
  /**
   * `gradient` (the brand's accent → accent-2, a glow) or `solid` (the accent alone).
   * @default "gradient"
   */
  tone?: "gradient" | "solid";
  /**
   * md · lg (a thicker track and thumb: a hero control, a touch screen).
   * @default "md"
   */
  size?: "md" | "lg";
};

const toArray = (v: SliderValue | undefined) => (v === undefined ? undefined : typeof v === "number" ? [v] : v);

/** A slider on one value or a range: `value`/`defaultValue` + `onValueChange`, `min`, `max`, `step`, `orientation`. */
export function Slider<V extends SliderValue = number>({
  value,
  defaultValue,
  onValueChange,
  onValueCommit,
  label,
  thumbLabels,
  formatValue = String,
  showLabel,
  floatingValue,
  origin,
  ticks,
  marks,
  tone,
  size,
  min = 0,
  max = 100,
  step = 1,
  orientation = "horizontal",
  className,
  ...props
}: SliderProps<V>) {
  const s = slider({ tone, size });
  const range = Array.isArray(value ?? defaultValue);
  const vertical = orientation === "vertical";
  const [inner, setInner] = React.useState(() => toArray(defaultValue) ?? [min]);
  const current = toArray(value) ?? inner;
  const out = (next: number[]) => (range ? next : next[0]) as V;
  const pct = (v: number) => ((v - min) / (max - min || 1)) * 100;
  const fill =
    origin !== undefined && !range && !vertical
      ? { left: `${Math.min(pct(origin), pct(current[0]!))}%`, right: `${100 - Math.max(pct(origin), pct(current[0]!))}%` }
      : undefined;
  const lo = range ? Math.min(...current) : (origin ?? min);
  const hi = range ? Math.max(...current) : current[0]!;
  const tickValues = ticks === true ? (max - min) / step <= 40 ? Array.from({ length: Math.round((max - min) / step) + 1 }, (_, i) => min + i * step) : [] : ticks ? [...ticks] : [];
  const id = React.useId();
  return (
    <div className={s.root({ className })} data-range={range ? "" : undefined} data-orientation={orientation}>
      {showLabel && (
        <div className={s.header()}>
          <span id={`${id}-label`}>{label}</span>
          <span className={s.value()} aria-hidden>
            {current.map(formatValue).join(" – ")}
          </span>
        </div>
      )}
      <SliderPrimitive.Root
        min={min}
        max={max}
        step={step}
        orientation={orientation}
        value={current}
        onValueChange={(next) => {
          if (value === undefined) setInner(next);
          onValueChange?.(out(next));
        }}
        onValueCommit={onValueCommit && ((next) => onValueCommit(out(next)))}
        className={s.control()}
        {...props}
      >
        <SliderPrimitive.Track className={s.track()}>
          {fill ? <span data-origin="" data-orientation={orientation} className={s.range()} style={fill} /> : <SliderPrimitive.Range className={s.range()} />}
          {tickValues.length ? (
            <span aria-hidden className={s.ticks()}>
              {tickValues.map((t) => (
                <span
                  key={t}
                  data-orientation={orientation}
                  data-on={t > lo && t < hi ? "" : undefined}
                  className={s.tick()}
                  style={vertical ? { bottom: `${pct(t)}%` } : { left: `${pct(t)}%` }}
                />
              ))}
            </span>
          ) : null}
        </SliderPrimitive.Track>
        {current.map((v, i) => (
          <SliderPrimitive.Thumb
            key={i}
            aria-label={range ? (thumbLabels?.[i] ?? label) : showLabel ? undefined : label}
            aria-labelledby={!range && showLabel ? `${id}-label` : undefined}
            aria-valuetext={formatValue(v)}
            className={s.thumb()}
          >
            {floatingValue ? (
              <span aria-hidden data-always={floatingValue === "always" ? "" : undefined} className={s.bubble({ className: vertical ? s.bubbleVertical() : undefined })}>
                {formatValue(v)}
              </span>
            ) : null}
          </SliderPrimitive.Thumb>
        ))}
      </SliderPrimitive.Root>
      {marks?.length && !vertical ? (
        <div aria-hidden className={s.marks()}>
          {marks.map((m) => (
            <span key={m.value} className={s.mark()} style={{ left: `${pct(m.value)}%` }}>
              {m.label}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
