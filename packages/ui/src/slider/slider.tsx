// Client. Radix Slider: role="slider" on each thumb, arrows / Page Up / Page Down / Home / End, a range with two
// thumbs. The words arrive as props: `label` names the thumb(s), `formatValue` gives the aria-valuetext and the value
// shown next to a visible label.
import { Slider as SliderPrimitive } from "radix-ui";
import * as React from "react";
import { tv } from "tailwind-variants";

export const slider = tv({
  slots: {
    root: "flex flex-col gap-2",
    header: "flex items-baseline justify-between gap-3 text-xs font-semibold text-fg-secondary",
    value: "font-mono text-[11px] tabular-nums text-fg-secondary",
    control:
      "relative flex h-6 w-full touch-none select-none items-center data-disabled:cursor-not-allowed data-disabled:opacity-40",
    track: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-surface-3",
    range: "absolute h-full rounded-full bg-linear-to-r from-accent to-accent-2",
    thumb:
      "block h-5 w-5 cursor-grab rounded-full border border-border-strong bg-fg-on-media shadow-md transition-[box-shadow] " +
      "focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-ring/50 active:cursor-grabbing",
  },
});

export type SliderValue = number | [number, number];

export type SliderProps<V extends SliderValue = number> = Omit<
  React.ComponentProps<typeof SliderPrimitive.Root>,
  "value" | "defaultValue" | "onValueChange" | "onValueCommit" | "children"
> & {
  /** One number (a thumb) or two (a range). Controlled with `onValueChange`. */
  value?: V;
  defaultValue?: V;
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
  /** Fills from this value instead of the minimum (a ±range from 0: brightness, balance). One thumb only. */
  origin?: number;
};

const toArray = (v: SliderValue | undefined) => (v === undefined ? undefined : typeof v === "number" ? [v] : v);

/** A slider on one value or a range: `value`/`defaultValue` + `onValueChange`, `min`, `max`, `step`. */
export function Slider<V extends SliderValue = number>({
  value,
  defaultValue,
  onValueChange,
  onValueCommit,
  label,
  thumbLabels,
  formatValue = String,
  showLabel,
  origin,
  min = 0,
  max = 100,
  className,
  ...props
}: SliderProps<V>) {
  const s = slider();
  const range = Array.isArray(value ?? defaultValue);
  const [inner, setInner] = React.useState(() => toArray(defaultValue) ?? [min]);
  const current = toArray(value) ?? inner;
  const out = (next: number[]) => (range ? next : next[0]) as V;
  const pct = (v: number) => ((v - min) / (max - min || 1)) * 100;
  const fill =
    origin !== undefined && !range
      ? { left: `${Math.min(pct(origin), pct(current[0]))}%`, right: `${100 - Math.max(pct(origin), pct(current[0]))}%` }
      : undefined;
  const id = React.useId();
  return (
    <div className={s.root({ className })} data-range={range ? "" : undefined}>
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
          {fill ? <span data-origin="" className={s.range()} style={fill} /> : <SliderPrimitive.Range className={s.range()} />}
        </SliderPrimitive.Track>
        {current.map((v, i) => (
          <SliderPrimitive.Thumb
            key={i}
            aria-label={range ? (thumbLabels?.[i] ?? label) : showLabel ? undefined : label}
            aria-labelledby={!range && showLabel ? `${id}-label` : undefined}
            aria-valuetext={formatValue(v)}
            className={s.thumb()}
          />
        ))}
      </SliderPrimitive.Root>
    </div>
  );
}
