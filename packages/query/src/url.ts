/**
 * The URL as state: nuqs behind the Krizaka door (ADR-006, krizaka-ui 2027). A product never imports `nuqs`; the version
 * of this package is the contract. A filter, a tab, a page or a sort lives in the address (shareable, back button works),
 * read with `useQueryState` / `useQueryStates` and the `parseAs*` parsers, never in a client effect.
 * `withUrlDefaults` gives a parser the Krizaka options: `replace` history (no back-button flood), shallow (no server
 * round trip), the default value cleared from the address. Mount the adapter once: `@krizaka/query/url/next`.
 * Server Components read the same keys with `@krizaka/query/url/server`.
 */
import type { Options, SingleParserBuilder } from "nuqs";

export * from "nuqs";

/** The options every Krizaka URL state shares. */
export const URL_DEFAULTS = { history: "replace", shallow: true, clearOnDefault: true } as const satisfies Options;

/** A parser with the Krizaka options: `useQueryState("tab", withUrlDefaults(parseAsString).withDefault("all"))`. */
export function withUrlDefaults<T>(parser: SingleParserBuilder<T>): SingleParserBuilder<T> {
  return parser.withOptions(URL_DEFAULTS);
}
