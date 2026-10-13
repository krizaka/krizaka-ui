// Client (expansion, selection, the roving focus). A hierarchy the keyboard walks — the ARIA tree pattern: one tab
// stop, the arrows move and open, Home/End, typing a letter jumps; children loaded on demand when a branch opens.
import * as React from "react";
import { tv } from "tailwind-variants";

import { ChevronGlyph } from "../glyphs";
import { useControllable } from "../media";

export const treeView = tv({
  slots: {
    root: "m-0 list-none p-0 text-sm",
    group: "m-0 list-none p-0",
    row:
      "flex min-h-8 cursor-pointer select-none items-center gap-1.5 rounded-md pr-2 text-fg outline-hidden " +
      "hover:bg-surface-2 data-[selected]:bg-accent-soft data-[selected]:font-semibold data-[disabled]:cursor-default data-[disabled]:opacity-50",
    toggle: "flex h-5 w-5 shrink-0 items-center justify-center text-fg-secondary [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:transition-transform motion-reduce:[&>svg]:transition-none",
    icon: "flex shrink-0 items-center text-fg-secondary [&>svg]:h-4 [&>svg]:w-4",
    label: "min-w-0 flex-1 truncate",
    meta: "shrink-0 text-xs tabular-nums text-fg-secondary",
  },
});

export type TreeNode = {
  /** A stable id. */
  id: string;
  /** Its name — passed translated. */
  label: string;
  /** A decorative icon before the name. */
  icon?: React.ReactNode;
  /** A detail after the name (a count, a size). */
  meta?: React.ReactNode;
  /** Its children; `undefined` for a leaf. With `hasChildren`, they load when it opens (`onLoadChildren`). */
  children?: readonly TreeNode[];
  /** A branch whose children are not loaded yet. */
  hasChildren?: boolean;
  /** Cannot be selected. */
  disabled?: boolean;
};

export type TreeViewProps = {
  /** The roots. */
  nodes: readonly TreeNode[];
  /** The tree's accessible name (“Documentation”). */
  "aria-label": string;
  /** The ids of the open branches (controlled). */
  expanded?: readonly string[];
  /** The ids open at first, uncontrolled. */
  defaultExpanded?: readonly string[];
  /** Called with the open branches. */
  onExpandedChange?: (expanded: string[]) => void;
  /** The selected node (controlled). */
  selected?: string | null;
  /** The selected node at first, uncontrolled. */
  defaultSelected?: string | null;
  /** Called when a node is chosen (click, Enter or Space): navigate, open the file. */
  onSelect?: (node: TreeNode) => void;
  /** Called when a branch with `hasChildren` and no `children` opens: fetch them, then pass them in `nodes`. */
  onLoadChildren?: (node: TreeNode) => void;
  /** The words of a branch that is loading (“Loading”). */
  loadingLabel?: string;
  /** Classes merged on the tree. */
  className?: string;
};

type Flat = { node: TreeNode; level: number; parent: string | null; posinset: number; setsize: number };

const isBranch = (node: TreeNode) => Boolean(node.children?.length || node.hasChildren);

function flatten(nodes: readonly TreeNode[], open: Set<string>, level = 1, parent: string | null = null, out: Flat[] = []): Flat[] {
  nodes.forEach((node, i) => {
    out.push({ node, level, parent, posinset: i + 1, setsize: nodes.length });
    if (open.has(node.id) && node.children) flatten(node.children, open, level + 1, node.id, out);
  });
  return out;
}

/**
 * A hierarchy to browse — documentation sections, a studio's datasets, folders: one tab stop, the arrows walk it (→
 * opens, ← closes or goes up), Home/End, a letter jumps to the next name; branches can load their children on demand.
 */
