// Client. The ARIA 1.2 combobox (`../listbox`): a text input that filters a listbox, the focus never leaves the input
// (`aria-activedescendant`), the number of results announced in a polite live region. Static options filtered here,
// or `onSearch` (debounced, the previous request aborted) for a server's; one value or several (chips, Backspace
// removes the last), and new values created from the query when `creatable`.
import { useDebouncedCallback } from "@krizaka/pacer/react";
import * as React from "react";
import { tv } from "tailwind-variants";

import { Chip } from "../chip";
import { CheckGlyph, ChevronGlyph, CloseGlyph, PlusGlyph } from "../glyphs";
import { useListbox } from "../listbox";
import { useControllable } from "../media";

export const combobox = tv({
  slots: {
    root: "relative flex w-full flex-col gap-1.5",
    label: "text-xs font-semibold text-fg-secondary",
    control:
      "flex min-h-11 w-full flex-wrap items-center gap-1.5 rounded-lg border border-border-default bg-surface-2 py-1.5 pl-2 pr-1 text-sm text-fg " +
      "transition-[border-color,box-shadow] focus-within:border-accent focus-within:ring-2 focus-within:ring-ring " +
      "data-[invalid]:border-danger data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
    input: "h-8 min-w-24 flex-1 bg-transparent px-1 text-sm text-fg outline-hidden placeholder:text-fg-muted disabled:cursor-not-allowed",
    icon:
      "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-fg-secondary hover:bg-surface-3 hover:text-fg " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
    list: "absolute inset-x-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-lg border border-border-default bg-surface-2 p-1 shadow-lg",
    option:
      "flex cursor-pointer select-none items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-fg " +
      "data-[active]:bg-surface-3 aria-disabled:cursor-not-allowed aria-disabled:opacity-40",
    check: "h-4 w-4 shrink-0 text-fg-accent",
    description: "block text-xs text-fg-secondary",
    status: "px-2.5 py-3 text-sm text-fg-secondary",
    hint: "text-xs text-fg-secondary",
    error: "flex items-center gap-1.5 text-xs font-medium text-fg-danger before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-danger",
  },
});

export type ComboboxOption = {
  /** What the app stores. */
  value: string;
  /** What the person reads, passed translated. */
  label: string;
  /** A second line under the label. */
  description?: string;
  /** Shown but not choosable. */
  disabled?: boolean;
};

export type ComboboxLabels = {
  /** No option matches ("No results"). */
  empty: string;
  /** While `onSearch` runs ("Searching…"). */
  loading: string;
  /** `onSearch` failed ("Search unavailable"). */
  error: string;
  /** The option that creates a value: `(query) => "Create “" + query + "”"`. */
  create: (query: string) => string;
  /** A chip's remove button: `(label) => "Remove " + label`. */
  remove: (label: string) => string;
  /** The button that empties a single choice ("Clear"). */
  clear: string;
  /** The button that opens the list ("Show options"). */
  toggle: string;
  /** Announced when the results change: `(n) => n + " results"`. */
  results: (count: number) => string;
};

export const comboboxLabels: ComboboxLabels = {
  empty: "No results",
  loading: "Searching…",
  error: "Search unavailable",
  create: (query) => `Create “${query}”`,
  remove: (label) => `Remove ${label}`,
  clear: "Clear",
  toggle: "Show options",
  results: (count) => (count === 1 ? "1 result" : `${count} results`),
};

