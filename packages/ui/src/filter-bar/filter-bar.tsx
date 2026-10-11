// Client (menus in a portal). The bar above a list: the controls that narrow it (a SearchField, FilterMenus, a
// DateRangePicker — any child), the filters in force as removable chips, "Clear all", and the count of results in a
// polite live region. It holds no state: the app keeps the filters — in the address, ideally — and the
// `readFilterParams` / `writeFilterParams` helpers move them between a `URLSearchParams` and an object.
import { DropdownMenu as MenuPrimitive } from "radix-ui";
import * as React from "react";

import { Chip } from "../chip";
import { DropdownMenu, menu } from "../dropdown-menu";
import { ChevronGlyph } from "../glyphs";
import { tv } from "../tv";

export const filterBar = tv({
  slots: {
    root: "flex w-full flex-col gap-3",
    controls: "flex w-full flex-wrap items-center gap-2 [&>*]:min-w-0",
    active: "flex flex-wrap items-center gap-2",
    clear:
      "rounded-md px-2 py-1 text-xs font-semibold text-fg-accent hover:bg-surface-2 focus-visible:focus-ring",
    results: "ml-auto text-xs text-fg-secondary tabular-nums",
    trigger:
      "inline-flex h-(--kz-control-field) shrink-0 items-center gap-2 rounded-lg border border-border-default bg-surface-1 bg-sheen px-3.5 text-sm font-semibold text-fg-secondary shadow-raised inset-shadow-edge " +
      "transition-colors hover:border-border-strong hover:text-fg focus-visible:focus-ring " +
      "data-[active]:border-accent data-[active]:bg-accent-soft data-[active]:bg-none data-[active]:text-fg data-[active]:shadow-glow data-[state=open]:border-border-strong",
    count: "inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-bold tabular-nums text-on-accent",
    optionCount: "ml-auto pl-4 text-xs tabular-nums text-fg-secondary",
  },
});

export type ActiveFilter = {
  /** A stable key (`"status:failed"`). */
  id: string;
  /** What the chip says, passed translated ("Status: Failed"). */
  label: string;
  /** Removes this filter. */
  onRemove: () => void;
};

export type FilterBarProps = Omit<React.ComponentProps<"div">, "children" | "results"> & {
  /** The accessible name of the bar ("Filter jobs"), passed translated. */
  label: string;
  /** The controls: `SearchField`, `FilterMenu`, `DateRangePicker`, a `Chip.Group`… */
  children?: React.ReactNode;
  /** The filters in force, each a removable chip. */
  active?: readonly ActiveFilter[];
  /** Clears every filter; the "Clear all" button shows when there is at least one. */
  onClearAll?: () => void;
  /** The "Clear all" button ("Clear filters"), passed translated. */
  clearLabel?: string;
  /** A chip's remove button: `(label) => "Remove " + label`, passed translated. */
  removeLabel?: (label: string) => string;
  /** The count of results ("42 jobs"), announced politely when it changes. */
  results?: string;
};

