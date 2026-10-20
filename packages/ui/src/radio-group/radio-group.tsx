// Client (a context). Radix RadioGroup: role="radiogroup" / "radio", one tab stop, the arrows move and select, a
// hidden input inside a form. Four looks, one behaviour:
// - `RadioGroup.Item`: a dot and its words (a settings list);
// - `RadioGroup.Card`: a whole card is the radio — an amount, a pack, a plan — its check lit when chosen;
// - `RadioGroup.Button`: a tactile key that presses in — raised on a ledge, sunk when chosen (a size, a tip, a level);
// - `RadioGroup.Segment` in `<RadioGroup.Root variant="segmented">`: a segmented control, one light gliding to the choice.
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import * as React from "react";

import { CheckGlyph } from "../glyphs";
import { useSlidingIndicator } from "../sliding-indicator";
import { tv } from "../tv";

export const radioGroup = tv({
  slots: {
    root: "grid gap-2 data-[orientation=horizontal]:flex data-[orientation=horizontal]:flex-wrap",
    item:
      "peer inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border-strong bg-surface-1 inset-shadow-well transition-colors " +
      "focus-visible:outline-hidden focus-visible:focus-ring hover:border-accent disabled:cursor-not-allowed disabled:opacity-40 " +
      "data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=checked]:shadow-glow aria-invalid:border-danger",
    dot: "h-2 w-2 rounded-full bg-on-accent",
    label: "flex cursor-pointer items-start gap-3 text-sm text-fg has-disabled:cursor-not-allowed has-disabled:opacity-60",
    card:
      "group relative flex min-w-0 flex-col items-start gap-1 rounded-2xl border border-border-default bg-surface-1 bg-sheen p-4 pr-10 text-left text-sm text-fg inset-shadow-edge " +
      "transition-[border-color,background-color,box-shadow,transform] duration-200 hover:border-border-strong active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100 " +
      "focus-visible:outline-hidden focus-visible:focus-ring disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:border-danger " +
      "data-[state=checked]:border-accent data-[state=checked]:bg-accent-soft data-[state=checked]:shadow-glow",
    // The card's check: an empty ring at rest, the accent filled with its check once chosen.
    cardCheck:
      "absolute right-3.5 top-3.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-border-strong bg-surface-1 text-on-accent transition-colors " +
      "group-data-[state=checked]:border-accent group-data-[state=checked]:bg-accent",
    // The tactile key: on a ledge (its lower edge), its hairline stronger on hover, pressed in while held and once chosen.
    button:
      "relative inline-flex min-h-12 min-w-12 select-none flex-col items-center justify-center gap-0.5 rounded-xl border border-border-default bg-surface-2 bg-sheen px-4 py-2 " +
      "text-sm font-semibold text-fg inset-shadow-edge shadow-[0_4px_0_0_var(--kz-border-strong)] " +
      "transition-[transform,box-shadow,background-color,border-color,color] duration-100 ease-out motion-reduce:transition-none " +
      "hover:border-border-strong " +
      "active:translate-y-[3px] active:shadow-[0_1px_0_0_var(--kz-border-strong)] " +
      "focus-visible:outline-hidden focus-visible:focus-ring disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:border-danger " +
      "data-[state=checked]:translate-y-[3px] data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=checked]:bg-fill-shade " +
      "data-[state=checked]:text-on-accent data-[state=checked]:inset-shadow-edge-fill data-[state=checked]:shadow-[0_1px_0_0_var(--kz-accent-hover)]",
    buttonHint: "text-[11px] font-medium text-fg-secondary group-data-[state=checked]:text-on-accent",
    segmented:
      "relative isolate inline-grid auto-cols-fr grid-flow-col gap-1 rounded-xl border border-border-default bg-surface-2 p-1 inset-shadow-well " +
      "before:pointer-events-none before:absolute before:left-0 before:top-0 before:-z-10 before:h-(--kz-ind-h) before:w-(--kz-ind-w) " +
      "before:translate-x-(--kz-ind-x) before:translate-y-(--kz-ind-y) before:rounded-lg before:border before:border-border-default before:bg-surface-0 before:bg-sheen " +
      "before:opacity-0 before:shadow-raised before:transition-[translate,width,height,opacity] before:duration-300 motion-reduce:before:transition-none data-[indicator=on]:before:opacity-100",
    segment:
      "inline-flex min-h-9 select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 text-sm font-semibold text-fg-secondary transition-colors " +
      "hover:text-fg focus-visible:outline-hidden focus-visible:focus-ring disabled:cursor-not-allowed disabled:opacity-40 " +
      "data-[state=checked]:border data-[state=checked]:border-border-default data-[state=checked]:bg-surface-0 data-[state=checked]:text-fg data-[state=checked]:shadow-raised " +
      "group-data-[indicator=on]/seg:data-[state=checked]:border-transparent group-data-[indicator=on]/seg:data-[state=checked]:bg-transparent group-data-[indicator=on]/seg:data-[state=checked]:shadow-none",
  },
  variants: {
    variant: {
      list: {},
      cards: { root: "grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-3" },
      buttons: { root: "flex flex-wrap gap-2.5 pb-1" },
      segmented: {},
    },
  },
  defaultVariants: { variant: "list" },
});
const s = radioGroup();