export function TreeView({
  nodes,
  "aria-label": label,
  expanded: expandedProp,
  defaultExpanded = [],
  onExpandedChange,
  selected: selectedProp,
  defaultSelected = null,
  onSelect,
  onLoadChildren,
  loadingLabel = "Loading",
  className,
}: TreeViewProps) {
  const s = treeView();
  const uid = React.useId();
  const [expanded, setExpanded] = useControllable<readonly string[]>(expandedProp, defaultExpanded, onExpandedChange as (next: readonly string[]) => void);
  const [selected, setSelected] = useControllable<string | null>(selectedProp, defaultSelected);
  const open = new Set(expanded);
  const rows = flatten(nodes, open);
  const [active, setActive] = React.useState<string | null>(null);
  const focusId = active && rows.some((r) => r.node.id === active) ? active : (selected ?? rows[0]?.node.id ?? null);
  const refs = React.useRef(new Map<string, HTMLDivElement>());
  const move = (id: string | undefined) => {
    if (!id) return;
    setActive(id);
    refs.current.get(id)?.focus();
  };
  const toggle = (node: TreeNode, to = !open.has(node.id)) => {
    if (!isBranch(node)) return;
    if (to && node.hasChildren && !node.children) onLoadChildren?.(node);
    setExpanded(to ? [...expanded, node.id] : expanded.filter((id) => id !== node.id));
  };
  const choose = (node: TreeNode) => {
    if (node.disabled) return;
    setSelected(node.id);
    onSelect?.(node);
  };
  const onKeyDown = (event: React.KeyboardEvent, i: number) => {
    const row = rows[i]!;
    const { node } = row;
    const keys: Record<string, () => void> = {
      ArrowDown: () => move(rows[i + 1]?.node.id),
      ArrowUp: () => move(rows[i - 1]?.node.id),
      Home: () => move(rows[0]?.node.id),
      End: () => move(rows[rows.length - 1]?.node.id),
      ArrowRight: () => (isBranch(node) && !open.has(node.id) ? toggle(node, true) : isBranch(node) ? move(rows[i + 1]?.node.id) : undefined),
      ArrowLeft: () => (open.has(node.id) ? toggle(node, false) : move(row.parent ?? undefined)),
      Enter: () => choose(node),
      " ": () => choose(node),
    };
    const run = keys[event.key];
    if (run) {
      event.preventDefault();
      run();
      return;
    }
    if (event.key.length === 1 && /\S/.test(event.key)) {
      const letter = event.key.toLowerCase();
      const next = [...rows.slice(i + 1), ...rows.slice(0, i)].find((r) => r.node.label.toLowerCase().startsWith(letter));
      move(next?.node.id);
    }
  };

  const render = (list: readonly TreeNode[], level: number): React.ReactNode =>
    list.map((node) => {
      const i = rows.findIndex((r) => r.node.id === node.id);
      const row = rows[i]!;
      const branch = isBranch(node);
      const isOpen = open.has(node.id);
      const loading = isOpen && node.hasChildren && !node.children;
      return (
        // The row is the treeitem (its name is its own words, never its children's); the group of children hangs
        // from it with aria-owns, in the `li` that holds both.
        <li key={node.id} role="none">
          <div
            ref={(el) => {
              if (el) refs.current.set(node.id, el);
              else refs.current.delete(node.id);
            }}
            role="treeitem"
            aria-level={level}
            aria-posinset={row.posinset}
            aria-setsize={row.setsize}
            aria-expanded={branch ? isOpen : undefined}
            aria-selected={selected === node.id}
            aria-disabled={node.disabled || undefined}
            aria-busy={loading || undefined}
            aria-owns={branch && isOpen ? `${uid}-${node.id}-group` : undefined}
            tabIndex={node.id === focusId ? 0 : -1}
            onKeyDown={(e) => {
              if (e.target === e.currentTarget) onKeyDown(e, i);
            }}
            onFocus={(e) => {
              if (e.target === e.currentTarget) setActive(node.id);
            }}
            className={s.row({ className: "outline-hidden focus-visible:ring-2 focus-visible:ring-ring" })}
            data-selected={selected === node.id || undefined}
            data-disabled={node.disabled || undefined}
            style={{ paddingLeft: `${(level - 1) * 1.25 + 0.25}rem` }}
            onClick={() => {
              if (branch) toggle(node);
              choose(node);
              move(node.id);
            }}
          >
            <span className={s.toggle()} aria-hidden>
              {branch ? <ChevronGlyph direction={isOpen ? "down" : "right"} /> : null}
            </span>
            {node.icon ? <span className={s.icon()} aria-hidden>{node.icon}</span> : null}
            <span className={s.label()}>{node.label}</span>
            {node.meta ? <span className={s.meta()}>{node.meta}</span> : null}
          </div>
          {branch && isOpen ? (
            <ul role="group" id={`${uid}-${node.id}-group`} className={s.group()}>
              {loading ? (
                <li role="none" className="py-1 text-xs text-fg-secondary" style={{ paddingLeft: `${level * 1.25 + 1.75}rem` }}>
                  {loadingLabel}
                </li>
              ) : (
                render(node.children ?? [], level + 1)
              )}
            </ul>
          ) : null}
        </li>
      );
    });

  return (
    <ul role="tree" aria-label={label} className={s.root({ className })}>
      {render(nodes, 1)}
    </ul>
  );
}