/** The bar of filters above a list: controls, active filters as chips, clear all, the count of results. */
export function FilterBar({
  label,
  children,
  active = [],
  onClearAll,
  clearLabel = "Clear filters",
  removeLabel = (text) => `Remove ${text}`,
  results,
  className,
  ...props
}: FilterBarProps) {
  const s = filterBar();
  return (
    <div role="group" aria-label={label} className={s.root({ className })} {...props}>
      {children ? <div className={s.controls()}>{children}</div> : null}
      {active.length > 0 || results !== undefined ? (
        <div className={s.active()}>
          {active.map((filter) => (
            <Chip key={filter.id} size="sm" removable removeLabel={removeLabel(filter.label)} onRemove={filter.onRemove}>
              {filter.label}
            </Chip>
          ))}
          {active.length > 0 && onClearAll ? (
            <button type="button" className={s.clear()} onClick={onClearAll}>
              {clearLabel}
            </button>
          ) : null}
          <p className={s.results()} aria-live="polite" aria-atomic>
            {results}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export type FilterOption = {
  /** What the app stores (and puts in the address). */
  value: string;
  /** What the person reads, passed translated. */
  label: string;
  /** How many results it would give: shown on the right. */
  count?: number;
  /** Shown but not choosable. */
  disabled?: boolean;
};

type FilterMenuBase = {
  /** The name of the filter on its button ("Status"), passed translated. */
  label: string;
  /** The choices. */
  options: readonly FilterOption[];
  /** Opens the menu at first (a story, a test). */
  defaultOpen?: boolean;
  /** Classes merged on the button. */
  className?: string;
};

export type FilterMenuProps =
  | (FilterMenuBase & {
      /** Several values (checkboxes, default) or one (radios). */
      multiple?: true;
      /** The values chosen. */
      value: readonly string[];
      /** Called with the values chosen. */
      onValueChange: (value: string[]) => void;
    })
  | (FilterMenuBase & {
      /** One value: the options are radios. */
      multiple: false;
      /** The value chosen, `""` for none. */
      value: string;
      /** Called with the value chosen. */
      onValueChange: (value: string) => void;
    });

/** A filter's button and its menu of options — checkboxes (several values) or radios (one) — with a count of chosen ones. */
export function FilterMenu(props: FilterMenuProps) {
  const { label, options, defaultOpen, className } = props;
  const s = filterBar();
  const m = menu();
  const chosen = props.multiple === false ? (props.value ? [props.value] : []) : props.value;
  const single = props.multiple === false ? options.find((o) => o.value === props.value) : undefined;
  const content = (option: FilterOption) => (
    <>
      {option.label}
      {option.count !== undefined ? <span className={s.optionCount()}>{option.count}</span> : null}
    </>
  );
  return (
    <DropdownMenu.Root defaultOpen={defaultOpen} modal={false}>
      <DropdownMenu.Trigger className={s.trigger({ className })} data-active={chosen.length > 0 ? "" : undefined}>
        {single ? `${label}: ${single.label}` : label}
        {props.multiple !== false && chosen.length > 0 ? <span className={s.count()}>{chosen.length}</span> : null}
        <ChevronGlyph className="h-4 w-4" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start" aria-label={label}>
        {props.multiple === false ? (
          <MenuPrimitive.RadioGroup value={props.value} onValueChange={props.onValueChange}>
            {options.map((option) => (
              <MenuPrimitive.RadioItem key={option.value} value={option.value} disabled={option.disabled} className={m.item()}>
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-border-strong">
                  <MenuPrimitive.ItemIndicator className="h-2 w-2 rounded-full bg-accent" />
                </span>
                {content(option)}
              </MenuPrimitive.RadioItem>
            ))}
          </MenuPrimitive.RadioGroup>
        ) : (
          options.map((option) => (
            <DropdownMenu.CheckboxItem
              key={option.value}
              disabled={option.disabled}
              checked={props.value.includes(option.value)}
              onSelect={(event) => event.preventDefault()}
              onCheckedChange={(checked) =>
                props.onValueChange(checked ? [...props.value, option.value] : props.value.filter((v) => v !== option.value))
              }
            >
              {content(option)}
            </DropdownMenu.CheckboxItem>
          ))
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

/** Filters read from an address: `{ status: ["failed", "running"], q: ["cat"] }` for the keys asked (repeated or comma-separated values). */
export function readFilterParams(params: URLSearchParams, keys: readonly string[]): Record<string, string[]> {
  return Object.fromEntries(
    keys.map((key) => [key, params.getAll(key).flatMap((v) => v.split(",")).map((v) => v.trim()).filter(Boolean)]),
  );
}

/** Filters written into an address (a copy of `base`): empty filters removed, several values comma-separated, the page reset. */
export function writeFilterParams(base: URLSearchParams, filters: Record<string, string | readonly string[] | null | undefined>, resetKey = "page") {
  const next = new URLSearchParams(base);
  for (const [key, value] of Object.entries(filters)) {
    const list = value == null ? [] : typeof value === "string" ? [value] : [...value];
    if (list.filter(Boolean).length === 0) next.delete(key);
    else next.set(key, list.filter(Boolean).join(","));
  }
  if (resetKey) next.delete(resetKey);
  return next;
}
