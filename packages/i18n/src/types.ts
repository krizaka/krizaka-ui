/**
 * The types of a message catalogue. `en.json` (the reference) gives the shape; every other locale has the same one.
 * A key is the dotted path to a leaf (`"auction.phase.SOLD"`); a leaf is a message string or a set of plural forms.
 */
import type { PluralForms } from "@krizaka/intl/plural";

/** A value a message may hold: a string, a plural set, a nested branch, or a list (long structured content). */
export type MessageValue = string | Dictionary | readonly MessageValue[];

/** A message catalogue, as `import en from "./messages/en.json"` types it. */
export interface Dictionary {
  readonly [key: string]: MessageValue;
}

/** A value a placeholder accepts. */
export type PlaceholderValue = string | number;

/** The values handed to `format` / `t`: `{ count: 3, name: "Ada" }`. */
export type Values = Readonly<Record<string, PlaceholderValue | null | undefined>>;

/** The plural categories a plural set may carry (`zero` is the explicit "exactly 0" form). */
export type PluralCategory = keyof PluralForms;

/** A plural set as it sits in a catalogue: `{ "one": "{count} bid", "other": "{count} bids" }`. */
export type PluralMessage = PluralForms<string>;

type Join<P extends string, K extends string> = P extends "" ? K : `${P}.${K}`;

/** True when T is a plural set: an object whose keys are plural categories, `other` included. */
type IsPlural<T> = T extends { other: string }
  ? Exclude<keyof T, PluralCategory> extends never
    ? true
    : false
  : false;

/**
 * Every key of a catalogue: the dotted path to each string and each plural set. Lists are not keys (read them as a
 * branch with `getDictionary`). `MessageKey<typeof en>` → `"home.title" | "auction.bids" | …`.
 */
export type MessageKey<D, P extends string = ""> = D extends readonly unknown[]
  ? never
  : {
      [K in keyof D & string]: D[K] extends string
        ? Join<P, K>
        : IsPlural<D[K]> extends true
          ? Join<P, K>
          : D[K] extends readonly unknown[]
            ? never
            : D[K] extends object
              ? MessageKey<D[K], Join<P, K>>
              : never;
    }[keyof D & string];

/** The message at a key: `MessageAt<typeof en, "home.title">`. */
export type MessageAt<D, K extends string> = K extends `${infer H}.${infer R}`
  ? H extends keyof D
    ? MessageAt<D[H], R>
    : never
  : K extends keyof D
    ? D[K]
    : never;

/** The `{placeholders}` of a literal message type: `Placeholders<"{count} of {total}">` → `"count" | "total"`. */
export type Placeholders<S extends string> = S extends `${string}{${infer N}}${infer R}`
  ? N extends `${string}${" " | "{"}${string}`
    ? Placeholders<R>
    : N | Placeholders<R>
  : never;

/**
 * The arguments `t` takes after the key. A message typed as a literal (a catalogue written `as const`) requires its
 * placeholders; a plural set requires `count`; a message typed `string` (a JSON import widens literals) takes any values.
 */
export type ValuesArgs<M> =
  IsPlural<M> extends true
    ? [values: Values & { readonly count: number }]
    : M extends string
      ? string extends M
        ? [values?: Values]
        : [Placeholders<M>] extends [never]
          ? [values?: Values]
          : [values: Values & { readonly [N in Placeholders<M>]: PlaceholderValue }]
      : [values?: Values];

/** A translator bound to one locale: `t("auction.bids", { count: 3 })`. */
export type Translate<D> = <K extends MessageKey<D>>(key: K, ...values: ValuesArgs<MessageAt<D, K>>) => string;
