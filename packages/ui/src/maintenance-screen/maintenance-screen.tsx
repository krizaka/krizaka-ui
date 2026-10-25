// Server-safe. The service is down on purpose (maintenance on, from the backend's parameters): say so, say when to
// come back, and let the person check again. Replaces the app, like the forced update.
import { Button } from "@krizaka/ui/button";
import type * as React from "react";
import { tv } from "tailwind-variants";

import { warnDeprecated } from "../deprecated";

/** @deprecated Since 3.55 (ADR-006, krizaka-ui#674): no product uses it. Removed in 4.0. */
export const maintenanceScreen = tv({
  slots: {
    root: "mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-4 px-6 py-12 text-center text-fg",
    mark: "flex h-24 w-24 items-center justify-center [&>svg]:h-24 [&>svg]:w-24",
    title: "text-2xl font-semibold text-fg",
    message: "text-fg-secondary",
    actions: "mt-2 flex w-full flex-col gap-2",
  },
});

export type MaintenanceScreenProps = Omit<React.ComponentProps<"main">, "title"> & {
  /** The headline (“Back in a few minutes”). */
  title: React.ReactNode;
  /** What is happening — the backend's localized maintenance `message`. */
  message?: React.ReactNode;
  /** The product's mark or mascot (decorative). */
  mark?: React.ReactNode;
  /** The button that checks again (“Try again”). */
  retryLabel?: string;
  /** Checks the backend again. */
  onRetry?: () => void;
};

/**
 * The maintenance screen: announced politely, with one way to check again.
 * @deprecated Since 3.55 (ADR-006, krizaka-ui#674): no product uses it. Removed in 4.0.
 */
export function MaintenanceScreen({ title, message, mark, retryLabel, onRetry, className, ...props }: MaintenanceScreenProps) {
  warnDeprecated("maintenance-screen");
  const s = maintenanceScreen();
  return (
    <main data-kind="maintenance" className={s.root({ className })} {...props}>
      {mark && (
        <div aria-hidden className={s.mark()}>
          {mark}
        </div>
      )}
      <div role="status" className="flex flex-col items-center gap-4">
        <h1 className={s.title()}>{title}</h1>
        {message && <p className={s.message()}>{message}</p>}
      </div>
      {retryLabel && onRetry && (
        <div className={s.actions()}>
          <Button variant="secondary" onClick={onRetry}>
            {retryLabel}
          </Button>
        </div>
      )}
    </main>
  );
}
