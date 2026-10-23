// Server-safe. A ranked list from the host: this block never creates an action of its own.
import type * as React from "react";

export type ActionUrgency = "low" | "medium" | "high";

export interface NextAction {
  /** A stable key supplied by the host. */
  id: string;
  /** The action's short name. */
  title: React.ReactNode;
  /** Why it matters, in one line. */
  why: string;
  /** How soon it matters. */
  urgency: ActionUrgency;
  /** The host's translated urgency word. */
  urgencyLabel: React.ReactNode;
  /** A host-rendered link, button or command for a developer tool. */
  action: React.ReactNode;
}

export interface NextActionsProps extends Omit<React.ComponentProps<"section">, "children" | "title"> {
  /** A heading such as “Que faire maintenant”. */
  title: React.ReactNode;
  /** Two or three actions, already ordered by the host from most to least important. */
  actions: readonly [NextAction, NextAction] | readonly [NextAction, NextAction, NextAction];
}

/** “What to do now”: two or three ranked actions, with their reason and urgency. */
export function NextActions({ title, actions, className, ...props }: NextActionsProps) {
  return (
    <section className={["kz-next-actions", className].filter(Boolean).join(" ")} {...props}>
      <h2 className="kz-next-actions-title">{title}</h2>
      <ol className="kz-next-actions-list">
        {actions.map((action) => (
          <li className="kz-next-action" data-urgency={action.urgency} key={action.id}>
            <div className="kz-next-action-copy">
              <div className="kz-next-action-heading">
                <h3>{action.title}</h3>
                <span className="kz-next-action-urgency" data-urgency={action.urgency}>{action.urgencyLabel}</span>
              </div>
              <p>{action.why}</p>
            </div>
            <div className="kz-next-action-control">{action.action}</div>
          </li>
        ))}
      </ol>
    </section>
  );
}
