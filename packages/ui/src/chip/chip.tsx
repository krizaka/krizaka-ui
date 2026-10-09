// Client (a context). A chip is a pressable pill: alone it is a Radix Toggle (aria-pressed), inside `Chip.Group` an
// item of a Radix Toggle Group (roving focus with the arrows; `single` = radio semantics, `multiple` = pressed
// buttons). A `removable` chip is a static label with its own remove button (two buttons cannot nest).
import { Toggle as TogglePrimitive, ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const chip = tv({
  slots: {
    group: "flex flex-wrap items-center gap-2 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
    base:
      "inline-flex shrink-0 select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-full border font-semibold transition-colors " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 " +
      "border-border-default bg-surface-1 text-fg-secondary hover:border-border-strong hover:text-fg " +
      "data-[state=on]:border-accent data-[state=on]:bg-accent-soft data-[state=on]:text-fg",
    remove:
      "-mr-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-fg-secondary transition-colors hover:bg-surface-3 hover:text-fg " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
  },
  variants: {
    size: { sm: { base: "h-7 px-3 text-xs" }, md: { base: "h-9 px-3.5 text-xs" } },
  },
  defaultVariants: { size: "md" },
});

export type ChipVariants = VariantProps<typeof chip>;

type GroupContext = { size: ChipVariants["size"] };
const ChipGroupContext = React.createContext<GroupContext | null>(null);

function RemoveIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

type ToggleChipProps = Omit<React.ComponentProps<"button">, "value" | "defaultValue"> &
  ChipVariants & {
    /**
     * sm · md (inside `Chip.Group`, the group's size by default).
     * @default "md"
     */
    size?: ChipVariants["size"];
    /** Inside `Chip.Group`: the value this chip stands for (required there, ignored alone). */
    value?: string;
    /** Alone: pressed or not (`defaultSelected` uncontrolled), `onSelectedChange` on every press. */
    selected?: boolean;
    /** Alone: pressed at first, uncontrolled. */
    defaultSelected?: boolean;
    /** Alone: called with the new state on every press. */
    onSelectedChange?: (selected: boolean) => void;
    /** A pressable chip (the default); `true` makes it a static chip with a remove button. */
    removable?: false;
  };

type RemovableChipProps = Omit<React.ComponentProps<"span">, "onSelect"> &
  ChipVariants & {
    /** A static chip (a chosen tag, an applied filter) with a remove button. */
    removable: true;
    /** The accessible name of the remove button — passed translated, e.g. "Remove #night". */
    removeLabel: string;
    /** Runs when the remove button is pressed. */
    onRemove: () => void;
    /** Disables the remove button. */
    disabled?: boolean;
  };

export type ChipProps = ToggleChipProps | RemovableChipProps;

/** A selectable pill (`selected` / `onSelectedChange`), an item of `Chip.Group` (`value`), or `removable`. */
function ChipBase(props: ChipProps) {
  const group = React.useContext(ChipGroupContext);
  if (props.removable) {
    const { removable: _removable, removeLabel, onRemove, disabled, size, className, children, ...rest } = props;
    const s = chip({ size: size ?? group?.size });
    return (
      <span data-removable="" className={s.base({ className })} {...rest}>
        {children}
        <button type="button" aria-label={removeLabel} title={removeLabel} disabled={disabled} onClick={onRemove} className={s.remove()}>
          <RemoveIcon />
        </button>
      </span>
    );
  }
  const { removable: _removable, value, selected, defaultSelected, onSelectedChange, size, className, ...rest } = props;
  const s = chip({ size: size ?? group?.size });
  if (group) {
    if (value === undefined) throw new Error("Chip: a chip inside Chip.Group needs a `value`.");
    return <ToggleGroupPrimitive.Item value={value} className={s.base({ className })} {...rest} />;
  }
  return (
    <TogglePrimitive.Root
      pressed={selected}
      defaultPressed={defaultSelected}
      onPressedChange={onSelectedChange}
      className={s.base({ className })}
      {...rest}
    />
  );
}

type GroupBase = Omit<React.ComponentProps<"div">, "defaultValue" | "dir"> &
  ChipVariants & {
    /**
     * sm · md: the size of every chip of the group.
     * @default "md"
     */
    size?: ChipVariants["size"];
    /** The group's accessible name — passed translated ("Filter by format"). */
    label?: string;
    /** The arrow keys that move: left / right (horizontal, a row) or up / down (vertical, a column). */
    orientation?: "horizontal" | "vertical";
    /** Arrow keys wrap from the last chip to the first (default `true`). */
    loop?: boolean;
    /** Disables every chip of the group. */
    disabled?: boolean;
  };

export type ChipGroupProps =
  | (GroupBase & {
      /** One choice: the chips behave as radios. */
      type: "single";
      /** The chosen value (controlled), `""` when none. */
      value?: string;
      /** The value chosen at first, uncontrolled. */
      defaultValue?: string;
      /** Called with the new value on every choice. */
      onValueChange?: (value: string) => void;
      /** Keeps one chip selected: pressing the selected chip does not clear it (default `false`). */
      required?: boolean;
    })
  | (GroupBase & {
      /** Any number of choices: the chips are pressed buttons. */
      type: "multiple";
      /** The chosen values (controlled). */
      value?: string[];
      /** The values chosen at first, uncontrolled. */
      defaultValue?: string[];
      /** Called with the new values on every press. */
      onValueChange?: (value: string[]) => void;
      required?: never;
    });

/** Chips that choose together: `type` single · multiple, `value`/`defaultValue` + `onValueChange`. */
export function ChipGroup({ label, size, className, children, ...props }: ChipGroupProps) {
  const s = chip({ size });
  const context = React.useMemo(() => ({ size }), [size]);
  const common = { "aria-label": label, className: s.group({ className }) };
  let group: React.ReactNode;
  if (props.type === "single") {
    const { type: _type, value, defaultValue, onValueChange, required, ...rest } = props;
    group = <SingleGroup {...rest} {...common} value={value} defaultValue={defaultValue} onValueChange={onValueChange} required={required}>{children}</SingleGroup>;
  } else {
    const { type: _type, required: _required, ...rest } = props;
    group = (
      <ToggleGroupPrimitive.Root type="multiple" {...rest} {...common}>
        {children}
      </ToggleGroupPrimitive.Root>
    );
  }
  return <ChipGroupContext.Provider value={context}>{group}</ChipGroupContext.Provider>;
}

/** Radix's single group, plus `required`: the value is held here so that an empty change can be refused. */
function SingleGroup({
  value,
  defaultValue,
  onValueChange,
  required,
  ...props
}: Omit<GroupBase, "size" | "label"> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
}) {
  const [inner, setInner] = React.useState(defaultValue ?? "");
  const current = value ?? inner;
  return (
    <ToggleGroupPrimitive.Root
      type="single"
      value={current}
      onValueChange={(next) => {
        if (required && !next) return;
        if (value === undefined) setInner(next);
        onValueChange?.(next);
      }}
      {...props}
    />
  );
}

/** `Chip` (selectable, removable) and `Chip.Group` (single · multiple). */
export const Chip = Object.assign(ChipBase, { Group: ChipGroup });
