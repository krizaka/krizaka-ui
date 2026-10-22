// Client (the tray's fold). A queue of files that stays on screen: each row appears at once, says in words what it is doing,
// shows live progress while it works (a shimmer only then), and ends in a result chip; a row may carry one quiet action (a
// « keep » toggle). `TaskTray` is the non-blocking container: bottom-right on a desktop, a sheet on a phone's bottom edge.
import * as React from "react";

import { cn } from "../cn";
import { isWorking, progressOf, QueueStatus } from "./model";

export interface UploadQueueItem {
  /** Its key: stable while the row updates. */
  id: string;
  /** The file's name. */
  name: string;
  /** Where it is: queued, reading, checking, done, failed. */
  status: QueueStatus;
  /** What it is doing, in words (“Reading…”, “Checking the rules…”) — passed translated, from the live events. */
  statusText: string;
  /** 0–1 while the work reports it; absent for an indeterminate wait. */
  progress?: number;
  /** The result, when done: a chip (`Chip`, `Badge`) or a line. */
  result?: React.ReactNode;
  /** The row's one quiet action: a « keep » toggle, a retry, a dismiss. */
  trailing?: React.ReactNode;
}

export type UploadQueueProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The list's accessible name (“Checks in progress”) — passed translated. */
  label: string;
  /** The rows, in the order they were added. */
  items: readonly UploadQueueItem[];
};

/** The files being checked, one row each. Changes are announced politely. */
export function UploadQueue({ label, items, className, ...props }: UploadQueueProps) {
  return (
    <div aria-live="polite" className={className} {...props}>
      <ul aria-label={label} className="m-0 flex list-none flex-col divide-y divide-border-subtle p-0">
        {items.map((item) => {
          const working = isWorking(item.status);
          const progress = progressOf(item.progress);
          return (
            <li key={item.id} data-status={item.status} data-working={working ? "" : undefined} className="kz-queue-row flex flex-col gap-1.5 py-3">
              <div className="flex items-center gap-3">
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-fg">{item.name}</span>
                {item.result ? <span className="shrink-0">{item.result}</span> : null}
                {item.trailing ? <span className="shrink-0">{item.trailing}</span> : null}
              </div>
              <span className={cn("text-xs", item.status === QueueStatus.Failed ? "text-fg-danger" : "text-fg-secondary")}>{item.statusText}</span>
              {working && progress !== undefined ? (
                <div role="progressbar" aria-label={item.name} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} className="h-1 overflow-hidden rounded-full bg-surface-3">
                  <div className="kz-working h-full rounded-full bg-accent" style={{ width: `${progress * 100}%` }} />
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export type TaskTrayProps = Omit<React.ComponentProps<"section">, "title"> & {
  /** The tray's name (“Checks”). */
  title: string;
  /** The tally in words (“1 running · 2 done”). */
  summary: string;
  /** The fold button's name while open (“Collapse”). */
  toggleLabel: string;
  /** … and while folded (“Show”). */
  openLabel: string;
  /** Starts open. @default true */
  defaultOpen?: boolean;
};

/** A non-blocking tray for a queue: the user keeps browsing. Bottom edge on a phone, bottom-right from `sm`. */
export function TaskTray({ title, summary, toggleLabel, openLabel, defaultOpen = true, className, children, ...props }: TaskTrayProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const id = React.useId();
  return (
    <section
      aria-labelledby={`${id}-title`}
      data-state={open ? "open" : "closed"}
      className={cn(
        "kz-tray fixed inset-x-0 bottom-0 z-40 flex max-h-[70dvh] flex-col rounded-t-2xl border border-border-default bg-surface-1 shadow-lg sm:inset-x-auto sm:bottom-4 sm:right-4 sm:w-96 sm:rounded-2xl",
        className,
      )}
      {...props}
    >
      <header className="flex items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <h2 id={`${id}-title`} className="m-0 text-sm font-semibold text-fg">
            {title}
          </h2>
          <p className="m-0 truncate text-xs text-fg-secondary">{summary}</p>
        </div>
        <button type="button" aria-expanded={open} aria-controls={`${id}-body`} onClick={() => setOpen(!open)} className="rounded-md px-2 py-1 text-sm text-fg-secondary hover:text-fg focus-visible:focus-ring">
          {open ? toggleLabel : openLabel}
        </button>
      </header>
      {open ? (
        <div id={`${id}-body`} className="kz-tray-body min-h-0 overflow-y-auto px-4 pb-2">
          {children}
        </div>
      ) : null}
    </section>
  );
}
