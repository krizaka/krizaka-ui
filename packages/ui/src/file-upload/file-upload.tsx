// Client. Three parts that work alone or together:
// - `Dropzone`: drop files on it or pick them with its button (a real `<input type="file">`, so the keyboard and the
//   phone's camera / files sheet work); it checks the type, the size and the count, and hands over the accepted files
//   and the refused ones with their reason;
// - `UploadList`: each file with its preview, size, progress, speed, and the actions its state allows (pause, resume,
//   retry, cancel, remove); the progress is a `progressbar`, a failure is announced;
// - `useUploadQueue`: runs the app's `upload(file, { signal, onProgress, resumed })` with a concurrency, pauses by
//   aborting the signal and resumes by calling it again with `resumed: true` — what a Tus client (tus-js-client's
//   `abort()` / `start()`) or a multipart upload needs, without depending on either.
import { getNumberFormat } from "@krizaka/intl";
import * as React from "react";
import { tv } from "tailwind-variants";

import { CloseGlyph, FileGlyph, PauseGlyph, PlayGlyph, RetryGlyph, UploadGlyph } from "../glyphs";
import { Progress } from "../progress";

export const fileUpload = tv({
  slots: {
    zone:
      "relative flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border-default bg-surface-1 px-6 py-10 text-center " +
      "transition-colors data-[dragging]:border-accent data-[dragging]:bg-accent-soft data-[disabled]:opacity-50 has-[:focus-visible]:border-accent",
    zoneIcon: "flex h-12 w-12 items-center justify-center rounded-full bg-surface-3 text-fg-secondary",
    zoneTitle: "text-sm font-semibold text-fg",
    zoneHint: "text-xs text-fg-secondary",
    browse:
      "inline-flex h-9 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 disabled:pointer-events-none",
    refusals: "w-full text-left text-xs font-medium text-fg-danger",
    list: "flex w-full flex-col gap-2",
    item: "flex items-center gap-3 rounded-xl border border-border-default bg-surface-1 p-3 data-[status=error]:border-danger/60",
    preview: "flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-3 text-fg-secondary",
    body: "flex min-w-0 flex-1 flex-col gap-1.5",
    name: "truncate text-sm font-semibold text-fg",
    meta: "flex flex-wrap gap-x-2 text-xs tabular-nums text-fg-secondary",
    error: "text-xs font-medium text-fg-danger",
    actions: "flex shrink-0 items-center gap-1",
    action:
      "inline-flex h-8 w-8 items-center justify-center rounded-md text-fg-secondary transition-colors hover:bg-surface-3 hover:text-fg " +
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
  },
});

/** Why a file was refused. */
export type FileRejection = { file: File; reason: "type" | "size" | "count" };

/** Whether a file matches an `accept` list (`"video/*,.mov,image/png"`). */
export function acceptsFile(file: File, accept?: string): boolean {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return accept
    .split(",")
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean)
    .some((rule) => (rule.startsWith(".") ? name.endsWith(rule) : rule.endsWith("/*") ? type.startsWith(rule.slice(0, -1)) : type === rule));
}

/** A size in the locale's words (`"1.4 GB"`, `"820 kB"`), through `@krizaka/intl`. */
export function formatBytes(bytes: number, locale = "en"): string {
  const units = ["byte", "kilobyte", "megabyte", "gigabyte", "terabyte"] as const;
  let value = Math.max(0, bytes);
  let unit = 0;
  while (value >= 1000 && unit < units.length - 1) {
    value /= 1000;
    unit += 1;
  }
  return getNumberFormat(locale, { style: "unit", unit: units[unit], unitDisplay: "short", maximumFractionDigits: value < 10 && unit > 0 ? 1 : 0 }).format(value);
}

export type DropzoneProps = {
  /** The title in the zone ("Drop your video here"), passed translated. */
  title: string;
  /** The button that opens the file picker ("Choose a file"), passed translated. */
  browseLabel: string;
  /** What is accepted, in words ("MP4 or MOV, up to 4 GB"). */
  hint?: string;
  /** The types accepted, as the `accept` attribute (`"video/*"`, `"image/png,.pdf"`). */
  accept?: string;
  /** The largest file, in bytes. */
  maxSize?: number;
  /** The most files at once (1 unless `multiple`). */
  maxFiles?: number;
  /** Several files at once. */
  multiple?: boolean;
  /** Not available (an upload is running). */
  disabled?: boolean;
  /** On a phone, opens the camera directly (`"environment"` the back one, `"user"` the front one). */
  capture?: "user" | "environment";
  /** Called with the files accepted (never empty). */
  onFiles: (files: File[]) => void;
  /** Called with the files refused and why (show `refusalLabel`'s words, or your own). */
  onReject?: (rejections: FileRejection[]) => void;
  /** The words of a refusal, shown in the zone: `(r) => r.file.name + " is too large"`. Without it, nothing is shown. */
  refusalLabel?: (rejection: FileRejection) => string;
  /** An icon instead of the upload glyph. */
  icon?: React.ReactNode;
  /** Classes merged on the zone. */
  className?: string;
};

