// Client (a state, the clipboard). Copies a value and says so in a polite live region. Without the Clipboard API
// (an insecure page, an old webview) it falls back to a selected, read-only field the person copies by hand: the
// failure is never silent.
import * as React from "react";

import { Button, type ButtonProps } from "../button/button";
import { cn } from "../cn";
import { CheckGlyph, CopyGlyph } from "../glyphs";

export type CopyButtonProps = Omit<ButtonProps, "onClick" | "asChild" | "value" | "children"> & {
  /** The text to copy. */
  value: string;
  /** The words of the button (and its accessible name), passed translated: "Copy link". Icon only: set `iconOnly`. */
  label: string;
  /** What it says once copied, announced politely: "Copied". */
  copiedLabel: string;
  /** Said when the clipboard is unavailable, above the selected value: "Press Ctrl+C to copy". */
  fallbackLabel: string;
  /** Shows only the icon (the label stays the accessible name). */
  iconOnly?: boolean;
  /** Replaces the copy icon (a `@krizaka/icons` one, say). */
  icon?: React.ReactNode;
  /** Replaces the check icon shown once copied. */
  copiedIcon?: React.ReactNode;
  /** How long "Copied" stays, in milliseconds (1800 by default). */
  resetMs?: number;
  /** Called after the value is copied. */
  onCopy?: () => void;
};

/** A button that copies `value`. State: `data-copied`. */
export function CopyButton({ value, label, copiedLabel, fallbackLabel, iconOnly, icon, copiedIcon, resetMs = 1800, onCopy, variant = "secondary", className, ...props }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const [manual, setManual] = React.useState(false);
  const fieldRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), resetMs);
    return () => window.clearTimeout(timer);
  }, [copied, resetMs]);
  React.useEffect(() => {
    if (manual) fieldRef.current?.select();
  }, [manual]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setManual(false);
      setCopied(true);
      onCopy?.();
    } catch {
      // No Clipboard API, or refused: show the value selected, to copy by hand.
      setManual(true);
    }
  };
  const name = copied ? copiedLabel : label;
  return (
    <span className="inline-flex flex-col gap-1.5">
      <Button type="button" variant={variant} aria-label={iconOnly ? name : undefined} title={iconOnly ? name : undefined} data-copied={copied ? "" : undefined} className={cn(className)} onClick={() => void copy()} {...props}>
        {copied ? (copiedIcon ?? <CheckGlyph />) : (icon ?? <CopyGlyph />)}
        {!iconOnly && <span>{name}</span>}
      </Button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
      {manual && (
        <label className="flex flex-col gap-1 text-xs text-fg-secondary">
          {fallbackLabel}
          <input ref={fieldRef} readOnly value={value} onFocus={(event) => event.currentTarget.select()} className="h-9 rounded-lg border border-border-control bg-surface-2 px-2 text-sm text-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring" />
        </label>
      )}
    </span>
  );
}
