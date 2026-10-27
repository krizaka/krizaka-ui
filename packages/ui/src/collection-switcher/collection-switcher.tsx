// Client (the open state of the entity popover, the tree's keyboard). Moves between the collections of a workspace — or,
// in `entity` mode, between the shops or studios of an account. The current one is held by the URL: the product passes
// `value` from it and navigates in `onValueChange` (or gives `href`, and each row is a real link).
import * as React from "react";

import { Avatar } from "../avatar";
import { cn } from "../cn";
import { ChevronGlyph, CloseGlyph, PlusGlyph } from "../glyphs";
import { Popover } from "../popover";
import { type CollectionBranch, type CollectionItem, collectionTree, isRemovable } from "./tree";

export type CollectionSwitcherProps = {
  /** The collections, flat; `parentId` nests them in the `tree` layout. */
  collections: readonly CollectionItem[];
  /** The current one (read from the URL), or `null`. */
  value: string | null;
  /** The viewer chooses a collection: navigate (push the URL). */
  onValueChange?: (id: string) => void;
  /** Gives each row of the `list` layout a real address (open in a new tab, SSR); a click still calls `onValueChange`. */
  href?: (id: string) => string;
  /** The accessible name (“Collections”) — passed translated. */
  label: string;
  /**
   * `list`: a flat list. `tree`: the nesting by `parentId`, as nested lists (every row stays a link or a button, in the tab order).
   * @default "list"
   */
  layout?: "list" | "tree";
  /**
   * `collection`: the list or the tree itself. `entity`: a compact button showing the current one that opens it, to switch shop or studio from the shell.
   * @default "collection"
   */
  mode?: "collection" | "entity";
  /** The mark on the default collection (“Default”), passed translated. */
  defaultLabel: string;
  /** Removes a collection — never offered on the default one. Without it there is no remove action. */
  onRemove?: (id: string) => void;
  /** The remove button's accessible name for a collection (“Remove Archive”), passed translated. */
  removeLabel?: (name: string) => string;
  /** Adds a collection: a row at the end. Without it there is none. */
  onCreate?: () => void;
  /** The create row's words (“New collection”), passed translated. */
  createLabel?: string;
  /** Classes merged last, on the switcher. */
  className?: string;
};

function Row({ branch, value, props }: { branch: CollectionBranch; value: string | null; props: CollectionSwitcherProps & { close?: () => void } }) {
  const { item, children } = branch;
  const current = item.id === value;
  const { href, onValueChange, defaultLabel, onRemove, removeLabel, close } = props;
  const content = (
    <>
      {item.avatar ? <Avatar size="xs" alt="" {...item.avatar} /> : null}
      <span className="min-w-0 flex-1 truncate">{item.name}</span>
      {item.isDefault ? <span className="shrink-0 rounded-full border border-border-default px-1.5 text-[11px] text-fg-secondary">{defaultLabel}</span> : null}
      {item.count !== undefined ? <span className="shrink-0 text-xs tabular-nums text-fg-muted">{item.count}</span> : null}
    </>
  );
  const shared = {
    "aria-current": current ? ("page" as const) : undefined,
    className: cn(
      "flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-start text-sm text-fg hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-ring",
      current && "bg-surface-2 font-medium",
    ),
    onClick: () => {
      onValueChange?.(item.id);
      close?.();
    },
  };
  return (
    <li data-collection={item.id}>
      <div className="flex items-center gap-1">
      {href ? (
        <a href={href(item.id)} {...shared}>
          {content}
        </a>
      ) : (
        <button type="button" {...shared}>
          {content}
        </button>
      )}
      {onRemove && isRemovable(item) ? (
        <button
          type="button"
          aria-label={removeLabel?.(item.name) ?? item.name}
          onClick={() => onRemove(item.id)}
          className="shrink-0 rounded-md p-1.5 text-fg-muted hover:bg-surface-2 hover:text-fg focus-visible:outline-2 focus-visible:outline-ring"
        >
          <CloseGlyph aria-hidden className="h-3.5 w-3.5" />
        </button>
      ) : null}
      </div>
      {children.length ? (
        <ul className="m-0 ms-4 flex list-none flex-col gap-0.5 border-s border-border-subtle p-0 ps-1">
          {children.map((child) => (
            <Row key={child.item.id} branch={child} value={value} props={props} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function Body(props: CollectionSwitcherProps & { close?: () => void }) {
  const { collections, value, label, layout = "list", onCreate, createLabel, close } = props;
  const branches = React.useMemo(() => (layout === "tree" ? collectionTree(collections) : collections.map((item) => ({ item, children: [] }))), [collections, layout]);
  const create = onCreate ? (
    <button
      type="button"
      onClick={() => {
        onCreate();
        close?.();
      }}
      className="mt-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-start text-sm text-fg-secondary hover:bg-surface-2 hover:text-fg focus-visible:outline-2 focus-visible:outline-ring"
    >
      <PlusGlyph aria-hidden className="h-3.5 w-3.5" />
      {createLabel}
    </button>
  ) : null;
  return (
    <nav aria-label={label}>
      <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
        {branches.map((branch) => (
          <Row key={branch.item.id} branch={branch} value={value} props={props} />
        ))}
      </ul>
      {create}
    </nav>
  );
}

/** The collections of a workspace — or the shops of an account — to move between; the default one marked and never removable. */
export function CollectionSwitcher(props: CollectionSwitcherProps) {
  const { mode = "collection", collections, value, label, className } = props;
  const [open, setOpen] = React.useState(false);
  if (mode === "collection") {
    return (
      <div className={className} data-collection-switcher>
        <Body {...props} />
      </div>
    );
  }
  const current = collections.find((c) => c.id === value);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label={current ? `${current.name}, ${label}` : label}
          className={cn(
            "inline-flex max-w-full items-center gap-2 rounded-md border border-border-control bg-surface-1 px-2.5 py-1.5 text-sm text-fg hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            className,
          )}
          data-collection-switcher
        >
          {current?.avatar ? <Avatar size="xs" alt="" {...current.avatar} /> : null}
          <span className="min-w-0 truncate">{current?.name ?? label}</span>
          <ChevronGlyph aria-hidden className="h-3.5 w-3.5 shrink-0 text-fg-muted" />
        </button>
      </Popover.Trigger>
      <Popover.Content align="start" className="w-72 p-2">
        <Body {...props} close={() => setOpen(false)} />
      </Popover.Content>
    </Popover.Root>
  );
}
