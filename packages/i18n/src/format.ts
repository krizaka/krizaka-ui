import type { PluralMessage, Values } from "./types";

/** A `{name}` placeholder: letters, digits and `_`. */
export const PLACEHOLDER = /\{(\w+)\}/g;

/** The plural categories, in CLDR order (`zero` first: the explicit "exactly 0" form). */
export const PLURAL_CATEGORIES = ["zero", "one", "two", "few", "many", "other"] as const;

/**
 * Replaces the `{name}` placeholders of a message: `format("{count} repositories", { count: 23 })` → `"23 repositories"`.
 * A placeholder without a value (missing, `null` or `undefined`) stays as written, so a gap is visible, never silent.
 */
export function format(message: string, values: Values = {}): string {
  return message.replace(PLACEHOLDER, (match, name: string) => {
    const value = Object.hasOwn(values, name) ? values[name] : undefined;
    return value === undefined || value === null ? match : String(value);
  });
}

/** The placeholder names of a message, sorted and without duplicates: `"{b} {a} {b}"` → `["a", "b"]`. */
export function placeholdersOf(message: string): string[] {
  return [...new Set([...message.matchAll(PLACEHOLDER)].map((m) => m[1] as string))].sort();
}

/** True when a catalogue value is a plural set: an object of plural categories with an `other` string. */
export function isPluralMessage(value: unknown): value is PluralMessage {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const keys = Object.keys(value);
  return (
    typeof (value as { other?: unknown }).other === "string" &&
    keys.every((k) => (PLURAL_CATEGORIES as readonly string[]).includes(k) && typeof (value as Record<string, unknown>)[k] === "string")
  );
}
