// Client. Interests, languages, what one is looking for: toggle chips with a limit and a count; once it is reached the
// others rest (disabled) and the count says so.
import { Chip } from "../chip";

export type TagOption = { value: string; label: string };

export type TagSelectorProps = {
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

/** Toggle chips with a limit and a count — the others rest once the limit is reached. */
export function TagSelector({ label, options, value, onValueChange, max, countLabel, className }: TagSelectorProps) {
  const full = max !== undefined && value.length >= max;
  return (
    <div className={["flex flex-col gap-2", className].filter(Boolean).join(" ")}>
      <div role="group" aria-label={label} className="flex flex-wrap gap-2">
        {options.map((option) => {
          const on = value.includes(option.value);
          return (
            <Chip key={option.value} selected={on} disabled={!on && full} onSelectedChange={(next) => onValueChange(next ? [...value, option.value] : value.filter((v) => v !== option.value))}>
              {option.label}
            </Chip>
          );
        })}
      </div>
      {max !== undefined && countLabel ? (
        <p className={["m-0 text-xs", full ? "font-semibold text-fg-accent" : "text-fg-secondary"].join(" ")} aria-live="polite">
          {countLabel(value.length, max)}
        </p>
      ) : null}
    </div>
  );
}
