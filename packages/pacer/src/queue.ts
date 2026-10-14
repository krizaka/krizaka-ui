// A job queue: how many run at once, which goes first, how a failure is retried (TanStack Pacer's AsyncRetryer: backoff,
// jitter, a cap), and the controls a person has over a job — pause (the job's signal is aborted, it keeps its place),
// resume, retry, cancel. Pause and resume are per job, which TanStack's AsyncQueuer does not do: the scheduler is ours,
// the retries are Pacer's. Framework-free: `useQueue` (./react) subscribes a component to it.
import { AsyncRetryer } from "@tanstack/pacer/async-retryer";

export type JobStatus = "queued" | "running" | "paused" | "done" | "error";

/** What a job receives when it starts (again). */
export type JobContext = {
  /** Aborted on pause and cancel: stop sending (`fetch`, a Tus client's `abort()`). */
  signal: AbortSignal;
  /** The attempt, from 1; it grows with each retry of the same start. */
  attempt: number;
  /** `true` when this start continues a paused or failed job (a Tus client then goes on from its offset). */
  resumed: boolean;
};

/** The work: resolves when it is done, rejects on failure (the error is kept on the job). */
export type JobRun = (context: JobContext) => Promise<unknown>;

export type Backoff = {
  /** `exponential` doubles the wait at each retry (default), `linear` adds it, `fixed` repeats it. */
  kind?: "fixed" | "linear" | "exponential";
  /** The first wait, in ms. Default 1000. */
  baseMs?: number;
  /** The longest wait, in ms. Default 30 000. */
  maxMs?: number;
  /** Random variation, 0 to 1 (a share of each wait), so a crowd does not retry together. Default 0. */
  jitter?: number;
};

export type QueueOptions = {
  /** How many jobs run at once. Default 2. */
  concurrency?: number;
  /** How many times a failed job is tried again before it is an `error`. Default 0. */
  retries?: number;
  backoff?: Backoff;
  /** Whether an error deserves another try (a 4xx never does). Default: every error does, up to `retries`. */
  shouldRetry?: (error: Error, attempt: number) => boolean;
  /** Start with no job running: nothing starts until `resumeAll()`. */
  paused?: boolean;
};

export type AddOptions<M> = {
  /** Your id (a file name, a draft id); a random one by default. Adding an id that exists is refused. */
  id?: string;
  /** Higher runs first; equal priorities keep their order. Default 0. */
  priority?: number;
  /** Whatever the screen needs to draw the job (a name, a size, a progress). */
  meta: M;
};

/** What a screen reads of a job. */
export type JobSnapshot<M> = {
  readonly id: string;
  readonly status: JobStatus;
  readonly priority: number;
  /** The attempt under way, or the last one. */
  readonly attempt: number;
  readonly error?: Error;
  readonly meta: M;
};

export type Queue<M = undefined> = {
  /** Queues a job and returns its id. Starts at once when there is room. */
  add: (run: JobRun, options: AddOptions<M>) => string;
  /** Aborts a running job and keeps it, `paused`, out of the line until `resume`. A queued job is held the same way. */
  pause: (id: string) => void;
  /** Puts a paused job back in the line (it runs again with `resumed: true`). */
  resume: (id: string) => void;
  /** Puts a failed job back in the line. Same as `resume`. */
  retry: (id: string) => void;
  /** Aborts and forgets a job, whatever it is doing. */
  cancel: (id: string) => void;
  /** Forgets a finished or failed job (same as `cancel`). */
  remove: (id: string) => void;
  /** Replaces what the screen reads of a job (a progress, a speed): `meta` or a function of the current one. */
  update: (id: string, meta: M | ((current: M) => M)) => void;
  /** Starts nothing new until `resumeAll()`; the jobs under way finish. */
  pauseAll: () => void;
  resumeAll: () => void;
  /** Changes the options (concurrency, retries…) for what starts next. */
  configure: (options: QueueOptions) => void;
  /** The jobs, in line order. A new array only when something changed. */
  snapshot: () => readonly JobSnapshot<M>[];
  subscribe: (listener: () => void) => () => void;
  /** Aborts every job and forgets them (a component leaving). The queue can be used again. */
  dispose: () => void;
  readonly isPaused: boolean;
};

type Job<M> = {
  id: string;
  seq: number;
  run: JobRun;
  status: JobStatus;
  priority: number;
  attempt: number;
  error?: Error;
  meta: M;
  controller: AbortController | null;
  retryer: AsyncRetryer<() => Promise<void>> | null;
  started: boolean;
};

const DEFAULTS = { concurrency: 2, retries: 0 } as const;

function randomId(): string {
  return `job-${Math.random().toString(36).slice(2, 10)}`;
}

