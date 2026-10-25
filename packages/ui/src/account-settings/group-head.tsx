import type * as React from "react";

/** The visible label (and one line of help) of a radio group: the group's `aria-labelledby` points at it. */
export function GroupHead({ id, label, description }: { id: string; label: React.ReactNode; description?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span id={id} className="text-sm font-medium text-fg">
        {label}
      </span>
      {description ? <span className="text-sm text-fg-secondary">{description}</span> : null}
    </div>
  );
}
