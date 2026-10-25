// Server-safe. The blocking screen: this version can no longer run. It replaces the app, it is not laid over it —
// nothing behind it is reachable. Every word is a prop; the store URL and the versions come from the backend.
import { Button } from "@krizaka/ui/button";
import type * as React from "react";
import { tv } from "tailwind-variants";

import { warnDeprecated } from "../deprecated";

/** @deprecated Since 3.55 (ADR-006, krizaka-ui#674): no product uses it. Removed in 4.0. */
export const forceUpdateScreen = tv({
  slots: {
    root: "mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-4 px-6 py-12 text-center text-fg",
    mark: "flex h-24 w-24 items-center justify-center [&>svg]:h-24 [&>svg]:w-24",
    title: "text-2xl font-semibold text-fg",
    message: "text-fg-secondary",
    version: "font-mono text-xs text-fg-tertiary",
    actions: "mt-2 flex w-full flex-col gap-2",
  },
});

export type ForceUpdateScreenProps = Omit<React.ComponentProps<"main">, "title"> & {
  /** The headline (“Update to keep going”). */
  title: React.ReactNode;
  /** Why, in a sentence — the backend's localized `message`. */
  message?: React.ReactNode;
  /** The versions, in words and mono (“You have 1.1.0 · 1.2.0 or later is required”). */
  versionLabel?: React.ReactNode;
  /** The product's mark or mascot (decorative). */
  mark?: React.ReactNode;
  /** The button that updates (“Update the app”). */
  updateLabel: string;
  /** Opens the store page. */
  onUpdate: () => void;
  /** A secondary way (“Check again”) once the update is installed — optional. */
  retryLabel?: string;
  /** Checks the backend again. */
  onRetry?: () => void;
};

/**
 * The forced update: one thing to do, and the way to do it.
 * @deprecated Since 3.55 (ADR-006, krizaka-ui#674): no product uses it. Removed in 4.0.
 */
export function ForceUpdateScreen({ title, message, versionLabel, mark, updateLabel, onUpdate, retryLabel, onRetry, className, ...props }: ForceUpdateScreenProps) {
  warnDeprecated("force-update-screen");
  const s = forceUpdateScreen();
  return (
    <main data-kind="update-force" className={s.root({ className })} {...props}>
      {mark && (
        <div aria-hidden className={s.mark()}>
          {mark}
        </div>
      )}
      <h1 className={s.title()}>{title}</h1>
      {message && <p className={s.message()}>{message}</p>}
      {versionLabel && <p className={s.version()}>{versionLabel}</p>}
      <div className={s.actions()}>
        <Button variant="primary" size="lg" autoFocus onClick={onUpdate}>
          {updateLabel}
        </Button>
        {retryLabel && onRetry && (
          <Button variant="ghost" onClick={onRetry}>
            {retryLabel}
          </Button>
        )}
      </div>
    </main>
  );
}
