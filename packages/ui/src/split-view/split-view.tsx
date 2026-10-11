// Server-safe. A list and the item open beside it, read from the products' inboxes and queues (messages, moderation,
// jobs): two panes on a desktop; on a phone one at a time — the list, or the open item with the way back — chosen by
// `showDetail` (the address says which item is open: URL = state).
import type * as React from "react";
import { tv } from "tailwind-variants";

export const splitView = tv({
  slots: {
    root:
      "grid w-full min-h-[min(40rem,calc(100dvh-8rem))] overflow-hidden rounded-xl border border-border-default bg-surface-1 " +
      "md:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)]",
    list: "flex min-h-0 min-w-0 flex-col border-border-subtle md:border-r data-[hidden-on-phone]:hidden md:data-[hidden-on-phone]:flex",
    listHead: "flex h-14 shrink-0 items-center gap-2 border-b border-border-subtle px-4",
    listTitle: "text-sm font-bold text-fg",
    listBody: "min-h-0 flex-1 overflow-y-auto",
    detail: "flex min-h-0 min-w-0 flex-col bg-surface-0 data-[hidden-on-phone]:hidden md:data-[hidden-on-phone]:flex",
    detailHead: "flex h-14 shrink-0 items-center gap-2 border-b border-border-subtle px-4",
    back: "md:hidden",
    detailBody: "min-h-0 flex-1 overflow-y-auto p-4 md:p-6",
    empty: "flex flex-1 items-center justify-center p-8 text-center text-sm text-fg-secondary",
  },
});
const s = splitView();

export type SplitViewProps = React.ComponentProps<"div"> & {
  /** The list pane's title (`Messages`): it names the region. */
  listTitle: React.ReactNode;
  /** Actions in the list's head (a search, a filter, a new item). */
  listActions?: React.ReactNode;
  /** The items (a list of links, a DataTable). */
  list: React.ReactNode;
  /** The open item's head: its name, its actions. */
  detailHead?: React.ReactNode;
  /** The open item, or nothing. */
  detail?: React.ReactNode;
  /** What the detail pane says when nothing is open (desktop). */
  empty?: React.ReactNode;
  /** On a phone, the open item replaces the list. Usually: an item is selected in the address. */
  showDetail?: boolean;
  /** The way back to the list on a phone: your router's link (`<Link href="/inbox">Messages</Link>`). */
  back?: React.ReactNode;
  /** The list pane's accessible name when `listTitle` is not text. */
  listLabel?: string;
};

/** A list and its open item: two panes on a desktop, one at a time on a phone. */
export function SplitView({ listTitle, listActions, list, detailHead, detail, empty, showDetail = false, back, listLabel, className, ...props }: SplitViewProps) {
  return (
    <div className={s.root({ className })} {...props}>
      <section className={s.list()} aria-label={listLabel} data-hidden-on-phone={showDetail ? "" : undefined}>
        <div className={s.listHead()}>
          <h2 className={s.listTitle()}>{listTitle}</h2>
          <div className="ml-auto flex items-center gap-1.5">{listActions}</div>
        </div>
        <div className={s.listBody()}>{list}</div>
      </section>
      <section className={s.detail()} data-hidden-on-phone={showDetail ? undefined : ""}>
        {(back || detailHead) && (
          <div className={s.detailHead()}>
            {back && <div className={s.back()}>{back}</div>}
            {detailHead}
          </div>
        )}
        {detail ? <div className={s.detailBody()}>{detail}</div> : <div className={s.empty()}>{empty}</div>}
      </section>
    </div>
  );
}
