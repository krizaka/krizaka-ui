// Client. Free words as chips — the multiple, creatable `Combobox` on strings: Enter or a separator adds the word,
// a paste of "a, b, c" adds three, Backspace on an empty input removes the last, suggestions complete as you type.
// `normalize` cleans a word (lower case, no `#`), `validate` refuses one with a reason read aloud.
import * as React from "react";

import { Combobox, type ComboboxLabels, type ComboboxOption } from "../combobox";
import { useControllable } from "../media";

export type TagInputProps = {
  /** The visible label, passed translated (also the accessible name). */
  label: string;
  /** Hides the label visually, keeping it as the accessible name. */
  hideLabel?: boolean;
  /** The tags (controlled). */
  value?: readonly string[];
  /** The tags at first, uncontrolled. */
  defaultValue?: readonly string[];
  /** Called with every tag after a change. */
  onValueChange?: (tags: string[]) => void;
  /** Words offered as the person types (their own history, a curated list). */
  suggestions?: readonly string[];
  /** Cleans a word before it is added (`(t) => t.toLowerCase().replace(/^#/, "")`). An empty result is ignored. */
  normalize?: (tag: string) => string;
  /** Refuses a word: return the reason (passed translated), shown and read as the field's error; `null` accepts it. */
  validate?: (tag: string, tags: readonly string[]) => string | null;
  /** Most tags; the field stops offering more past it. */
  max?: number;
  /** Keys that add the word, besides Enter. Default `[","]`. */
  separators?: readonly string[];
  /** The input's placeholder, passed translated. */
  placeholder?: string;
  /** A help text under the field ("Up to 10 tags, separated by commas"). */
  hint?: string;
  /** An error from the app (a server refusal); `validate`'s own errors show here too. */
  error?: string;
  /** Not available. */
  disabled?: boolean;
  /** The name of the hidden inputs, for a plain `<form>` post (one per tag). */
  name?: string;
  /** The words of the field, passed translated; English by default. */
  labels?: Partial<Pick<ComboboxLabels, "create" | "remove" | "empty" | "results" | "toggle">>;
  /** Classes merged on the root. */
  className?: string;
};

const toOption = (tag: string): ComboboxOption => ({ value: tag, label: tag });

/** Words as removable chips — tags, keywords, e-mail recipients — with suggestions, cleaning and validation. */
export function TagInput({
  value,
  defaultValue = [],
  onValueChange,
  suggestions = [],
  normalize = (tag) => tag.trim(),
  validate,
  max,
  separators = [","],
  error,
  labels,
  ...props
}: TagInputProps) {
  const [tags, setTags] = useControllable<readonly string[]>(value, defaultValue, onValueChange as (next: readonly string[]) => void);
  const [refusal, setRefusal] = React.useState<string | null>(null);

  const change = (options: ComboboxOption[]) => {
    const next: string[] = [];
    for (const option of options) {
      const tag = normalize(option.value);
      if (!tag || next.includes(tag)) continue;
      if (!tags.includes(tag)) {
        const reason = validate?.(tag, next) ?? null;
        if (reason) {
          setRefusal(reason);
          continue;
        }
      }
      next.push(tag);
    }
    if (next.length >= options.length || options.length < tags.length) setRefusal(null);
    setTags(next);
  };

  return (
    <Combobox
      {...props}
      multiple
      creatable
      separators={separators}
      maxSelected={max}
      value={tags.map(toOption)}
      onValueChange={change}
      options={suggestions.map(toOption)}
      error={refusal ?? error}
      labels={{ empty: "", results: () => "", ...labels }}
    />
  );
}
