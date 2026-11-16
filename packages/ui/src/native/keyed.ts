export type Keyed<T> = { readonly key: string; readonly item: T; readonly index: number };

/**
 * Stable React keys for a list that has no id of its own: the key is what the item is (`id(item)`)
 * plus its rank among the items of the same kind, so it never depends on a position shared with
 * items of another kind. Use it for static, never-reordered lists.
 */
export function keyed<T>(items: readonly T[], id: (item: T) => string): Keyed<T>[] {
  const seen = new Map<string, number>();
  return items.map((item, index) => {
    const base = id(item);
    const rank = seen.get(base) ?? 0;
    seen.set(base, rank + 1);
    return { key: `${base}#${rank}`, item, index };
  });
}
