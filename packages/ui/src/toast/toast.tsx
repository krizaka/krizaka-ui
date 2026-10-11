// Client. sonner does the queue, the stacking, the swipe, the timers, the live region and the hotkey; the look is
// ours: sonner's own styling is off (`unstyled`) and every part reads a role. The status tones are soft (a tinted
// border and a coloured icon, the text stays `text-fg`): the invariant status tokens are too light for small text.
import type * as React from "react";
import { type ExternalToast, toast, Toaster as Sonner, type ToasterProps as SonnerProps } from "sonner";

import { cn } from "../cn";
import { LoaderGlyph } from "../spinner/glyph";

export type { ExternalToast } from "sonner";
export { toast } from "sonner";

// The status: a rail of light along the left edge, glowing in the status colour, and the icon in that colour.
const tone = (color: string) =>
  cn("before:absolute before:inset-y-3 before:left-0 before:w-[3px] before:rounded-r-full before:shadow-[0_0_10px_var(--kz-rail)]", color);

export const toastClassNames = {
  // `kz-toast`: a hairline at the bottom counts the time left, and pauses with the toast (hover, focus) — motion.css.
  toast:
    // Frosted glass over the page (BRAND.md §6): the glass, its edge light, the overlay's ink shadow.
    "kz-toast group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-xl border glass p-4 pr-10 " +
    "[corner-top-right-shape:var(--kz-cut-shape)] " +
    "text-sm text-fg shadow-overlay inset-shadow-edge",
  default: "",
  title: "font-semibold text-fg",
  description: "mt-0.5 text-xs text-fg-secondary",
  content: "flex min-w-0 flex-1 flex-col",
  icon: "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center [&>svg]:h-4 [&>svg]:w-4",
  success: tone("[--kz-rail:var(--kz-success)] before:bg-success [&_[data-icon]]:text-success"),
  warning: tone("[--kz-rail:var(--kz-warning)] before:bg-warning [&_[data-icon]]:text-warning"),
  error: tone("[--kz-rail:var(--kz-danger)] before:bg-danger [&_[data-icon]]:text-danger"),
  info: tone("[--kz-rail:var(--kz-info)] before:bg-info [&_[data-icon]]:text-info"),
  loading: "",
  actionButton:
    "ml-auto shrink-0 self-center rounded-lg bg-accent bg-fill-shade px-3 py-1.5 text-xs font-semibold text-on-accent shadow-glow inset-shadow-edge-fill hover:bg-accent-hover active:scale-[0.97] transition-[scale,background-color] ease-spring " +
    "focus-visible:focus-ring",
  cancelButton:
    "shrink-0 self-center rounded-lg px-3 py-1.5 text-xs font-semibold text-fg-secondary hover:bg-surface-3 hover:text-fg " +
    "focus-visible:focus-ring",
  closeButton:
    "absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-fg-secondary hover:bg-surface-3 hover:text-fg " +
    "focus-visible:focus-ring [&>svg]:h-3.5 [&>svg]:w-3.5",
} satisfies NonNullable<NonNullable<SonnerProps["toastOptions"]>["classNames"]>;

export type ToasterProps = Omit<SonnerProps, "richColors" | "theme" | "containerAriaLabel" | "toastOptions"> & {
  /** The accessible name of the notifications region (sonner's `containerAriaLabel`) — passed translated. */
  label: string;
  /** The accessible name of each toast's close button — passed translated. */
  closeLabel: string;
  /** Extra options for every toast (duration, a className); the class names are merged with the platform's. */
  toastOptions?: Omit<NonNullable<SonnerProps["toastOptions"]>, "unstyled" | "closeButtonAriaLabel">;
};

/** Mount once, in the root layout. Then call `toast()`, `toast.success/warning/error/info`, `toast.custom(…)`, and the helpers below. */
export function Toaster({ label, closeLabel, position = "bottom-right", closeButton = true, toastOptions, duration = 4000, ...props }: ToasterProps) {
  const extra = toastOptions?.classNames ?? {};
  const classNames = Object.fromEntries(
    Object.entries(toastClassNames).map(([key, value]) => [key, cn(value, extra[key as keyof typeof extra])]),
  ) as typeof toastClassNames;
  return (
    <Sonner
      position={position}
      closeButton={closeButton}
      containerAriaLabel={label}
      richColors={false}
      duration={duration}
      style={{ "--kz-toast-duration": Number.isFinite(duration) ? `${duration}ms` : "none" } as React.CSSProperties}
      toastOptions={{ ...toastOptions, unstyled: true, closeButtonAriaLabel: closeLabel, classNames }}
      {...props}
    />
  );
}

