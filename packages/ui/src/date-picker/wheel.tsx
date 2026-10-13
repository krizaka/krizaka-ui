// Client. A wheel: a column of values that turns under a lit band — the touch idiom of a time, a date of birth, a
// quantity. Each column is a `spinbutton` for assistive technologies and the keyboard (Up / Down, Page Up / Page Down by
// five, Home / End), its value read as words (`aria-valuetext`); the hand scrolls it (scroll snap) or clicks a value.
// The curve is a scroll-driven animation (CSS `animation-timeline: view()`): no script per frame, flat where unsupported.
import * as React from "react";

import { tv } from "../tv";
import { usePrefersReducedMotion } from "../media";

/** A value of a wheel: what is stored, and its words (passed translated or formatted for the locale). */
export type WheelOption = { value: string; label: string; disabled?: boolean };

export const wheel = tv({
  slots: {
    root: "relative inline-flex select-none items-stretch gap-1 rounded-2xl border border-border-default data-[invalid]:border-danger bg-surface-1 bg-sheen px-2 shadow-raised inset-shadow-edge",
    band: "pointer-events-none absolute inset-x-1.5 top-1/2 -translate-y-1/2 rounded-xl border border-border-subtle bg-surface-3 inset-shadow-well",
    column:
      "relative z-[1] min-w-14 flex-1 rounded-xl outline-hidden focus-visible:focus-ring-inset data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
    scroller:
      "kz-wheel h-full snap-y snap-mandatory overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden " +
      "[mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000_70%,transparent)]",
    item:
      "kz-wheel-item flex snap-center items-center justify-center px-2 text-base tabular-nums text-fg-secondary transition-colors " +
      "data-[selected]:font-semibold data-[selected]:text-fg data-[disabled]:text-fg-muted data-[disabled]:line-through",
    divider: "z-[1] self-center text-base font-semibold text-fg-secondary",
  },
});

const ITEM = 40;

export type WheelProps = {
  /** The column's accessible name ("Hour", "Month"), passed translated. */
  label: string;
  /** The values, in order. */
  options: readonly WheelOption[];
  /** The chosen value (controlled). */
  value?: string | null;
  /** The chosen value at first, uncontrolled. Default: the first one. */
  defaultValue?: string;
  /** Called with the value that comes to rest under the band. */
  onValueChange?: (value: string) => void;
  /** Not available. */
  disabled?: boolean;
  /** Classes merged on the column (a width: `w-20`). */
  className?: string;
};

export type WheelPickerProps = {
  /** The group's accessible name ("Departure time"), passed translated. */
  label: string;
  /** The wheels (`Wheel`), and dividers (`WheelDivider`) between them. */
  children: React.ReactNode;
  /** How many values are visible: 3, 5 (default) or 7. */
  visible?: 3 | 5 | 7;
  /** The help text or the error that describes the group (their ids). */
  "aria-describedby"?: string;
  /** Marks the group invalid (a danger edge): pair it with an error read through `aria-describedby`. */
  invalid?: boolean;
  /** Classes merged on the root. */
  className?: string;
};

const VisibleContext = React.createContext(5);

/** The frame of one or several wheels: a raised surface, the lit band across them, a group named by `label`. */
export function WheelPicker({ label, children, visible = 5, "aria-describedby": describedBy, invalid, className }: WheelPickerProps) {
  const s = wheel();
  return (
    <VisibleContext.Provider value={visible}>
      <div role="group" aria-label={label} aria-describedby={describedBy} data-invalid={invalid ? "" : undefined} className={s.root({ className })} style={{ height: ITEM * visible }}>
        <span aria-hidden className={s.band()} style={{ height: ITEM }} />
        {children}
      </div>
    </VisibleContext.Provider>
  );
}

/** A divider between two wheels (`:` between the hours and the minutes). */
export function WheelDivider({ children }: { children: React.ReactNode }) {
  return (
    <span aria-hidden className={wheel().divider()}>
      {children}
    </span>
  );
}

