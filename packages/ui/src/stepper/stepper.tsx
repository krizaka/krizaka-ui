// Server-safe. The steps of a journey or a job: an ordered list whose nodes are the Krizaka loader glyph — the current
// step traces its hexagon (and grows to its `value` when known), a done step draws its check, a failed one its cross —
// joined by connectors that fill as the journey advances. The state of every step is said in words, not only colour.
import type * as React from "react";
import { tv } from "tailwind-variants";

import { LoaderGlyph } from "../spinner/glyph";

export type StepStatus = "done" | "current" | "upcoming" | "error";

export interface Step {
  /** Its name — passed translated. */
  title: string;
  /** One line under it (what happens, a time) — passed translated. */
  description?: string;
  /** Where it stands; by default from `current` (before: done, at: current, after: upcoming). */
  status?: StepStatus;
  /** Between 0 and 1 for the current step: its glyph grows to it. */
  value?: number;
  /** Anything under the step while it is current or failed: a progress bar, an action, a detail. */
  content?: React.ReactNode;
}

export const stepper = tv({
  slots: {
    root: "flex",
    step: "group/step relative flex min-w-0",
    node: "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-0",
    glyph: "h-6 w-6",
    connector: "absolute bg-border-default after:absolute after:inset-0 after:origin-top-left after:bg-accent after:transition-transform after:duration-700 motion-reduce:after:transition-none",
    body: "min-w-0",
    title: "text-sm font-semibold text-fg group-data-[status=upcoming]/step:text-fg-secondary",
    description: "mt-0.5 text-xs text-fg-secondary",
    state: "sr-only",
    content: "mt-2",
  },
  variants: {
    orientation: {
      vertical: {
        root: "flex-col",
        step: "gap-3 pb-6 last:pb-0",
        connector: "left-3.5 top-7 bottom-0 w-0.5 -translate-x-1/2 group-last/step:hidden after:scale-y-0 group-data-[status=done]/step:after:scale-y-100",
        body: "pt-1",
      },
      horizontal: {
        root: "flex-row",
        step: "flex-1 flex-col gap-2 pr-3 last:flex-none last:pr-0",
        connector: "left-8 right-1 top-3.5 h-0.5 -translate-y-1/2 group-last/step:hidden after:scale-x-0 group-data-[status=done]/step:after:scale-x-100",
        body: "",
      },
    },
  },
  defaultVariants: { orientation: "vertical" },
});

const GLYPH: Record<StepStatus, "loading" | "success" | "error" | null> = { done: "success", current: "loading", error: "error", upcoming: null };
const TONE: Record<StepStatus, string> = { done: "text-accent", current: "text-accent", error: "text-fg-danger", upcoming: "text-border-strong" };

export type StepperProps = Omit<React.ComponentProps<"ol">, "children"> & {
  /** The steps, in order. */
  steps: readonly Step[];
  /** The index of the current step: those before it are done, those after it upcoming (a step's own `status` wins). */
  current?: number;
  /** What each state is called, read with every step (“Done”, “In progress”, “Upcoming”, “Failed”) — passed translated. */
  labels: Readonly<Record<StepStatus, string>>;
  /**
   * vertical (a job, a timeline) · horizontal (a short journey, a checkout).
   * @default "vertical"
   */
  orientation?: "vertical" | "horizontal";
};

/** An ordered list of steps: `aria-current="step"` on the current one, each state said in words. */
export function Stepper({ steps, current = 0, labels, orientation = "vertical", className, ...props }: StepperProps) {
  const s = stepper({ orientation });
  return (
    <ol className={s.root({ className })} data-orientation={orientation} {...props}>
      {steps.map((step, i) => {
        const status: StepStatus = step.status ?? (i < current ? "done" : i === current ? "current" : "upcoming");
        const glyph = GLYPH[status];
        return (
          <li key={i} data-status={status} aria-current={status === "current" ? "step" : undefined} className={s.step()}>
            <span aria-hidden className={s.connector()} />
            <span aria-hidden className={s.node()}>
              {glyph ? (
                <LoaderGlyph state={glyph} value={status === "current" ? step.value : undefined} className={[s.glyph(), TONE[status]].join(" ")} />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" className={[s.glyph(), TONE[status]].join(" ")}>
                  <path d="M12 3 19.79 7.5 19.79 16.5 12 21 4.21 16.5 4.21 7.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <div className={s.body()}>
              <p className={s.title()}>
                {step.title}
                <span className={s.state()}> — {labels[status]}</span>
              </p>
              {step.description && <p className={s.description()}>{step.description}</p>}
              {step.content && (status === "current" || status === "error") && <div className={s.content()}>{step.content}</div>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
