// Client. Interests, languages, a workspace's tags: toggle chips with a limit and a count; once it is reached the others
// rest (disabled) and the count says so. An option with a `marker` is a tag with a colour beside its name (`TagChip`).
// `creatable` adds a field: Enter takes the typed word — the tag of that name if it exists, else a new one the host creates
// (`onCreate`, with the marker chosen from the closed palette) — and the typed word narrows the tags offered.
import * as React from "react";

import { Chip, type Marker, MarkerPicker, TagChip } from "../chip";

export type TagOption = {
  value: string;
  label: string;
  /** A tag's colour: a name of the closed palette (`@krizaka/organize` `MARKERS`). Without it, a plain chip. */
  marker?: Marker;
};

type CreatableProps = {
  /** Adds a field: Enter chooses the tag typed, or asks the host to create it. */
  creatable?: boolean;
  /** Called with the new name (trimmed, as typed) and the marker chosen; the host creates the tag (it may refuse), adds the option and chooses it. */
  onCreate?: (name: string, marker: Marker) => void;
  /** The field's accessible name ("Add a tag"), passed translated. */
  inputLabel?: string;
  /** The field's placeholder, passed translated. */
  placeholder?: string;
  /** The create button: `(name) => "Create “" + name + "”"`, passed translated. */
  createLabel?: (name: string) => string;
  /** The name of each colour, passed translated: shows the colour choice beside the field. */
  markerNames?: Readonly<Record<Marker, string>>;
  /** The colour choice's accessible name ("Colour of the new tag"). */
  markerLabel?: string;
  /** The colour a new tag starts with (default `blue`). */
  defaultMarker?: Marker;
  /** The most characters of a name (default 80, the contract's `NAME_MAX`). */
  maxLength?: number;
  /** What is said when nothing matches and creating is not offered (“No tag of that name”), passed translated. */
  emptyLabel?: string;
};

export type TagSelectorProps = CreatableProps & {
  /** The group's name (“Interests”) — passed translated. */
  label: string;
  /** The tags offered. */
  options: readonly TagOption[];
  /** The tags chosen. */
  value: readonly string[];
  /** Called with the tags chosen. */
  onValueChange: (value: string[]) => void;
  /** The most that can be chosen. */
  max?: number;
  /** The count under the tags: `(n, max) => n + " of " + max`. */
  countLabel?: (count: number, max: number) => string;
  /** Classes merged on the root. */
  className?: string;
};

/** The options whose label holds the typed text, and those already chosen. */
const matching = (options: readonly TagOption[], needle: string, value: readonly string[]) =>
  options.filter((o) => o.label.toLocaleLowerCase().includes(needle) || value.includes(o.value));

/** One toggle chip: a marked tag wears its marker; the others rest once the limit is reached. */
function OptionChip({ option, on, full, onToggle }: { option: TagOption; on: boolean; full: boolean; onToggle: (next: boolean) => void }) {
  const props = { selected: on, disabled: !on && full, onSelectedChange: onToggle };
  return option.marker ? (
    <TagChip marker={option.marker} {...props}>
      {option.label}
    </TagChip>
  ) : (
    <Chip {...props}>{option.label}</Chip>
  );
}

type FieldKeyContext = {
  draft: string;
  value: readonly string[];
  commit: () => void;
  onValueChange: (next: string[]) => void;
  setDraft: (next: string) => void;
};

/** The typed field's keys: Enter commits, Backspace on an empty field takes the last tag back, Escape clears the draft. */
function fieldKey(event: React.KeyboardEvent<HTMLInputElement>, { draft, value, commit, onValueChange, setDraft }: FieldKeyContext) {
  if (event.key === "Enter") {
    event.preventDefault();
    commit();
  } else if (event.key === "Backspace" && !draft && value.length > 0) {
    onValueChange(value.slice(0, -1));
  } else if (event.key === "Escape" && draft) {
    event.stopPropagation();
    setDraft("");
  }
}

