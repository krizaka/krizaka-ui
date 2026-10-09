// Client (a state). A destructive action confirmed by a second press, never `window.confirm`: the first press arms it
// and says what will happen (`confirmLabel`, announced politely), the second runs `onConfirm`. It disarms by itself
// after `timeoutMs`, on Escape, and when the focus leaves. The danger is the border and the tint; the words stay a
// text role (contrast AA in both themes).
import { VisuallyHidden } from "radix-ui";
import * as React from "react";

import { Button, type ButtonProps } from "../button/button";
import { cn } from "../cn";

export const confirmArmed = "border border-danger bg-danger/20 text-fg hover:border-danger hover:bg-danger/30";

export type ConfirmButtonProps = Omit<ButtonProps, "onClick" | "asChild"> & {
  /** What the second press does, in words — shown and announced once armed ("Delete for good?"). Passed translated. */
  confirmLabel: string;
  /** The accessible name while idle, for an icon-only button (the confirm label names it once armed). */
  label?: string;
  /** Runs on the second press. */
  onConfirm: () => void;
  /** Disarms after this many milliseconds (4000 by default). */
  timeoutMs?: number;
  /** What it shows once armed (default: its children, then `confirmLabel`). */
  armedContent?: React.ReactNode;
  /** Notified when it arms and disarms. */
  onArmedChange?: (armed: boolean) => void;
};

/** A two-step button: press to arm, press again within `timeoutMs` to confirm. State: `data-armed`. */
export function ConfirmButton({
  confirmLabel,
  label,
  onConfirm,
  timeoutMs = 4000,
  onArmedChange,
  armedContent,
  variant = "ghost",
  className,
  children,
  onBlur,
  onKeyDown,
  ...props
}: ConfirmButtonProps) {
  const [armed, setArmedState] = React.useState(false);
  const armedRef = React.useRef(false);
  const onArmedChangeRef = React.useRef(onArmedChange);
  React.useEffect(() => {
    onArmedChangeRef.current = onArmedChange;
  }, [onArmedChange]);
  const setArmed = React.useCallback((next: boolean) => {
    if (armedRef.current === next) return;
    armedRef.current = next;
    setArmedState(next);
    onArmedChangeRef.current?.(next);
  }, []);
  React.useEffect(() => {
    if (!armed) return;
    const timer = window.setTimeout(() => setArmed(false), timeoutMs);
    return () => window.clearTimeout(timer);
  }, [armed, timeoutMs, setArmed]);
  const name = armed ? confirmLabel : label;
  return (
    <>
      <Button
        variant={variant}
        aria-label={name}
        title={name}
        data-armed={armed ? "" : undefined}
        className={cn(armed && confirmArmed, className)}
        onClick={() => {
          if (!armed) return setArmed(true);
          setArmed(false);
          onConfirm();
        }}
        onBlur={(event) => {
          onBlur?.(event);
          setArmed(false);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (armed && event.key === "Escape") {
            event.stopPropagation();
            setArmed(false);
          }
        }}
        {...props}
      >
        {armed
          ? (armedContent ?? (
              <>
                {children}
                <span>{confirmLabel}</span>
              </>
            ))
          : children}
      </Button>
      <VisuallyHidden.Root aria-live="polite">{armed ? confirmLabel : ""}</VisuallyHidden.Root>
    </>
  );
}
