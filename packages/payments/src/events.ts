import type { PaymentEvent } from "./port";

/** Where the ids of the notifications already applied are kept (one line per notification). */
export interface EventStore {
  /** Records the id; true when it is new, false when it was already there. Must be atomic (a unique key). */
  markSeen(id: string, type: string): Promise<boolean>;
}

type Handlers = { [T in Exclude<PaymentEvent["type"], "ignored">]?: (event: Extract<PaymentEvent, { type: T }>) => Promise<void | "ignored"> };

/**
 * Applies a verified event once: its id is recorded first, a replay runs no handler. An `ignored` event, or one the product
 * has no handler for, is not recorded. A handler may answer `"ignored"` (the event concerned no account of ours).
 */
export async function applyOnce(store: EventStore, event: PaymentEvent, handlers: Handlers): Promise<"applied" | "duplicate" | "ignored"> {
  if (event.type === "ignored") return "ignored";
  const handler = handlers[event.type] as ((e: PaymentEvent) => Promise<void | "ignored">) | undefined;
  if (!handler) return "ignored";
  if (!(await store.markSeen(event.id, event.type))) return "duplicate";
  return (await handler(event)) === "ignored" ? "ignored" : "applied";
}

/** The SQL store on `payment_events (id text primary key, type text not null, received_at timestamptz default now())`. */
export function pgEventStore(query: (text: string, values?: unknown[]) => Promise<unknown[]>): EventStore {
  return {
    async markSeen(id, type) {
      return (await query("INSERT INTO payment_events (id, type) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING RETURNING id", [id, type])).length > 0;
    },
  };
}