/** The time-left hairline of one toast: its own duration (none when it stays). */
const timer = (duration: number | undefined, style?: React.CSSProperties) =>
  ({ ...style, "--kz-toast-duration": duration === undefined ? undefined : Number.isFinite(duration) ? `${duration}ms` : "none" }) as React.CSSProperties;

export interface UndoToastOptions extends Omit<ExternalToast, "action" | "cancel"> {
  /** The label of the undo button (“Undo”) — passed translated. */
  undoLabel: string;
  /** Called when the user undoes: restore what was done. */
  onUndo: () => void;
  /** Called when the toast goes without an undo: make it final (delete for good, send…). */
  onCommit?: () => void;
}

/**
 * “Archived — Undo”: an action that waits before it becomes final. The hairline counts the time left to undo (6 s by
 * default, paused while hovered or focused); `onCommit` runs when it goes without an undo. Returns the toast's id.
 */
export function undoToast(message: React.ReactNode, { undoLabel, onUndo, onCommit, duration = 6000, style, onAutoClose, onDismiss, ...options }: UndoToastOptions) {
  let undone = false;
  const commit = () => {
    if (!undone) onCommit?.();
  };
  return toast(message, {
    ...options,
    duration,
    style: timer(duration, style),
    action: {
      label: undoLabel,
      onClick: () => {
        undone = true;
        onUndo();
      },
    },
    onAutoClose: (t) => {
      commit();
      onAutoClose?.(t);
    },
    onDismiss: (t) => {
      commit();
      onDismiss?.(t);
    },
  });
}

export interface ProgressToastOptions extends Omit<ExternalToast, "id" | "icon"> {
  /** The toast to update: pass the id it returned the first time. */
  id?: string | number;
  /** Between 0 and 1. At 1 the toast turns to `doneMessage` (a success) and goes after the usual duration. */
  value: number;
  /** The message once done (“Uploaded”) — passed translated. */
  doneMessage?: React.ReactNode;
}

/**
 * A long task in a toast (an upload in the background): call it again with the same `id` as it advances — the glyph's
 * trace and a bar grow, without a new toast each time; at 1 it becomes a success. Returns the toast's id.
 */
export function progressToast(message: React.ReactNode, { id, value, doneMessage, description, style, ...options }: ProgressToastOptions) {
  const ratio = Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
  if (ratio >= 1) return toast.success(doneMessage ?? message, { ...options, id, description, style: timer(options.duration, style) });
  return toast(message, {
    ...options,
    id,
    duration: Number.POSITIVE_INFINITY,
    style: timer(Number.POSITIVE_INFINITY, style),
    icon: <LoaderGlyph value={ratio} className="h-4 w-4 text-accent" />,
    description: (
      <span className="mt-1 flex flex-col gap-1.5">
        {typeof description === "function" ? description() : description}
        <span aria-hidden className="block h-1 w-full overflow-hidden rounded-full bg-surface-3">
          <span className="block h-full rounded-full bg-linear-to-r from-accent to-accent-2 transition-[width] duration-500" style={{ width: `${ratio * 100}%` }} />
        </span>
        <span className="tabular-nums">{Math.round(ratio * 100)} %</span>
      </span>
    ),
  });
}

const counts = new Map<string, number>();

export interface GroupedToastOptions extends Omit<ExternalToast, "id"> {
  /** The repeat count in words (`(n) => \`${n} new messages\``) — passed translated; default “×n”. */
  countLabel?: (count: number) => string;
}

/**
 * The same event again and again (new messages, failed retries) folds into one toast that counts — instead of a pile.
 * Toasts with the same `key` share one place; the count resets once it goes. Returns the toast's id.
 */
export function groupedToast(key: string, message: React.ReactNode, { countLabel = (n) => `×${n}`, onAutoClose, onDismiss, ...options }: GroupedToastOptions = {}) {
  const count = (counts.get(key) ?? 0) + 1;
  counts.set(key, count);
  const reset = () => counts.delete(key);
  return toast(message, {
    ...options,
    id: `group:${key}`,
    description: count > 1 ? countLabel(count) : options.description,
    onAutoClose: (t) => {
      reset();
      onAutoClose?.(t);
    },
    onDismiss: (t) => {
      reset();
      onDismiss?.(t);
    },
  });
}
