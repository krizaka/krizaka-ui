/**
 * The first case whose condition holds, else the fallback: a flat replacement for a chain of
 * nested ternaries. Every value is evaluated, so keep them cheap and side-effect free.
 */
export function choose<T>(fallback: T, ...cases: readonly (readonly [unknown, T])[]): T {
  for (const [when, value] of cases) if (when) return value;
  return fallback;
}
