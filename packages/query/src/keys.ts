/**
 * `defineKeys` — one typed key factory per resource, so an invalidation and the query it targets can never drift
 * apart: `videoKeys.all` invalidates everything about videos, `videoKeys.detail(id)` one of them.
 */

// A tuple as the contextual return type: `(id: string) => [id]` is inferred as `[string]`, not `string[]`.
type KeyParts = readonly [] | readonly [unknown, ...unknown[]];
type KeyBuilders = Record<string, (...args: never[]) => KeyParts>;

export type ResourceKeys<S extends string, B extends KeyBuilders> = { readonly all: readonly [S] } & {
  readonly [K in keyof B & string]: (...args: Parameters<B[K]>) => readonly [S, K, ...ReturnType<B[K]>];
};

/**
 * ```ts
 * export const videoKeys = defineKeys("videos", {
 *   list: (filters: { q?: string }) => [filters],
 *   detail: (id: string) => [id],
 * });
 * videoKeys.all;              // ["videos"]
 * videoKeys.list({ q: "" });  // ["videos", "list", { q: "" }]
 * videoKeys.detail("v1");     // ["videos", "detail", "v1"]
 * ```
 */
export function defineKeys<const S extends string, const B extends KeyBuilders>(scope: S, builders: B): ResourceKeys<S, B> {
  if ("all" in builders) throw new Error('defineKeys: "all" is reserved (the scope key)');
  const keys: Record<string, unknown> = { all: Object.freeze([scope]) };
  for (const [name, build] of Object.entries(builders)) {
    keys[name] = (...args: never[]) => Object.freeze([scope, name, ...build(...args)]);
  }
  return Object.freeze(keys) as ResourceKeys<S, B>;
}
