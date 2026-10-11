// Server-safe. The label ↔ control wiring is HTML (htmlFor / id, aria-describedby): no context.
import type * as React from "react";

import { cn } from "../cn";
import { tv } from "../tv";

// The Krizaka material (BRAND.md §6): what you fill sinks — a well, its inner shade at the top — and lights up when it
// has the focus (the signature ring laid on its border).
const WELL =
  "border border-border-default bg-surface-2 text-sm text-fg inset-shadow-well " +
  "transition-[border-color,box-shadow,background-color] duration-(--kz-duration-fast) hover:border-border-strong";

export const field = tv({
  slots: {
    root: "flex flex-col gap-1.5",
    label: "text-xs font-semibold tracking-[0.005em] text-fg-secondary",
    control:
      `flex h-(--kz-control-field) w-full rounded-lg px-3 ${WELL} placeholder:text-fg-muted ` +
      // Focused, the field wears the griffe: its top-right corner cuts itself.
      "focus-visible:border-ring focus-visible:focus-ring-inset focus-visible:[corner-top-right-shape:var(--kz-cut-shape)] " +
      "disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger",
    hint: "text-xs text-fg-secondary",
    // The message reads in the danger text role (≥ 4.5:1 on every surface, both themes); its mark is the danger node.
    error:
      "flex items-center gap-1.5 text-xs font-medium text-fg-danger " +
      "before:size-1.5 before:shrink-0 before:rotate-45 before:rounded-[1.5px] before:bg-danger",
    selectWrap: "relative flex w-full",
    chevron: "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-secondary",
    // Affixes: the group is the well; the input inside is bare and the focus lights the whole group.
    group:
      `group/field flex h-(--kz-control-field) w-full items-center gap-2 rounded-lg px-3 ${WELL} ` +
      "focus-within:border-ring focus-within:focus-ring-inset focus-within:[corner-top-right-shape:var(--kz-cut-shape)] has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50 " +
      "has-[input[aria-invalid=true]]:border-danger",
    bare: "h-full min-w-0 flex-1 bg-transparent text-sm text-fg outline-hidden placeholder:text-fg-muted disabled:cursor-not-allowed",
    affix: "flex shrink-0 items-center text-fg-secondary [&>svg]:size-4",
    // The floating label rests in the field like a placeholder, and rises above the value when there is one or focus.
    floating: "relative flex w-full",
    floatingControl: "peer h-14 pb-1.5 pt-5 placeholder:text-transparent",
    floatingLabel:
      "pointer-events-none absolute left-3 top-1/2 origin-left -translate-y-1/2 text-sm text-fg-secondary " +
      "transition-[translate,scale,color] duration-(--kz-duration-base) ease-spring " +
      "peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:font-semibold peer-focus:text-fg-accent " +
      "peer-[:not(:placeholder-shown)]:-translate-y-[1.15rem] peer-[:not(:placeholder-shown)]:scale-[0.8] peer-[:not(:placeholder-shown)]:text-fg-secondary",
  },
});
const s = field();

export const Field = {
  Root: ({ className, ...props }: React.ComponentProps<"div">) => <div className={s.root({ className })} {...props} />,
  Label: ({ className, ...props }: React.ComponentProps<"label">) => <label className={s.label({ className })} {...props} />,
  Hint: ({ className, ...props }: React.ComponentProps<"p">) => <p className={s.hint({ className })} {...props} />,
  Error: ({ className, ...props }: React.ComponentProps<"p">) => <p role="alert" className={s.error({ className })} {...props} />,
};

type ControlProps = {
  /** Marks the control invalid: aria-invalid and data-invalid (pair it with a `Field.Error` in aria-describedby). */
  invalid?: boolean;
};

const invalidProps = (invalid?: boolean) => (invalid ? { "aria-invalid": true as const, "data-invalid": "" } : {});

export type InputProps = React.ComponentProps<"input"> &
  ControlProps & {
    /** Shown inside the field, before the text: an icon, a currency, a prefix (`https://`). Decorative unless it says something the label does not. */
    start?: React.ReactNode;
    /** Shown inside the field, after the text: a unit, a shortcut (`<Kbd>`), a small button. */
    end?: React.ReactNode;
  };

/** A text input. With `start` / `end` it becomes a group: the affixes sit inside the well, the focus lights the whole field. */
export function Input({ invalid, start, end, className, ...props }: InputProps) {
  if (start === undefined && end === undefined) {
    return <input {...invalidProps(invalid)} className={s.control({ className })} {...props} />;
  }
  return (
    <span data-slot="input-group" className={s.group({ className })}>
      {start !== undefined && (
        <span data-slot="start" className={s.affix()}>
          {start}
        </span>
      )}
      <input {...invalidProps(invalid)} className={s.bare()} {...props} />
      {end !== undefined && (
        <span data-slot="end" className={s.affix()}>
          {end}
        </span>
      )}
    </span>
  );
}

export type FloatingInputProps = Omit<React.ComponentProps<"input">, "placeholder" | "id"> &
  ControlProps & {
    /** The input's id: the label points at it. */
    id: string;
    /** The label, resting in the field and rising above the value — passed translated. It is the input's name. */
    label: string;
  };

/** An input whose label rests inside it and rises above the value on focus or once filled (CSS only, server-safe). */
export function FloatingInput({ id, label, invalid, className, ...props }: FloatingInputProps) {
  return (
    <span data-slot="floating" className={s.floating()}>
      <input id={id} placeholder=" " {...invalidProps(invalid)} className={s.control({ className: cn(s.floatingControl(), className) })} {...props} />
      <label htmlFor={id} className={s.floatingLabel()}>
        {label}
      </label>
    </span>
  );
}

export function Textarea({ invalid, className, ...props }: React.ComponentProps<"textarea"> & ControlProps) {
  return <textarea {...invalidProps(invalid)} className={s.control({ className: cn("h-auto min-h-24 py-2", className) })} {...props} />;
}

/** A native <select>, styled like the other controls (the platform's menu: accessible and right on phones). */
export function Select({ invalid, className, ...props }: React.ComponentProps<"select"> & ControlProps) {
  return (
    <span className={s.selectWrap()}>
      <select {...invalidProps(invalid)} className={s.control({ className: cn("appearance-none pr-9", className) })} {...props} />
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={s.chevron()}>
        <path d="m6 9 6 6 6-6" />
      </svg>
    </span>
  );
}
