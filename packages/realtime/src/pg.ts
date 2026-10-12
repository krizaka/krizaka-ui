import pg from "pg";

import { NOTIFY_LIMIT, type PostgresChannel } from "./postgres";

/**
 * `PostgresChannel` on node-postgres (`pg`, an optional peer dependency): one dedicated LISTEN connection per process
 * that reconnects by itself with a growing delay, and NOTIFY through a pool — yours or a small one of its own.
 *
 * LISTEN needs a **session**: give it a direct connection (`listen`), never a transaction pooler (PgBouncer in
 * transaction mode drops the subscription between transactions). NOTIFY is one statement and goes through anything,
 * a transaction pooler included — pass the app's pool as `notify`. Nothing is read from the environment: the app
 * decides which URL is the direct one.
 */

/** Connection settings of node-postgres (`connectionString`, `host`, `ssl`, …). */
export type PgConnection = string | ({ connectionString?: string } & Record<string, unknown>);

/** What NOTIFY goes through: a `pg.Pool`, a `pg.Client`, or anything with the same `query`. */
export interface PgQueryable {
  query(text: string, values?: unknown[]): Promise<unknown>;
}

/** The parts of node-postgres used here — injected by tests or a compatible driver. */
export interface PgDriver {
  Client: new (config: Record<string, unknown>) => PgListenClient;
  Pool: new (config: Record<string, unknown>) => PgQueryable & { end(): Promise<void> };
}

export interface PgListenClient {
  connect(): Promise<unknown>;
  query(text: string): Promise<unknown>;
  end(): Promise<void>;
  on(event: "error" | "end", listener: () => void): unknown;
  on(event: "notification", listener: (msg: { channel: string; payload?: string }) => void): unknown;
  removeAllListeners(): unknown;
}

export interface PgChannelOptions {
  /** The LISTEN connection: a direct (session) connection string or settings — never a transaction pooler. */
  listen: PgConnection;
  /** What NOTIFY goes through (the app's pool, a transaction pooler is fine). Absent: a pool of 2 on `listen`. */
  notify?: PgQueryable;
  /** Called when the LISTEN connection comes up or goes down. */
  onState?: (connected: boolean) => void;
  /** Longest wait between two reconnection attempts (ms, default 30 000; the first is 1 000). */
  maxReconnectDelayMs?: number;
  /** Default: node-postgres. */
  driver?: PgDriver;
}

export interface PgChannel extends PostgresChannel {
  /** Ends the pool this channel opened for NOTIFY (not one passed as `notify`). */
  close(): Promise<void>;
}

const IDENTIFIER = /^[a-z_][a-z0-9_]*$/;

const settings = (connection: PgConnection): Record<string, unknown> =>
  typeof connection === "string" ? { connectionString: connection } : { ...connection };

export function pgChannel(options: PgChannelOptions): PgChannel {
  const driver: PgDriver = options.driver ?? (pg as unknown as PgDriver);
  const maxDelay = options.maxReconnectDelayMs ?? 30_000;
  let ownPool: (PgQueryable & { end(): Promise<void> }) | null = null;
  const notifier = () => options.notify ?? (ownPool ??= new driver.Pool({ ...settings(options.listen), max: 2 }));

  return {
    async notify(channel, payload) {
      if (Buffer.byteLength(payload) > NOTIFY_LIMIT) throw new Error(`notify payload too large (${channel})`);
      await notifier().query("select pg_notify($1, $2)", [channel, payload]);
    },

    listen(channel, onMessage) {
      if (!IDENTIFIER.test(channel)) throw new Error(`invalid channel name ${channel}`);
      let client: PgListenClient | null = null;
      let closed = false;
      let connected = false;
      let delay = 1000;
      let timer: ReturnType<typeof setTimeout> | null = null;

      const setState = (value: boolean) => {
        if (connected === value) return;
        connected = value;
        options.onState?.(value);
      };

      const retry = () => {
        setState(false);
        client?.removeAllListeners();
        client?.end().catch(() => undefined);
        client = null;
        if (closed || timer) return;
        timer = setTimeout(() => {
          timer = null;
          void connect();
        }, delay);
        delay = Math.min(delay * 2, maxDelay);
      };

      const connect = async () => {
        const next = new driver.Client(settings(options.listen));
        client = next;
        next.on("error", retry);
        next.on("end", retry);
        next.on("notification", (msg) => {
          if (msg.channel === channel && msg.payload) onMessage(msg.payload);
        });
        try {
          await next.connect();
          await next.query(`LISTEN ${channel}`);
          if (closed) return void next.end().catch(() => undefined);
          delay = 1000;
          setState(true);
        } catch (error) {
          console.warn(`[realtime] listen ${channel}: ${(error as Error).message}`);
          retry();
        }
      };

      void connect();
      return {
        get connected() {
          return connected;
        },
        async close() {
          closed = true;
          if (timer) clearTimeout(timer);
          timer = null;
          setState(false);
          const last = client;
          client = null;
          last?.removeAllListeners();
          await last?.end().catch(() => undefined);
        },
      };
    },

    async close() {
      const pool = ownPool;
      ownPool = null;
      await pool?.end();
    },
  };
}