/** Creates a queue. See the options; nothing runs until a job is added (or `resumeAll()` after `paused: true`). */
export function createQueue<M = undefined>(initial: QueueOptions = {}): Queue<M> {
  let options: QueueOptions = initial;
  let paused = initial.paused ?? false;
  let seq = 0;
  const jobs = new Map<string, Job<M>>();
  const listeners = new Set<() => void>();
  let view: readonly JobSnapshot<M>[] = [];

  const order = (a: Job<M>, b: Job<M>) => b.priority - a.priority || a.seq - b.seq;
  const emit = () => {
    view = [...jobs.values()].sort(order).map(({ id, status, priority, attempt, error, meta }) => ({ id, status, priority, attempt, error, meta }));
    for (const listener of [...listeners]) listener();
  };
  const stop = (job: Job<M>) => {
    job.retryer?.abort();
    job.controller?.abort();
    job.retryer = null;
    job.controller = null;
  };

  const settle = (job: Job<M>, controller: AbortController, outcome: { ok: boolean; error?: Error }) => {
    if (controller.signal.aborted || job.controller !== controller) return;
    job.controller = null;
    job.retryer = null;
    job.status = outcome.ok ? "done" : "error";
    job.error = outcome.ok ? undefined : outcome.error;
    emit();
    pump();
  };

  const start = (job: Job<M>) => {
    const controller = new AbortController();
    const resumed = job.started;
    let succeeded = false;
    let failure: Error | undefined;
    let fatal = false;
    let attempt = 0;
    const retries = options.retries ?? DEFAULTS.retries;
    const backoff = options.backoff ?? {};
    job.started = true;
    job.controller = controller;
    job.status = "running";
    job.error = undefined;
    job.attempt = 1;
    const retryer = new AsyncRetryer<() => Promise<void>>(
      async () => {
        attempt += 1;
        job.attempt = attempt;
        if (attempt > 1) emit();
        try {
          await job.run({ signal: controller.signal, attempt, resumed: resumed || attempt > 1 });
          succeeded = true;
        } catch (error) {
          failure = error instanceof Error ? error : new Error(String(error));
          if (options.shouldRetry && !options.shouldRetry(failure, attempt)) fatal = true;
          throw failure;
        }
      },
      {
        maxAttempts: () => (fatal ? attempt : retries + 1),
        backoff: backoff.kind ?? "exponential",
        baseWait: backoff.baseMs ?? 1000,
        maxWait: backoff.maxMs ?? 30_000,
        jitter: backoff.jitter ?? 0,
        throwOnError: false,
      },
    );
    job.retryer = retryer;
    emit();
    void retryer.execute().then(() => settle(job, controller, succeeded ? { ok: true } : { ok: false, error: failure ?? new Error("The job failed.") }));
  };

  function pump() {
    if (paused) return;
    const running = [...jobs.values()].filter((job) => job.status === "running").length;
    const room = (options.concurrency ?? DEFAULTS.concurrency) - running;
    if (room <= 0) return;
    const next = [...jobs.values()].filter((job) => job.status === "queued").sort(order).slice(0, room);
    for (const job of next) start(job);
  }

  const requeue = (id: string, from: JobStatus[]) => {
    const job = jobs.get(id);
    if (!job || !from.includes(job.status)) return;
    job.status = "queued";
    job.error = undefined;
    emit();
    pump();
  };

  function cancel(id: string) {
    const job = jobs.get(id);
    if (!job) return;
    stop(job);
    jobs.delete(id);
    emit();
    pump();
  }

  return {
    add(run, { id = randomId(), priority = 0, meta }) {
      if (jobs.has(id)) throw new Error(`A job "${id}" is already in the queue.`);
      jobs.set(id, { id, seq: (seq += 1), run, status: "queued", priority, attempt: 0, meta, controller: null, retryer: null, started: false });
      emit();
      pump();
      return id;
    },
    pause(id) {
      const job = jobs.get(id);
      if (!job || (job.status !== "running" && job.status !== "queued")) return;
      stop(job);
      job.status = "paused";
      emit();
      pump();
    },
    resume: (id) => requeue(id, ["paused"]),
    retry: (id) => requeue(id, ["paused", "error"]),
    cancel,
    remove: cancel,
    update(id, meta) {
      const job = jobs.get(id);
      if (!job) return;
      job.meta = typeof meta === "function" ? (meta as (current: M) => M)(job.meta) : meta;
      emit();
    },
    pauseAll() {
      paused = true;
    },
    resumeAll() {
      paused = false;
      pump();
    },
    configure(next) {
      options = next;
      pump();
    },
    snapshot: () => view,
    subscribe(listener) {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },
    dispose() {
      for (const job of jobs.values()) stop(job);
      jobs.clear();
      emit();
    },
    get isPaused() {
      return paused;
    },
  };
}
