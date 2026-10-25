// The development warning of a deprecated entry (ADR-006 §7, krizaka-ui#674). An entry is deprecated in a minor and
// removed in the next major; until then it works exactly as before and says so once per page, in development only —
// never in production, never twice. The same facts live in the entry's `meta.ts` (`status: "deprecated"`), which
// ui.krizaka.com reads for its badge.

/** The release that deprecated the batch. */
export const DEPRECATED_SINCE = "3.55.0";
/** The major that removes it. */
export const REMOVED_IN = "4.0.0";

const warned = new Set<string>();

/**
 * Warns once per page, in development, that `@krizaka/ui/<entry>` is deprecated. Call it at the top of the entry's
 * components; it costs a `Set` lookup and nothing in production.
 * @param entry the entry's name as imported: `tree-view` for `@krizaka/ui/tree-view`.
 * @param since the release that deprecated it, when it is not this batch's.
 */
export function warnDeprecated(entry: string, since: string = DEPRECATED_SINCE): void {
  if (typeof process === "undefined" || process.env.NODE_ENV === "production" || warned.has(entry)) return;
  warned.add(entry);
  console.warn(
    `@krizaka/ui/${entry} is deprecated since ${since} and is removed in ${REMOVED_IN} (ADR-006): no product uses it. ` +
      `Keep it? Comment on krizaka-ui#674 with the issue that needs it. https://ui.krizaka.com/components/${entry.replace(/^native\//, "")}`,
  );
}

/** Forgets what was warned (tests only). */
export function resetDeprecationWarnings(): void {
  warned.clear();
}