/** A zone to drop files on, with a button that opens the picker: checks type, size and count. */
export function Dropzone({
  title,
  browseLabel,
  hint,
  accept,
  maxSize,
  maxFiles,
  multiple,
  disabled,
  capture,
  onFiles,
  onReject,
  refusalLabel,
  icon,
  className,
}: DropzoneProps) {
  const s = fileUpload();
  const input = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [refused, setRefused] = React.useState<FileRejection[]>([]);
  const depth = React.useRef(0);
  const id = React.useId();
  const limit = maxFiles ?? (multiple ? Infinity : 1);

  const take = (list: FileList | File[]) => {
    const files = [...list];
    const accepted: File[] = [];
    const rejections: FileRejection[] = [];
    for (const file of files) {
      if (!acceptsFile(file, accept)) rejections.push({ file, reason: "type" });
      else if (maxSize !== undefined && file.size > maxSize) rejections.push({ file, reason: "size" });
      else if (accepted.length >= limit) rejections.push({ file, reason: "count" });
      else accepted.push(file);
    }
    setRefused(rejections);
    if (accepted.length) onFiles(accepted);
    if (rejections.length) onReject?.(rejections);
  };

  return (
    <div
      className={s.zone({ className })}
      data-dragging={dragging ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      onDragEnter={(event) => {
        if (disabled) return;
        event.preventDefault();
        depth.current += 1;
        setDragging(true);
      }}
      onDragOver={(event) => {
        if (disabled) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
      }}
      onDragLeave={() => {
        depth.current = Math.max(0, depth.current - 1);
        if (depth.current === 0) setDragging(false);
      }}
      onDrop={(event) => {
        if (disabled) return;
        event.preventDefault();
        depth.current = 0;
        setDragging(false);
        take(event.dataTransfer.files);
      }}
    >
      <span className={s.zoneIcon()} aria-hidden>
        {icon ?? <UploadGlyph className="h-6 w-6" />}
      </span>
      <p id={`${id}-title`} className={s.zoneTitle()}>
        {title}
      </p>
      {hint ? (
        <p id={`${id}-hint`} className={s.zoneHint()}>
          {hint}
        </p>
      ) : null}
      <button
        type="button"
        className={s.browse()}
        disabled={disabled}
        aria-describedby={[`${id}-title`, hint ? `${id}-hint` : null].filter(Boolean).join(" ")}
        onClick={() => input.current?.click()}
      >
        {browseLabel}
      </button>
      <input
        ref={input}
        type="file"
        tabIndex={-1}
        aria-hidden
        className="sr-only"
        accept={accept}
        multiple={multiple}
        capture={capture}
        disabled={disabled}
        onChange={(event) => {
          if (event.target.files?.length) take(event.target.files);
          event.target.value = "";
        }}
      />
      {refusalLabel && refused.length > 0 ? (
        <ul role="alert" className={s.refusals()}>
          {refused.map((r) => (
            <li key={`${r.file.name}-${r.reason}`}>{refusalLabel(r)}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export type UploadStatus = "queued" | "uploading" | "paused" | "done" | "error";

export type UploadItem = {
  /** A stable id. */
  id: string;
  /** The file's name. */
  name: string;
  /** Its size, in bytes. */
  size: number;
  /** Its MIME type (`video/mp4`): picks the preview. */
  type?: string;
  /** Sent so far, between 0 and 1. */
  progress: number;
  /** Where it stands. */
  status: UploadStatus;
  /** Why it failed, passed translated. */
  error?: string;
  /** A preview (an object URL of the file, a thumbnail from the server). */
  previewUrl?: string;
  /** Bytes per second, for the speed and the time left. */
  speed?: number;
};

export type UploadListLabels = {
  /** The list's accessible name ("Uploads"). */
  list: string;
  pause: (name: string) => string;
  resume: (name: string) => string;
  retry: (name: string) => string;
  cancel: (name: string) => string;
  remove: (name: string) => string;
  /** A state in words: `(status) => "Paused"`… */
  status: (status: UploadStatus) => string;
  /** The time left: `(seconds) => "2 min left"`. */
  remaining: (seconds: number) => string;
};

export const uploadListLabels: UploadListLabels = {
  list: "Uploads",
  pause: (name) => `Pause ${name}`,
  resume: (name) => `Resume ${name}`,
  retry: (name) => `Retry ${name}`,
  cancel: (name) => `Cancel ${name}`,
  remove: (name) => `Remove ${name}`,
  status: (status) => ({ queued: "Waiting", uploading: "Uploading", paused: "Paused", done: "Uploaded", error: "Failed" })[status],
  remaining: (seconds) => (seconds < 60 ? `${Math.ceil(seconds)} s left` : `${Math.ceil(seconds / 60)} min left`),
};

export type UploadListProps = {
  /** The uploads, as `useUploadQueue` gives them (or your own state). */
  items: readonly UploadItem[];
  /** Pauses an upload (shown while it uploads, when given). */
  onPause?: (id: string) => void;
  /** Resumes a paused one. */
  onResume?: (id: string) => void;
  /** Tries a failed one again. */
  onRetry?: (id: string) => void;
  /** Stops an upload under way and drops it. */
  onCancel?: (id: string) => void;
  /** Drops a finished or failed one from the list. */
  onRemove?: (id: string) => void;
  /** The locale of sizes and speeds. Default `"en"`. */
  locale?: string;
  /** The words, passed translated; English by default. */
  labels?: Partial<UploadListLabels>;
  /** Classes merged on the list. */
  className?: string;
};

function Preview({ item }: { item: UploadItem }) {
  if (item.previewUrl && item.type?.startsWith("image/")) return <img src={item.previewUrl} alt="" className="h-full w-full object-cover" />;
  if (item.previewUrl && item.type?.startsWith("video/")) return <video src={item.previewUrl} muted playsInline preload="metadata" className="h-full w-full object-cover" aria-hidden />;
  return <FileGlyph className="h-5 w-5" />;
}

/** The files being sent: preview, size, progress, speed and time left, and the actions each state allows. */
export function UploadList({ items, onPause, onResume, onRetry, onCancel, onRemove, locale = "en", labels: given, className }: UploadListProps) {
  const labels = { ...uploadListLabels, ...given };
  const s = fileUpload();
  const action = (label: string, run: () => void, glyph: React.ReactNode) => (
    <button type="button" className={s.action()} aria-label={label} title={label} onClick={run}>
      {glyph}
    </button>
  );
  return (
    <ul aria-label={labels.list} className={s.list({ className })}>
      {items.map((item) => {
        const left = item.status === "uploading" && item.speed ? ((1 - item.progress) * item.size) / item.speed : null;
        return (
          <li key={item.id} className={s.item()} data-status={item.status}>
            <span className={s.preview()}>
              <Preview item={item} />
            </span>
            <div className={s.body()}>
              <p className={s.name()}>{item.name}</p>
              {item.status !== "done" && item.status !== "error" ? (
                <Progress size="sm" label={item.name} value={item.status === "queued" ? null : Math.round(item.progress * 100)} />
              ) : null}
              <p className={s.meta()}>
                <span>{labels.status(item.status)}</span>
                <span>{item.status === "done" ? formatBytes(item.size, locale) : `${formatBytes(item.progress * item.size, locale)} / ${formatBytes(item.size, locale)}`}</span>
                {item.status === "uploading" && item.speed ? <span>{formatBytes(item.speed, locale)}/s</span> : null}
                {left !== null ? <span>{labels.remaining(left)}</span> : null}
              </p>
              {item.status === "error" && item.error ? (
                <p role="alert" className={s.error()}>
                  {item.error}
                </p>
              ) : null}
            </div>
            <div className={s.actions()}>
              {item.status === "uploading" && onPause && action(labels.pause(item.name), () => onPause(item.id), <PauseGlyph className="h-4 w-4" />)}
              {item.status === "paused" && onResume && action(labels.resume(item.name), () => onResume(item.id), <PlayGlyph className="h-4 w-4" />)}
              {item.status === "error" && onRetry && action(labels.retry(item.name), () => onRetry(item.id), <RetryGlyph className="h-4 w-4" />)}
              {(item.status === "done" || item.status === "error") && onRemove
                ? action(labels.remove(item.name), () => onRemove(item.id), <CloseGlyph className="h-4 w-4" />)
                : item.status !== "done" && onCancel
                  ? action(labels.cancel(item.name), () => onCancel(item.id), <CloseGlyph className="h-4 w-4" />)
                  : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export type UploadContext = {
  /** Aborted on pause and cancel: stop sending (`tusUpload.abort()`, `xhr.abort()`). */
  signal: AbortSignal;
  /** Report the bytes sent so far. */
  onProgress: (sent: number) => void;
  /** `true` when this call resumes a paused or failed upload (a Tus client then continues from its offset). */
  resumed: boolean;
};

export type UploadQueueOptions = {
  /** Sends one file; resolves when it is done, rejects on failure (its `message` becomes the item's error). */
  upload: (file: File, context: UploadContext) => Promise<void>;
  /** How many files go at once. Default 2. */
  concurrency?: number;
  /** Makes an object URL for each file to preview (revoked when it leaves). Default `true`. */
  previews?: boolean;
};

type Entry = { item: UploadItem; file: File; controller: AbortController | null; started: boolean; last?: { at: number; sent: number } };

/** The queue itself, outside React: entries, the pump that starts the next uploads, and the actions. */
function createQueue(initial: UploadQueueOptions, emit: (items: UploadItem[]) => void) {
  let current = initial;
  const options = () => current;
  const entries = new Map<string, Entry>();
  const sync = () => emit([...entries.values()].map((e) => e.item));
  const patch = (id: string, next: Partial<UploadItem>) => {
    const entry = entries.get(id);
    if (!entry) return;
    entry.item = { ...entry.item, ...next };
    sync();
  };
  const pump = () => {
    const { upload, concurrency = 2 } = options();
    const all = [...entries.values()];
    let running = all.filter((e) => e.item.status === "uploading").length;
    for (const entry of all) {
      if (running >= concurrency) break;
      if (entry.item.status !== "queued") continue;
      running += 1;
      const controller = new AbortController();
      const resumed = entry.started;
      entry.controller = controller;
      entry.started = true;
      entry.last = { at: Date.now(), sent: entry.item.progress * entry.item.size };
      patch(entry.item.id, { status: "uploading", error: undefined });
      upload(entry.file, {
        signal: controller.signal,
        resumed,
        onProgress: (sent) => {
          if (controller.signal.aborted) return;
          const now = Date.now();
          const last = entry.last ?? { at: now, sent };
          const fresh = now - last.at > 400;
          const speed = fresh ? ((sent - last.sent) / (now - last.at)) * 1000 : entry.item.speed;
          if (fresh) entry.last = { at: now, sent };
          patch(entry.item.id, { progress: entry.item.size ? Math.min(1, sent / entry.item.size) : 0, speed });
        },
      }).then(
        () => {
          if (controller.signal.aborted) return;
          patch(entry.item.id, { status: "done", progress: 1, speed: undefined });
          pump();
        },
        (error: unknown) => {
          if (controller.signal.aborted) return;
          patch(entry.item.id, { status: "error", error: error instanceof Error ? error.message : String(error), speed: undefined });
          pump();
        },
      );
    }
  };
  const release = (entry: Entry) => {
    entry.controller?.abort();
    if (entry.item.previewUrl) URL.revokeObjectURL(entry.item.previewUrl);
  };
  return {
    configure(next: UploadQueueOptions) {
      current = next;
    },
    add(files: readonly File[]) {
      const { previews = true } = options();
      for (const file of files) {
        const id = `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`;
        const previewUrl = previews && typeof URL.createObjectURL === "function" ? URL.createObjectURL(file) : undefined;
        entries.set(id, { file, controller: null, started: false, item: { id, name: file.name, size: file.size, type: file.type, progress: 0, status: "queued", previewUrl } });
      }
      sync();
      pump();
    },
    pause(id: string) {
      entries.get(id)?.controller?.abort();
      patch(id, { status: "paused", speed: undefined });
      pump();
    },
    resume(id: string) {
      patch(id, { status: "queued" });
      pump();
    },
    remove(id: string) {
      const entry = entries.get(id);
      if (!entry) return;
      release(entry);
      entries.delete(id);
      sync();
      pump();
    },
    dispose() {
      for (const entry of entries.values()) release(entry);
    },
  };
}

/** The state of an upload queue around the app's `upload` function: `add`, `pause`, `resume`, `retry`, `cancel`, `remove`. */
export function useUploadQueue(options: UploadQueueOptions) {
  const [items, setItems] = React.useState<UploadItem[]>([]);
  const [queue] = React.useState(() => createQueue(options, setItems));
  React.useLayoutEffect(() => queue.configure(options));
  React.useEffect(() => () => queue.dispose(), [queue]);
  return { items, add: queue.add, pause: queue.pause, resume: queue.resume, retry: queue.resume, cancel: queue.remove, remove: queue.remove };
}