export type RadioGroupRootProps = React.ComponentProps<typeof RadioGroupPrimitive.Root> & {
  /** The group's accessible name — passed translated (or `aria-labelledby` a visible heading). */
  label?: string;
  /** Marks every radio invalid: aria-invalid (pair it with a `Field.Error`). */
  invalid?: boolean;
  /**
   * The layout of the radios: `list` (dots), `cards` (a grid of `Card`s), `buttons` (a row of tactile `Button`s), or
   * `segmented` (a track of `Segment`s, one light gliding to the choice).
   * @default "list"
   */
  variant?: "list" | "cards" | "buttons" | "segmented";
};

/** `value`/`defaultValue` + `onValueChange`, `orientation`, `required`, `name` for a form, `variant` for the layout. */
export function RadioGroupRoot({ label, invalid, variant = "list", className, ...props }: RadioGroupRootProps) {
  const { ref } = useSlidingIndicator<HTMLDivElement>({ item: "[role=radio]", active: "[role=radio][data-state=checked]" });
  const segmented = variant === "segmented";
  return (
    <RadioGroupPrimitive.Root
      ref={segmented ? ref : undefined}
      aria-label={label}
      aria-invalid={invalid || undefined}
      data-invalid={invalid ? "" : undefined}
      data-variant={variant}
      orientation={segmented ? "horizontal" : props.orientation}
      className={segmented ? s.segmented({ className: ["group/seg", className].filter(Boolean).join(" ") }) : radioGroup({ variant }).root({ className })}
      {...props}
    />
  );
}

export type RadioGroupItemProps = Omit<React.ComponentProps<typeof RadioGroupPrimitive.Item>, "children"> & {
  /** The words next to the dot, clickable. Otherwise name it with `Field.Label htmlFor` or `aria-label`. */
  children?: React.ReactNode;
};

/** A radio: a dot, and its words when given. */
export function RadioGroupItem({ className, children, ...props }: RadioGroupItemProps) {
  const item = (
    <RadioGroupPrimitive.Item className={s.item({ className: children ? "mt-0.5" : className })} {...props}>
      <RadioGroupPrimitive.Indicator className={s.dot()} />
    </RadioGroupPrimitive.Item>
  );
  if (!children) return item;
  return (
    <label className={s.label({ className })}>
      {item}
      <span className="min-w-0">{children}</span>
    </label>
  );
}

/** A whole card as the radio: its content is the radio's name; its check lights up when chosen. */
export function RadioGroupCard({ className, children, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item className={s.card({ className })} {...props}>
      {children}
      <span aria-hidden className={s.cardCheck()}>
        <RadioGroupPrimitive.Indicator forceMount className="inline-flex data-[state=unchecked]:hidden">
          <CheckGlyph className="h-3 w-3" />
        </RadioGroupPrimitive.Indicator>
      </span>
    </RadioGroupPrimitive.Item>
  );
}

export type RadioGroupButtonProps = React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
  /** A second line under the words ("+15 %"), part of the radio's name. */
  hint?: React.ReactNode;
};

/** A tactile key: raised on its ledge, pressed in while held and once chosen — sizes, a tip, a level. */
export function RadioGroupButton({ className, children, hint, ...props }: RadioGroupButtonProps) {
  return (
    <RadioGroupPrimitive.Item className={s.button({ className: ["group", className].filter(Boolean).join(" ") })} {...props}>
      <span>{children}</span>
      {hint ? <span className={s.buttonHint()}>{hint}</span> : null}
    </RadioGroupPrimitive.Item>
  );
}

/** A segment of a `variant="segmented"` group: equal widths, one light gliding to the choice. */
export function RadioGroupSegment({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return <RadioGroupPrimitive.Item className={s.segment({ className })} {...props} />;
}

/** `RadioGroup.Root/Item/Card/Button/Segment`. */
export const RadioGroup = { Root: RadioGroupRoot, Item: RadioGroupItem, Card: RadioGroupCard, Button: RadioGroupButton, Segment: RadioGroupSegment };
