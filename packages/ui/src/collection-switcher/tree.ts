// Pure helpers of the collection switcher: the nesting of a flat list, and what may be removed. No React and no web
// component: the native switcher imports this file.
import type { DefaultAvatar } from "../avatar/default-avatar";

export type CollectionItem = {
  /** A stable id. */
  id: string;
  /** Its name — it is the user's own text, never translated. */
  name: string;
  /** The collection it is nested in; `null`/missing for a root. An unknown parent makes it a root (nothing is lost). */
  parentId?: string | null;
  /** The default collection: marked, and never removable. */
  isDefault?: boolean;
  /** How many items it holds. */
  count?: number;
  /** Its picture (a shop or studio in `entity` mode). */
  avatar?: { src?: string | null; defaultAvatar?: DefaultAvatar };
};

export type CollectionBranch = { item: CollectionItem; children: CollectionBranch[] };

/** The forest of a flat list, in the order given; a cycle or an unknown parent never hides a collection. */
export function collectionTree(items: readonly CollectionItem[]): CollectionBranch[] {
  const byId = new Map(items.map((item) => [item.id, item]));
  const branches = new Map<string, CollectionBranch>(items.map((item) => [item.id, { item, children: [] }]));
  const roots: CollectionBranch[] = [];
  const reaches = (start: string, target: string): boolean => {
    const seen = new Set<string>();
    for (let id: string | null | undefined = start; id && !seen.has(id); id = byId.get(id)?.parentId) {
      if (id === target) return true;
      seen.add(id);
    }
    return false;
  };
  for (const item of items) {
    const parent = item.parentId && item.parentId !== item.id && byId.has(item.parentId) && !reaches(item.parentId, item.id) ? branches.get(item.parentId) : undefined;
    (parent ? parent.children : roots).push(branches.get(item.id)!);
  }
  return roots;
}

/** The default collection is never removable. */
export const isRemovable = (item: CollectionItem): boolean => !item.isDefault;