const reached = (max: number | undefined, count: number) => max !== undefined && count >= max;

type CommitArgs = {
  typed: string;
  exact: TagOption | undefined;
  canCreate: boolean;
  full: boolean;
  value: readonly string[];
  marker: Marker;
  onValueChange: (value: string[]) => void;
  onCreate?: (name: string, marker: Marker) => void;
  setDraft: (draft: string) => void;
};

/** Enter or the button: pick the option the text names, or create it; nothing happens when neither applies. */
function commitDraft({ typed, exact, canCreate, full, value, marker, onValueChange, onCreate, setDraft }: CommitArgs) {
  if (!typed) return;
  if (exact) {
    if (value.includes(exact.value) || full) {
      setDraft("");
      return;
    }
    onValueChange([...value, exact.value]);
  } else if (canCreate) {
    onCreate?.(typed, marker);
  } else return;
  setDraft("");
}

/** Toggle chips with a limit and a count — the others rest once the limit is reached; `creatable` types a new one. */
export function TagSelector({
  label,
  options,
  value,
  onValueChange,
  max,
  countLabel,
  className,
  creatable,
  onCreate,
  inputLabel,
  placeholder,
  createLabel = (name) => `Create “${name}”`,
  markerNames,
  markerLabel,
  defaultMarker = "blue",
  maxLength = 80,
  emptyLabel,
}: TagSelectorProps) {
  const full = reached(max, value.length);
  const [draft, setDraft] = React.useState("");
  const [marker, setMarker] = React.useState<Marker>(defaultMarker);
  const typed = draft.replace(/\s+/g, " ").trim();
  const needle = typed.toLocaleLowerCase();
  const exact = options.find((o) => o.label.toLocaleLowerCase() === needle);
  const shown = creatable && needle ? matching(options, needle, value) : options;
  const canCreate = Boolean(creatable && onCreate && typed && !exact && !full);
  const toggle = (option: TagOption, on: boolean) => onValueChange(on ? [...value, option.value] : value.filter((v) => v !== option.value));

  const commit = () => commitDraft({ typed, exact, canCreate, full, value, marker, onValueChange, onCreate, setDraft });
  const listId = React.useId();

  return (
    <div className={["flex flex-col gap-2", className].filter(Boolean).join(" ")}>
      <div role="group" aria-label={label} id={listId} className="flex flex-wrap gap-2">
        {shown.map((option) => (
          <OptionChip key={option.value} option={option} on={value.includes(option.value)} full={full} onToggle={(next) => toggle(option, next)} />
        ))}
        {creatable && needle && shown.length === 0 && !canCreate && emptyLabel ? <p className="m-0 text-xs text-fg-secondary">{emptyLabel}</p> : null}
      </div>
      {creatable ? (
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={draft}
            maxLength={maxLength}
            aria-label={inputLabel ?? label}
            aria-controls={listId}
            placeholder={placeholder}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => fieldKey(event, { draft, value, commit, onValueChange, setDraft })}
            className="h-9 min-w-40 flex-1 rounded-md border border-border-control bg-surface-1 px-3 text-sm text-fg placeholder:text-fg-muted focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
          />
          {canCreate ? (
            <>
              {markerNames ? <MarkerPicker label={markerLabel ?? label} names={markerNames} value={marker} onValueChange={setMarker} /> : null}
              <button
                type="button"
                onClick={commit}
                className="inline-flex h-9 items-center rounded-md border border-accent bg-accent-soft px-3 text-xs font-semibold text-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
              >
                {createLabel(typed)}
              </button>
            </>
          ) : null}
        </div>
      ) : null}
      {max !== undefined && countLabel ? (
        <p className={["m-0 text-xs", full ? "font-semibold text-fg-accent" : "text-fg-secondary"].join(" ")} aria-live="polite">
          {countLabel(value.length, max)}
        </p>
      ) : null}
    </div>
  );
}
