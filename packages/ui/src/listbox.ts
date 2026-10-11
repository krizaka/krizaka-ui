// The ARIA 1.2 combobox engine shared by `combobox`, `tag-input` and `search-field` (client): the focus stays in the
// text input, the active option is pointed at by `aria-activedescendant`, the arrows walk the enabled options, Enter
// picks, Escape closes. The caller renders the input and the options; this hook gives them their ARIA and keys.
import * as React from "react";

export type ListboxOptions = {
  /** How many options are shown. */
  count: number;
  /** Whether option `i` can be picked. */
  isDisabled?: (index: number) => boolean;
  /** Called when option `i` is picked (Enter or a click). */
  onPick: (index: number) => void;
  /** Whether the list is shown. */
  open: boolean;
  /** Opens or closes the list. */
  setOpen: (open: boolean) => void;
};

export function useListbox({ count, isDisabled = () => false, onPick, open, setOpen }: ListboxOptions) {
  const id = React.useId();
  const listId = `${id}-list`;
  const [chosen, setActive] = React.useState(-1);
  // The active option is cleared when the list closes and stays inside it when it shrinks.
  const active = open ? Math.min(chosen, count - 1) : -1;
  const optionId = (index: number) => `${id}-opt-${index}`;

  const step = (from: number, delta: 1 | -1) => {
    for (let i = 1; i <= count; i += 1) {
      const next = (from + delta * i + count * 2) % count;
      if (!isDisabled(next)) return next;
    }
    return -1;
  };
  const first = () => step(-1, 1);
  const last = () => step(count, -1);

  /** Keys of the text input. Returns `true` when the key was handled (the caller then does nothing else with it). */
  const onKeyDown = (event: React.KeyboardEvent): boolean => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) {
          setOpen(true);
          setActive(event.altKey ? -1 : first());
        } else setActive(active < 0 ? first() : step(active, 1));
        return true;
      case "ArrowUp":
        event.preventDefault();
        if (!open) {
          setOpen(true);
          setActive(last());
        } else setActive(active < 0 ? last() : step(active, -1));
        return true;
      case "Home":
      case "End":
        if (!open || count === 0) return false;
        event.preventDefault();
        setActive(event.key === "Home" ? first() : last());
        return true;
      case "Enter":
        if (!open || active < 0) return false;
        event.preventDefault();
        onPick(active);
        return true;
      case "Escape":
        if (!open) return false;
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
        return true;
      case "Tab":
        if (open) setOpen(false);
        return false;
      default:
        return false;
    }
  };

  // Keeps the active option in view while the arrows walk a long list.
  React.useEffect(() => {
    if (active < 0 || typeof document === "undefined") return;
    document.getElementById(`${id}-opt-${active}`)?.scrollIntoView?.({ block: "nearest" });
  }, [active, id]);

  return {
    listId,
    active,
    setActive,
    optionId,
    onKeyDown,
    /** The ARIA of the text input. */
    inputProps: {
      role: "combobox" as const,
      "aria-expanded": open,
      "aria-controls": listId,
      "aria-autocomplete": "list" as const,
      "aria-activedescendant": open && active >= 0 ? optionId(active) : undefined,
    },
    /** The ARIA and pointer handlers of option `i` (a mouse down keeps the focus in the input). */
    optionProps: (index: number, selected: boolean) => ({
      id: optionId(index),
      role: "option" as const,
      "aria-selected": selected,
      "aria-disabled": isDisabled(index) || undefined,
      "data-active": index === active ? "" : undefined,
      onMouseDown: (event: React.MouseEvent) => event.preventDefault(),
      onMouseMove: () => !isDisabled(index) && index !== active && setActive(index),
      onClick: () => !isDisabled(index) && onPick(index),
    }),
  };
}