type BaseProps = {
  /** The visible label of the field, passed translated (also its accessible name). */
  label: string;
  /** Hides the label visually, keeping it as the accessible name (a search bar with its own context). */
  hideLabel?: boolean;
  /** The options, filtered as the person types (by `filter`). */
  options?: readonly ComboboxOption[];
  /** Fetches the options for a query (debounced by `debounce`); the `signal` aborts when a newer query starts. */
  onSearch?: (query: string, signal: AbortSignal) => Promise<readonly ComboboxOption[]>;
  /** The wait, in ms, between the last key and `onSearch`. Default 250. */
  debounce?: number;
  /** Whether an option matches a query. Default: its label contains the query, ignoring case and accents. */
  filter?: (option: ComboboxOption, query: string) => boolean;
  /** Offers to create the query as a new value when no option has that exact label. */
  creatable?: boolean;
  /** Turns a query into the created option (an id from the server…). Default `{ value: query, label: query }`. */
  onCreate?: (query: string) => ComboboxOption;
  /** Keys that create the query at once, as Enter does (`[","]` for tags); a paste is split on them too. */
  separators?: readonly string[];
  /** The input's placeholder, passed translated. */
  placeholder?: string;
  /** A help text under the field. */
  hint?: string;
  /** An error under the field: marks it invalid and is read with it. */
  error?: string;
  /** Not available. */
  disabled?: boolean;
  /** The name of a hidden input holding the value(s), for a plain `<form>` post. */
  name?: string;
  /** The words, passed translated; English by default. */
  labels?: Partial<ComboboxLabels>;
  /** Classes merged on the root. */
  className?: string;
  /** The id of the text input (default: generated). */
  id?: string;
};

type SingleProps = BaseProps & {
  /** One value (default) or several. */
  multiple?: false;
  /** The chosen option (controlled), `null` for none. */
  value?: ComboboxOption | null;
  /** The chosen option at first, uncontrolled. */
  defaultValue?: ComboboxOption | null;
  /** Called with the chosen option, or `null` when it is cleared. */
  onValueChange?: (value: ComboboxOption | null) => void;
  /** Most options that can be chosen (several values only). */
  maxSelected?: never;
};

type MultipleProps = BaseProps & {
  /** Several values, shown as chips. */
  multiple: true;
  /** The chosen options (controlled). */
  value?: readonly ComboboxOption[];
  /** The chosen options at first, uncontrolled. */
  defaultValue?: readonly ComboboxOption[];
  /** Called with every chosen option. */
  onValueChange?: (value: ComboboxOption[]) => void;
  /** Most options that can be chosen; the list stops offering more past it. */
  maxSelected?: number;
};

export type ComboboxProps = SingleProps | MultipleProps;

const fold = (text: string) => text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
const defaultFilter = (option: ComboboxOption, query: string) => fold(option.label).includes(fold(query.trim()));

type Item = { kind: "option"; option: ComboboxOption } | { kind: "create"; query: string };

