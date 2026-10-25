import type { PaymentEvent } from "./port";

/** Runs one SQL statement and returns its rows: the product's pool, or the client of an open transaction. */
export type Query = (text: string, values?: unknown[]) => Promise<unknown[]>;

/** Where the ids of the notifications already applied are kept (one line per notification). */
export interface EventStore {
  /** Records the id; true when it is new, false when it was already there. Must be atomic (a unique key). */
  markSeen(id: string, type: string): Promise<boolean>;
  /** Gives the id back after its handler failed, so the processor's retry runs it. A store without it keeps the id. */
  forget?(id: string): Promise<void>;
}

type Handlers = { [T in Exclude<PaymentEvent["type"], "ignored">]?: (event: Extract<PaymentEvent, { type: T }>) => Promise<void | "ignored"> };

/** Handlers that write through the transaction they are given, so their effect and the event's record commit together. */
export type TransactionHandlers = {
  [T in Exclude<PaymentEvent["type"], "ignored">]?: (event: Extract<PaymentEvent, { type: T }>, query: Query) => Promise<void | "ignored">;
};

/** Opens a transaction, runs the work with its `Query`, commits when the work returns and rolls back when it throws. */
export type Transaction = <T>(work: (query: Query) => Promise<T>) => Promise<T>;

type Outcome = "applied" | "duplicate" | "ignored";

/** The handler of an event's type, or none (an `ignored` event, or a type the product does not handle). */
function handlerFor<H>(handlers: Partial<Record<string, H>>, event: PaymentEvent): H | undefined {
  return event.type === "ignored" ? undefined : handlers[event.type];
}

/**
 * Applies a verified event once: its id is recorded first, a replay runs no handler. An `ignored` event, or one the product
 * has no handler for, is not recorded. A handler may answer `"ignored"` (the event concerned no account of ours).
 * When the handler throws, the id is given back (`EventStore.forget`) and the error propagates: the webhook answers an error,
 * the processor retries, and the retry applies the event. A crash between the record and the effect can still lose an event;
 * `applyOnceInTransaction` closes that window.
 * @param store where applied ids are kept
 * @param event the verified, translated event
 * @param handlers one handler per event type the product applies
 * @returns `applied`, `duplicate` (already applied) or `ignored`
 * @throws whatever the handler throws, after the id was given back; an `AggregateError` of both errors (the handler's
 *   first) when giving the id back fails too, in which case the id stays recorded
 */
export async function applyOnce(store: EventStore, event: PaymentEvent, handlers: Handlers): Promise<Outcome> {
  const handler = handlerFor(handlers as Partial<Record<string, (e: PaymentEvent) => Promise<void | "ignored">>>, event);
  if (!handler) return "ignored";
  if (!(await store.markSeen(event.id, event.type))) return "duplicate";
  try {
    return (await handler(event)) === "ignored" ? "ignored" : "applied";
  } catch (error) {
    await giveBack(store, event.id, error);
    throw error;
  }
}

/** Gives the id back after a failed handler. If that fails too, both errors go to the caller, the handler's first. */
async function giveBack(store: EventStore, id: string, handlerError: unknown): Promise<void> {
  try {
    await store.forget?.(id);
  } catch (cleanupError) {
    throw new AggregateError([handlerError, cleanupError], `the handler of ${id} failed, and giving its id back failed too: the id stays recorded`, { cause: cleanupError });
  }
}

/**
 * Applies a verified event once, recording its id and running its handler in **one transaction**: both commit together,
 * or both roll back when the handler throws (the processor's retry then applies it). The record is `payment_events`
 * (`pgEventStore`), written through the transaction's `Query`. An `ignored` event, or a type without handler, opens no transaction.
 * @param transaction the product's transaction runner (its pool's `BEGIN … COMMIT`)
 * @param event the verified, translated event
 * @param handlers one handler per event type, each writing through the `Query` it receives
 * @returns `applied`, `duplicate` (already applied) or `ignored`
 * @throws whatever the handler throws, after the transaction rolled back
 */
export async function applyOnceInTransaction(transaction: Transaction, event: PaymentEvent, handlers: TransactionHandlers): Promise<Outcome> {
  const handler = handlerFor(handlers as Partial<Record<string, (e: PaymentEvent, query: Query) => Promise<void | "ignored">>>, event);
  if (!handler) return "ignored";
  return transaction(async (query) => {
    if (!(await pgEventStore(query).markSeen(event.id, event.type))) return "duplicate";
    return (await handler(event, query)) === "ignored" ? "ignored" : "applied";
  });
}

/**
 * The SQL store on `payment_events (id text primary key, type text not null, received_at timestamptz default now())`.
 * @param query the product's SQL runner
 * @returns an `EventStore` that records with `INSERT … ON CONFLICT DO NOTHING` and forgets with a `DELETE`
 */
export function pgEventStore(query: Query): Required<EventStore> {
  return {
    async markSeen(id, type) {
      return (await query("INSERT INTO payment_events (id, type) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING RETURNING id", [id, type])).length > 0;
    },
    async forget(id) {
      await query("DELETE FROM payment_events WHERE id = $1", [id]);
    },
  };
}