const nearestEnabled = (options: readonly WheelOption[], index: number) => {
  for (let d = 0; d < options.length; d++) {
    if (options[index + d] && !options[index + d]!.disabled) return index + d;
    if (options[index - d] && !options[index - d]!.disabled) return index - d;
  }
  return index;
};

/** One column of a `WheelPicker`: a spinbutton over a scroll-snapped list of values. */
export function Wheel({ label, options, value: valueProp, defaultValue, onValueChange, disabled, className }: WheelProps) {
  const s = wheel();
  const visible = React.useContext(VisibleContext);
  const [own, setOwn] = React.useState(defaultValue ?? options[0]?.value ?? "");
  const value = valueProp ?? own;
  const index = Math.max(0, options.findIndex((o) => o.value === value));
  const scroller = React.useRef<HTMLDivElement>(null);
  const settle = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const programmatic = React.useRef(false);
  const reduce = usePrefersReducedMotion();
  const mounted = React.useRef(false);

  const commit = React.useCallback(
    (i: number) => {
      const target = nearestEnabled(options, Math.min(options.length - 1, Math.max(0, i)));
      const option = options[target];
      if (!option) return;
      if (valueProp === undefined) setOwn(option.value);
      if (option.value !== value) onValueChange?.(option.value);
    },
    [options, valueProp, value, onValueChange],
  );

  // The list follows the value (a key, a click, a change from outside): at once the first time, smoothly after.
  React.useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const top = index * ITEM;
    if (Math.abs(el.scrollTop - top) < 1) return;
    programmatic.current = true;
    if (typeof el.scrollTo === "function") el.scrollTo({ top, behavior: mounted.current && !reduce ? "smooth" : "auto" });
    else el.scrollTop = top;
    mounted.current = true;
    const t = setTimeout(() => (programmatic.current = false), 400);
    return () => clearTimeout(t);
  }, [index, reduce]);

  const onScroll = () => {
    if (programmatic.current) return;
    if (settle.current) clearTimeout(settle.current);
    settle.current = setTimeout(() => {
      const el = scroller.current;
      if (el) commit(Math.round(el.scrollTop / ITEM));
    }, 90);
  };
  React.useEffect(() => () => void (settle.current && clearTimeout(settle.current)), []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const step = (by: number) => {
      let i = index + by;
      while (options[i]?.disabled) i += Math.sign(by);
      return options[i] ? i : index;
    };
    const moves: Record<string, () => number> = {
      ArrowUp: () => step(-1),
      ArrowDown: () => step(1),
      PageUp: () => Math.max(0, nearestEnabled(options, index - 5)),
      PageDown: () => Math.min(options.length - 1, nearestEnabled(options, index + 5)),
      Home: () => nearestEnabled(options, 0),
      End: () => nearestEnabled(options, options.length - 1),
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    commit(move());
  };

  const pad = ((visible - 1) / 2) * ITEM;
  const current = options[index];
  return (
    <div
      role="spinbutton"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      aria-valuenow={index}
      aria-valuemin={0}
      aria-valuemax={Math.max(0, options.length - 1)}
      aria-valuetext={current?.label}
      aria-disabled={disabled || undefined}
      data-disabled={disabled ? "" : undefined}
      className={s.column({ className })}
      onKeyDown={onKeyDown}
    >
      <div ref={scroller} aria-hidden className={s.scroller()} style={{ paddingBlock: pad, scrollPaddingBlock: pad }} onScroll={onScroll}>
        {options.map((o, i) => (
          <div
            key={o.value}
            data-value={o.value}
            data-selected={i === index ? "" : undefined}
            data-disabled={o.disabled ? "" : undefined}
            className={s.item()}
            style={{ height: ITEM }}
            onClick={() => !o.disabled && commit(i)}
          >
            {o.label}
          </div>
        ))}
      </div>
    </div>
  );
}