/** A text field that suggests, filters and completes: one value or several (chips), static or fetched, creatable. */
export function Combobox(props: ComboboxProps) {
  const {
    label,
    hideLabel,
    options,
    onSearch,
    debounce = 250,
    filter = defaultFilter,
    creatable,
    onCreate = (query: string) => ({ value: query, label: query }),
    separators,
    placeholder,
    hint,
    error,
    disabled,
    name,
    labels: given,
    className,
    id: givenId,
  } = props;
  const labels = { ...comboboxLabels, ...given };
  const s = combobox();
  const autoId = React.useId();
  const inputId = givenId ?? `${autoId}-input`;
  const hintId = `${autoId}-hint`;
  const errorId = `${autoId}-error`;
  const multiple = props.multiple === true;

  const [values, setValues] = useControllable<readonly ComboboxOption[]>(
    props.value === undefined ? undefined : multiple ? (props.value as readonly ComboboxOption[]) : props.value ? [props.value as ComboboxOption] : [],
    multiple ? ((props.defaultValue as readonly ComboboxOption[]) ?? []) : props.defaultValue ? [props.defaultValue as ComboboxOption] : [],
    (next) => (multiple ? (props.onValueChange as ((v: ComboboxOption[]) => void) | undefined)?.([...next]) : (props.onValueChange as ((v: ComboboxOption | null) => void) | undefined)?.(next[0] ?? null)),
  );
  const single = multiple ? null : (values[0] ?? null);
  const [query, setQuery] = React.useState(single?.label ?? "");
  const [editing, setEditing] = React.useState(false);
  const [open, setOpenState] = React.useState(false);
  const [remote, setRemote] = React.useState<{ query: string; options: readonly ComboboxOption[]; state: "idle" | "loading" | "error" }>({ query: "", options: [], state: "idle" });
  const request = React.useRef<AbortController | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // The single choice's label shows in the input while the person is not typing.
  const shownQuery = !multiple && !editing ? (single?.label ?? "") : query;
  const searchQuery = editing ? query : "";

  const search = useDebouncedCallback((text: string) => {
    if (!onSearch) return;
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    onSearch(text, controller.signal).then(
      (found) => !controller.signal.aborted && setRemote({ query: text, options: found, state: "idle" }),
      () => !controller.signal.aborted && setRemote({ query: text, options: [], state: "error" }),
    );
  }, debounce);
  React.useEffect(() => () => request.current?.abort(), []);

  const setOpen = (next: boolean) => {
    if (next && onSearch && remote.state === "idle" && remote.query !== searchQuery) {
      setRemote((r) => ({ ...r, state: "loading" }));
      search(searchQuery);
    }
    setOpenState(next);
  };

  const chosen = new Set(values.map((v) => v.value));
  const source = onSearch ? remote.options : (options ?? []).filter((o) => !searchQuery.trim() || filter(o, searchQuery));
  const full = multiple && props.maxSelected !== undefined && values.length >= props.maxSelected;
  const trimmed = searchQuery.trim();
  const exact = [...source, ...values].some((o) => fold(o.label) === fold(trimmed));
  const items: Item[] = [
    ...source.map((option) => ({ kind: "option" as const, option })),
    ...(creatable && trimmed && !exact && !full ? [{ kind: "create" as const, query: trimmed }] : []),
  ];
  const isDisabled = (i: number) => {
    const item = items[i];
    if (!item) return true;
    if (item.kind === "create") return false;
    return Boolean(item.option.disabled) || (full && !chosen.has(item.option.value));
  };

  const commit = (option: ComboboxOption) => {
    if (multiple) {
      setValues(chosen.has(option.value) ? values.filter((v) => v.value !== option.value) : [...values, option]);
      setQuery("");
      listbox.setActive(-1);
    } else {
      setValues([option]);
      setQuery(option.label);
      setEditing(false);
      setOpenState(false);
    }
  };
  const create = (text: string) => {
    const clean = text.trim();
    if (!clean || full) return;
    const existing = [...source, ...values].find((o) => fold(o.label) === fold(clean));
    if (multiple && existing && chosen.has(existing.value)) {
      setQuery("");
      return;
    }
    commit(existing ?? onCreate(clean));
  };
  const pick = (i: number) => {
    const item = items[i];
    if (!item) return;
    if (item.kind === "create") create(item.query);
    else commit(item.option);
  };

  const listbox = useListbox({ count: items.length, isDisabled, onPick: pick, open, setOpen });

  const onChange = (text: string) => {
    setQuery(text);
    setEditing(true);
    listbox.setActive(-1);
    if (onSearch) {
      setRemote((r) => ({ ...r, state: "loading" }));
      search(text);
    }
    setOpenState(true);
    if (!multiple && text === "" && single) setValues([]);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (separators?.includes(event.key) && query.trim()) {
      event.preventDefault();
      create(query);
      return;
    }
    if (listbox.onKeyDown(event)) return;
    if (event.key === "Enter" && creatable && query.trim()) {
      event.preventDefault();
      create(query);
    } else if (event.key === "Backspace" && multiple && query === "" && values.length > 0) {
      setValues(values.slice(0, -1));
    } else if (event.key === "Escape" && !multiple && editing) {
      setEditing(false);
      setQuery(single?.label ?? "");
    }
  };

  const onPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    if (!separators?.length || !multiple) return;
    const text = event.clipboardData.getData("text");
    const parts = text.split(new RegExp(`[${separators.map((c) => c.replace(/[\\\]^-]/g, "\\$&")).join("")}\\n]`)).map((p) => p.trim()).filter(Boolean);
    if (parts.length < 2) return;
    event.preventDefault();
    const next = [...values];
    for (const part of parts) {
      if (props.maxSelected !== undefined && next.length >= props.maxSelected) break;
      if (next.some((v) => fold(v.label) === fold(part))) continue;
      next.push((options ?? []).find((o) => fold(o.label) === fold(part)) ?? onCreate(part));
    }
    setValues(next);
  };

  const loading = Boolean(onSearch) && remote.state === "loading";
  const failed = Boolean(onSearch) && remote.state === "error";
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div
      className={s.root({ className })}
      onBlur={(event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
        setOpenState(false);
        if (!multiple) {
          setEditing(false);
          setQuery(single?.label ?? "");
        }
      }}
    >
      <label htmlFor={inputId} className={hideLabel ? "sr-only" : s.label()}>
        {label}
      </label>
      <div className={s.control()} data-invalid={error ? "" : undefined} data-disabled={disabled ? "" : undefined} onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          event.preventDefault();
          inputRef.current?.focus();
        }
      }}>
        {multiple &&
          values.map((option) => (
            <Chip key={option.value} size="sm" removable removeLabel={labels.remove(option.label)} disabled={disabled} onRemove={() => setValues(values.filter((v) => v.value !== option.value))}>
              {option.label}
            </Chip>
          ))}
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          autoComplete="off"
          spellCheck={false}
          {...listbox.inputProps}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          aria-busy={loading || undefined}
          value={shownQuery}
          placeholder={multiple && values.length > 0 ? undefined : placeholder}
          disabled={disabled}
          className={s.input()}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          onClick={() => !open && setOpen(true)}
        />
        {!multiple && single && !disabled ? (
          <button type="button" aria-label={labels.clear} className={s.icon()} onClick={() => {
            setValues([]);
            setQuery("");
            inputRef.current?.focus();
          }}>
            <CloseGlyph className="h-4 w-4" />
          </button>
        ) : null}
        <button type="button" tabIndex={-1} aria-label={labels.toggle} aria-expanded={open} aria-controls={listbox.listId} disabled={disabled} className={s.icon()} onClick={() => {
          setOpen(!open);
          inputRef.current?.focus();
        }}>
          <ChevronGlyph direction={open ? "up" : "down"} className="h-4 w-4" />
        </button>
      </div>
      {name && values.map((v) => <input key={v.value} type="hidden" name={name} value={v.value} />)}
      <div id={listbox.listId} role="listbox" aria-label={label} aria-multiselectable={multiple || undefined} hidden={!open || (items.length === 0 && !loading && !failed && !labels.empty)} className={s.list()}>
        {open && loading && items.length === 0 ? <div className={s.status()}>{labels.loading}</div> : null}
        {open && failed ? <div className={s.status()}>{labels.error}</div> : null}
        {open && !loading && !failed && items.length === 0 && labels.empty ? <div className={s.status()}>{labels.empty}</div> : null}
        {open &&
          items.map((item, i) =>
            item.kind === "create" ? (
              <div key="__create" {...listbox.optionProps(i, false)} className={s.option()}>
                <PlusGlyph className={s.check()} />
                {labels.create(item.query)}
              </div>
            ) : (
              <div key={item.option.value} {...listbox.optionProps(i, chosen.has(item.option.value))} className={s.option()}>
                <span className="flex h-4 w-4 shrink-0 items-center justify-center">{chosen.has(item.option.value) ? <CheckGlyph className={s.check()} /> : null}</span>
                <span className="min-w-0 flex-1">
                  {item.option.label}
                  {item.option.description ? <span className={s.description()}>{item.option.description}</span> : null}
                </span>
              </div>
            ),
          )}
      </div>
      <span className="sr-only" aria-live="polite" aria-atomic>
        {open && !loading ? labels.results(items.length) : ""}
      </span>
      {hint ? (
        <p id={hintId} className={s.hint()}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className={s.error()}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
