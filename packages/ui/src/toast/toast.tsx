// Client. sonner does the queue, the stacking, the swipe, the timers, the live region and the hotkey; the look is
// ours: sonner's own styling is off (`unstyled`) and every part reads a role. The status tones are soft (a tinted
// border and a coloured icon, the text stays `text-fg`): the invariant status tokens are too light for small text.
import { Toaster as Sonner, type ToasterProps as SonnerProps } from "sonner";

import { cn } from "../cn";

export type { ExternalToast } from "sonner";
export { toast } from "sonner";

const tone = (color: string) => cn("border-l-4", color);

export const toastClassNames = {
  toast:
    "group pointer-events-auto relative flex w-full items-start gap-3 rounded-xl border border-border-default bg-surface-2 p-4 pr-10 " +
    "text-sm text-fg shadow-lg",
  default: "",
  title: "font-semibold text-fg",
  description: "mt-0.5 text-xs text-fg-secondary",
  content: "flex min-w-0 flex-1 flex-col",
  icon: "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center [&>svg]:h-4 [&>svg]:w-4",
  success: tone("border-l-success [&_[data-icon]]:text-success"),
  warning: tone("border-l-warning [&_[data-icon]]:text-warning"),
  error: tone("border-l-danger [&_[data-icon]]:text-danger"),
  info: tone("border-l-info [&_[data-icon]]:text-info"),
  loading: "",
  actionButton:
    "ml-auto shrink-0 self-center rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-on-accent hover:bg-accent-hover " +
    "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
  cancelButton:
    "shrink-0 self-center rounded-lg px-3 py-1.5 text-xs font-semibold text-fg-secondary hover:bg-surface-3 hover:text-fg " +
    "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
  closeButton:
    "absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-fg-secondary hover:bg-surface-3 hover:text-fg " +
    "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring [&>svg]:h-3.5 [&>svg]:w-3.5",
} satisfies NonNullable<NonNullable<SonnerProps["toastOptions"]>["classNames"]>;

export type ToasterProps = Omit<SonnerProps, "richColors" | "theme" | "containerAriaLabel" | "toastOptions"> & {
  /** The accessible name of the notifications region (sonner's `containerAriaLabel`) — passed translated. */
  label: string;
  /** The accessible name of each toast's close button — passed translated. */
  closeLabel: string;
  /** Extra options for every toast (duration, a className); the class names are merged with the platform's. */
  toastOptions?: Omit<NonNullable<SonnerProps["toastOptions"]>, "unstyled" | "closeButtonAriaLabel">;
};

/** Mount once, in the root layout. Then call `toast()`, `toast.success/warning/error/info`, `toast.custom(…)`. */
export function Toaster({ label, closeLabel, position = "bottom-right", closeButton = true, toastOptions, ...props }: ToasterProps) {
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
      toastOptions={{ ...toastOptions, unstyled: true, closeButtonAriaLabel: closeLabel, classNames }}
      {...props}
    />
  );
}
