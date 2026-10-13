// Client (the drag, the keyboard move, the announcements). Cards in columns that move by drag and drop — and by the
// keyboard: Space picks a card up, the arrows carry it (← → between columns, ↑ ↓ within one), Space drops it, Esc puts it
// back. Every move is announced in words. The app owns the data: `onMove` says where a card went.
import * as React from "react";
import { tv } from "tailwind-variants";

export const kanban = tv({
  slots: {
    root: "flex w-full gap-3 overflow-x-auto pb-2",
    column: "flex w-72 shrink-0 flex-col rounded-xl border border-border-default bg-surface-1 data-[over]:border-accent data-[over]:bg-accent-soft/40",
    header: "flex items-center gap-2 px-3 pb-2 pt-3",
    title: "min-w-0 flex-1 truncate text-sm font-semibold text-fg",
    count: "rounded-full bg-surface-3 px-2 text-xs font-semibold tabular-nums text-fg-secondary data-[over-limit]:bg-danger data-[over-limit]:text-on-accent",
    list: "m-0 flex min-h-16 list-none flex-col gap-2 p-2 pt-0",
    card:
      "cursor-grab rounded-lg border border-border-default bg-surface-0 p-3 text-sm text-fg shadow-xs outline-hidden transition-shadow " +
      "focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing data-[grabbed]:ring-2 data-[grabbed]:ring-accent data-[grabbed]:shadow-lg data-[dragging]:opacity-40",
    empty: "rounded-lg border border-dashed border-border-default px-3 py-4 text-center text-xs text-fg-secondary",
  },
});

export type KanbanColumn = {
  /** A stable id. */
  id: string;
  /** Its name — passed translated (“To review”). */
  title: string;
  /** The most cards it should hold: the count turns to danger past it. */
  limit?: number;
};

export type KanbanMove = {
  /** The card moved. */
  cardId: string;
  /** Where it came from. */
  from: string;
  /** The column it went to. */
  to: string;
  /** Its position in that column (0 = top). */
  index: number;
};

export type KanbanLabels = {
  /** The hint read on a card: how to move it with the keyboard. */
  instructions: string;
  /** Announced when a card is picked up: `(card, column) => …`. */
  grabbed: (card: string, column: string) => string;
  /** Announced as it moves: `(card, column, position, total) => …`. */
  moved: (card: string, column: string, position: number, total: number) => string;
  /** Announced when it is dropped. */
  dropped: (card: string, column: string, position: number) => string;
  /** Announced when the move is cancelled. */
  cancelled: (card: string) => string;
  /** A column without card (“No card”). */
  empty: string;
};

export const kanbanLabels: KanbanLabels = {
  instructions: "Press Space to pick it up, the arrow keys to move it, Space to drop it, Escape to cancel.",
  grabbed: (card, column) => `${card} picked up, in ${column}.`,
  moved: (card, column, position, total) => `${card}: ${column}, position ${position} of ${total}.`,
  dropped: (card, column, position) => `${card} dropped in ${column}, position ${position}.`,
  cancelled: (card) => `Move of ${card} cancelled.`,
  empty: "No card",
};

export type KanbanProps<T> = {
  /** The columns, in order. */
  columns: readonly KanbanColumn[];
  /** The cards, in their order within each column. */
  cards: readonly T[];
  /** A card's id. */
  getId: (card: T) => string;
  /** A card's column. */
  getColumn: (card: T) => string;
  /** A card's name, for the announcements. */
  getTitle: (card: T) => string;
  /** What a card shows. */
  renderCard: (card: T) => React.ReactNode;
  /** Called when a card is dropped somewhere new: update the data here. */
  onMove: (move: KanbanMove) => void;
  /** The board's accessible name (“Moderation queue”). */
  "aria-label": string;
  /** The words, passed translated; English by default. */
  labels?: Partial<KanbanLabels>;
  /** Classes merged on the root. */
  className?: string;
};

type Placement = { column: string; index: number };

/**
 * A board of cards in columns — a moderation queue, a release plan: drag and drop with the pointer, or Space and the
 * arrow keys, every step announced. Column limits show in the counts.
 */
