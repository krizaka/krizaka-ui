// Client. A search input (`type="search"` inside a `role="search"` landmark when it stands alone): a leading glyph,
// a clear button, a global shortcut that focuses it (⌘K on Apple devices, Ctrl+K elsewhere, shown as `Kbd`), and
// optional suggestions through the shared combobox engine. `onSearch` is debounced; Enter submits.
import * as React from "react";

import { CloseGlyph, SearchGlyph } from "../glyphs";
import { Kbd } from "../kbd";
import { useListbox } from "../listbox";
import { useControllable, useDebouncedCallback } from "../media";
import { tv } from "../tv";

export const searchField = tv({
  slots: {
    root: "relative w-full",
    control:
      "flex h-(--kz-control-field) w-full items-center gap-2 rounded-lg border border-border-default bg-surface-2 pl-3 pr-1.5 text-sm text-fg " +
      "inset-shadow-well transition-[border-color,box-shadow] duration-(--kz-duration-fast) hover:border-border-strong focus-within:border-ring focus-within:focus-ring-inset focus-within:[corner-top-right-shape:var(--kz-cut-shape)]",
    icon: "h-4 w-4 shrink-0 text-fg-secondary",
    input:
      "h-full min-w-0 flex-1 bg-transparent text-sm text-fg outline-hidden placeholder:text-fg-muted " +
      "[&::-webkit-search-cancel-button]:appearance-none",
    clear:
      "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-fg-secondary hover:bg-surface-3 hover:text-fg " +
      "focus-visible:focus-ring",
    shortcut: "hidden shrink-0 items-center gap-0.5 pr-1 sm:flex",
    list: "absolute inset-x-0 top-full z-50 mt-1 max-h-72 overflow-y-auto rounded-xl border glass p-1 shadow-floating inset-shadow-edge",
    option: "flex cursor-pointer select-none items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-fg data-[active]:bg-accent-soft",
    group: "px-2.5 pb-1 pt-2 text-[11px] font-semibold uppercase text-fg-muted",
  },
  variants: {
    size: { md: {}, sm: { control: "h-9", clear: "h-7 w-7" } },
  },
  defaultVariants: { size: "md" },
});

export type SearchSuggestion = {
  /** What `onSuggestionSelect` receives. */
  value: string;
  /** What the person reads. */
  label: string;
  /** A small text on the right ("Creator", "12 videos"). */
  meta?: string;
};

export type SearchFieldProps = Omit<React.ComponentProps<"input">, "value" | "defaultValue" | "onChange" | "onSubmit" | "size" | "type"> & {
  /** The accessible name of the input ("Search videos"), passed translated. */
  label: string;
  /** The query (controlled). */
  value?: string;
  /** The query at first, uncontrolled. */
  defaultValue?: string;
  /** Called on every key with the query. */
  onValueChange?: (query: string) => void;
  /** Called with the query once typing pauses (`debounce` ms): fetch the results here. */
  onSearch?: (query: string) => void;
  /** The pause, in ms, before `onSearch`. Default 250. */
  debounce?: number;
  /** Called on Enter (no suggestion active) with the query: go to the results page. */
  onSubmit?: (query: string) => void;
  /** The global key that focuses the field with ⌘ / Ctrl (`"k"`), or `false` for none. Default `false`. */
  shortcut?: string | false;
  /** Suggestions under the field (recent searches, completions). */
  suggestions?: readonly SearchSuggestion[];
  /** A title above the suggestions ("Recent searches"). */
  suggestionsLabel?: string;
  /** Called with a suggestion picked (Enter on it, or a click). */
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  /** The clear button's name ("Clear search"), passed translated. */
  clearLabel?: string;
  /** Wraps the field in a `role="search"` landmark (default) — `false` inside a form that already is one. */
  landmark?: boolean;
  /** md (default) · sm. */
  size?: "md" | "sm";
};

const isApple = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

/** A search box: clear, shortcut, debounced search, submit on Enter, suggestions with the keyboard. */
export function SearchField({
  label,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onSearch,
  debounce = 250,
  onSubmit,
  shortcut = false,
  suggestions,
  suggestionsLabel,
  onSuggestionSelect,
  clearLabel = "Clear search",
  landmark = true,
  size,
  className,
  placeholder,
  ...props
}: SearchFieldProps) {
  const s = searchField({ size });
  const [value, setValue] = useControllable(valueProp, defaultValue, onValueChange);
  const [open, setOpen] = React.useState(false);
  const [apple, setApple] = React.useState(false);
  const input = React.useRef<HTMLInputElement>(null);
  const search = useDebouncedCallback((query: string) => onSearch?.(query), debounce);
  const list = suggestions ?? [];

  const pick = (i: number) => {
    const suggestion = list[i];
    if (!suggestion) return;
    setOpen(false);
    onSuggestionSelect?.(suggestion);
  };
  const listbox = useListbox({ count: list.length, onPick: pick, open: open && list.length > 0, setOpen });

  React.useEffect(() => {
    if (!shortcut) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the platform is only known in the browser (no hydration mismatch)
    setApple(isApple());
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === shortcut.toLowerCase() && (event.metaKey || event.ctrlKey) && !event.altKey) {
        event.preventDefault();
        input.current?.focus();
        input.current?.select();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcut]);

  const change = (query: string) => {
    setValue(query);
    search(query);
    listbox.setActive(-1);
    setOpen(true);
  };

  const field = (
    <div className={s.root({ className })} onBlur={(event) => !event.currentTarget.contains(event.relatedTarget as Node | null) && setOpen(false)}>
      <div className={s.control()}>
        <SearchGlyph className={s.icon()} />
        <input
          ref={input}
          type="search"
          aria-label={label}
          enterKeyHint="search"
          autoComplete="off"
          {...(list.length > 0 ? listbox.inputProps : {})}
          value={value}
          placeholder={placeholder}
          className={s.input()}
          onChange={(event) => change(event.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (list.length > 0 && listbox.onKeyDown(event)) return;
            if (event.key === "Enter") {
              event.preventDefault();
              search.cancel();
              onSearch?.(value);
              onSubmit?.(value);
              setOpen(false);
            } else if (event.key === "Escape" && value) {
              event.preventDefault();
              change("");
            }
          }}
          {...props}
        />
        {value ? (
          <button
            type="button"
            aria-label={clearLabel}
            className={s.clear()}
            onClick={() => {
              change("");
              input.current?.focus();
            }}
          >
            <CloseGlyph className="h-4 w-4" />
          </button>
        ) : shortcut ? (
          <span className={s.shortcut()} aria-hidden>
            <Kbd size="sm">{apple ? "⌘" : "Ctrl"}</Kbd>
            <Kbd size="sm">{shortcut.toUpperCase()}</Kbd>
          </span>
        ) : null}
      </div>
      {list.length > 0 && (
        <div hidden={!open} className={s.list()}>
          {suggestionsLabel ? (
            <div aria-hidden className={s.group()}>
              {suggestionsLabel}
            </div>
          ) : null}
          <div id={listbox.listId} role="listbox" aria-label={suggestionsLabel ?? label}>
            {list.map((suggestion, i) => (
              <div key={suggestion.value} {...listbox.optionProps(i, false)} className={s.option()}>
                <SearchGlyph className="h-3.5 w-3.5 shrink-0 text-fg-muted" />
                <span className="min-w-0 flex-1 truncate">{suggestion.label}</span>
                {suggestion.meta ? <span className="shrink-0 text-xs text-fg-secondary">{suggestion.meta}</span> : null}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
  return landmark ? <div role="search">{field}</div> : field;
}
