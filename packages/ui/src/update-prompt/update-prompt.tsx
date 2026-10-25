// Server-safe. The soft invitation to update: a dismissible banner, in the flow of the page, never a blocker.
// Every word is a prop (the app passes them translated); the version and the store URL come from `useAppConfig`.
import { Button } from "@krizaka/ui/button";
import type * as React from "react";
import { tv } from "tailwind-variants";

import { warnDeprecated } from "../deprecated";

/** @deprecated Since 3.55 (ADR-006, krizaka-ui#674): no product uses it. Removed in 4.0. */
export const updatePrompt = tv({
  slots: {
    root: "flex w-full flex-wrap items-center gap-3 rounded-xl border border-border-default bg-surface-1 p-4 text-sm text-fg",
    mark: "flex h-10 w-10 shrink-0 items-center justify-center [&>svg]:h-10 [&>svg]:w-10",
    content: "flex min-w-0 flex-1 flex-col gap-0.5",
    title: "font-semibold text-fg",
    message: "text-fg-secondary",
    version: "font-mono text-xs text-fg-tertiary",
    actions: "flex shrink-0 items-center gap-2",
  },
});

export type UpdatePromptProps = Omit<React.ComponentProps<"section">, "title"> & {
  /** The headline (“A new version is available”). */
  title: React.ReactNode;
  /** Why update, in a sentence — the backend's localized `message`. */
  message?: React.ReactNode;
  /** The versions, in words and mono (“1.2.0 → 1.4.0”). */
  versionLabel?: React.ReactNode;
  /** The product's mark (decorative), e.g. `<OrazakaLogo />`. */
  mark?: React.ReactNode;
  /** The button that updates (“Update”). */
  updateLabel: string;
  /** Opens the store page, or reloads the app on the new version. */
  onUpdate: () => void;
  /** The way out (“Later”). */
  laterLabel: string;
  /** Called by the way out: the hook remembers it for this version. */
  onLater: () => void;
};

/**
 * The soft update: an invitation that can be dismissed, announced politely.
 * @deprecated Since 3.55 (ADR-006, krizaka-ui#674): no product uses it. Removed in 4.0.
 */
export function UpdatePrompt({ title, message, versionLabel, mark, updateLabel, onUpdate, laterLabel, onLater, className, ...props }: UpdatePromptProps) {
  warnDeprecated("update-prompt");
  const s = updatePrompt();
  return (
    <section role="region" aria-label={typeof title === "string" ? title : undefined} data-kind="update-soft" className={s.root({ className })} {...props}>
      {mark && (
        <div aria-hidden className={s.mark()}>
          {mark}
        </div>
      )}
      <div className={s.content()}>
        <p className={s.title()}>{title}</p>
        {message && <p className={s.message()}>{message}</p>}
        {versionLabel && <p className={s.version()}>{versionLabel}</p>}
      </div>
      <div className={s.actions()}>
        <Button variant="ghost" size="sm" onClick={onLater}>
          {laterLabel}
        </Button>
        <Button variant="primary" size="sm" onClick={onUpdate}>
          {updateLabel}
        </Button>
      </div>
    </section>
  );
}