export function Kanban<T>({ columns, cards, getId, getColumn, getTitle, renderCard, onMove, "aria-label": label, labels: words, className }: KanbanProps<T>) {
  const labels = { ...kanbanLabels, ...words };
  const s = kanban();
  const instructionsId = React.useId();
  const [grab, setGrab] = React.useState<{ id: string; origin: Placement; at: Placement } | null>(null);
  const [dragging, setDragging] = React.useState<string | null>(null);
  const [over, setOver] = React.useState<Placement | null>(null);
  const [message, setMessage] = React.useState("");
  const refs = React.useRef(new Map<string, HTMLLIElement>());
  const byColumn = (column: string, without?: string) => cards.filter((c) => getColumn(c) === column && getId(c) !== without);
  const titleOf = (id: string) => {
    const card = cards.find((c) => getId(c) === id);
    return card ? getTitle(card) : id;
  };
  const columnTitle = (id: string) => columns.find((c) => c.id === id)?.title ?? id;
  const placementOf = (id: string): Placement => {
    const card = cards.find((c) => getId(c) === id)!;
    const column = getColumn(card);
    return { column, index: byColumn(column).findIndex((c) => getId(c) === id) };
  };
  const commit = (id: string, from: Placement, to: Placement) => {
    if (from.column !== to.column || from.index !== to.index) onMove({ cardId: id, from: from.column, to: to.column, index: to.index });
  };
  // The cards of a column as shown, with the grabbed card at its keyboard position.
  const shown = (column: string) => {
    const list = byColumn(column, grab?.id);
    if (grab && grab.at.column === column) {
      const card = cards.find((c) => getId(c) === grab.id);
      if (card) list.splice(grab.at.index, 0, card);
    }
    return list;
  };
  React.useEffect(() => {
    if (grab) refs.current.get(grab.id)?.focus();
  }, [grab]);

  const onKeyDown = (event: React.KeyboardEvent, id: string) => {
    const title = titleOf(id);
    if (!grab) {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        const origin = placementOf(id);
        setGrab({ id, origin, at: origin });
        setMessage(labels.grabbed(title, columnTitle(origin.column)));
      }
      return;
    }
    const { at, origin } = grab;
    const columnIndex = columns.findIndex((c) => c.id === at.column);
    let next: Placement | null = null;
    if (event.key === "ArrowLeft" && columnIndex > 0) next = { column: columns[columnIndex - 1]!.id, index: Math.min(at.index, byColumn(columns[columnIndex - 1]!.id, id).length) };
    if (event.key === "ArrowRight" && columnIndex < columns.length - 1) next = { column: columns[columnIndex + 1]!.id, index: Math.min(at.index, byColumn(columns[columnIndex + 1]!.id, id).length) };
    if (event.key === "ArrowUp" && at.index > 0) next = { ...at, index: at.index - 1 };
    if (event.key === "ArrowDown" && at.index < byColumn(at.column, id).length) next = { ...at, index: at.index + 1 };
    if (next) {
      event.preventDefault();
      setGrab({ ...grab, at: next });
      setMessage(labels.moved(title, columnTitle(next.column), next.index + 1, byColumn(next.column, id).length + 1));
      return;
    }
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      setGrab(null);
      commit(id, origin, at);
      setMessage(labels.dropped(title, columnTitle(at.column), at.index + 1));
    } else if (event.key === "Escape") {
      event.preventDefault();
      setGrab(null);
      setMessage(labels.cancelled(title));
    }
  };

  const indexAt = (column: string, y: number) => {
    const list = byColumn(column, dragging ?? undefined);
    const i = list.findIndex((c) => {
      const box = refs.current.get(getId(c))?.getBoundingClientRect();
      return box ? y < box.top + box.height / 2 : false;
    });
    return i === -1 ? list.length : i;
  };

  return (
    <div role="group" aria-label={label} className={s.root({ className })}>
      <p id={instructionsId} className="sr-only">
        {labels.instructions}
      </p>
      <p className="sr-only" aria-live="assertive">
        {message}
      </p>
      {columns.map((column) => {
        const list = shown(column.id);
        const overLimit = column.limit !== undefined && list.length > column.limit;
        return (
          <section
            key={column.id}
            aria-label={column.title}
            data-over={over?.column === column.id || undefined}
            className={s.column()}
            onDragOver={(e) => {
              if (!dragging) return;
              e.preventDefault();
              setOver({ column: column.id, index: indexAt(column.id, e.clientY) });
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOver(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (dragging) commit(dragging, placementOf(dragging), { column: column.id, index: indexAt(column.id, e.clientY) });
              setDragging(null);
              setOver(null);
            }}
          >
            <header className={s.header()}>
              <h3 className={s.title()}>{column.title}</h3>
              <span className={s.count()} data-over-limit={overLimit || undefined}>
                {column.limit !== undefined ? `${list.length}/${column.limit}` : list.length}
              </span>
            </header>
            <ul className={s.list()}>
              {list.length === 0 ? <li className={s.empty()}>{labels.empty}</li> : null}
              {list.map((card) => {
                const id = getId(card);
                return (
                  <li
                    key={id}
                    ref={(el) => {
                      if (el) refs.current.set(id, el);
                      else refs.current.delete(id);
                    }}
                    tabIndex={0}
                    draggable
                    aria-describedby={instructionsId}
                    aria-roledescription="card"
                    data-grabbed={grab?.id === id || undefined}
                    data-dragging={dragging === id || undefined}
                    className={s.card()}
                    onKeyDown={(e) => onKeyDown(e, id)}
                    onFocus={() => {
                      // Tab to another card while one is carried: the carried one goes back.
                      if (grab && grab.id !== id) {
                        setMessage(labels.cancelled(titleOf(grab.id)));
                        setGrab(null);
                      }
                    }}
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = "move";
                      e.dataTransfer.setData("text/plain", id);
                      setDragging(id);
                    }}
                    onDragEnd={() => {
                      setDragging(null);
                      setOver(null);
                    }}
                  >
                    {renderCard(card)}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
