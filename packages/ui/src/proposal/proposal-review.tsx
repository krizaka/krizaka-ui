"use client";
// Client (the two-step confirmation lives in ConfirmButton). An agent proposes, a person approves, rejects or edits. The
// host owns the state (`waiting` · `approved` · `rejected` · `expired`) and announces it here; the block never decides
// for the person. No slide-to-approve (ADR-006): a button, reachable by keyboard and read by a screen reader.
import * as React from "react";

import { Badge } from "../badge/badge";
import { Button } from "../button/button";
import { cn } from "../cn";
import { ConfirmButton } from "../confirm-button/confirm-button";

export type ProposalState = "waiting" | "approved" | "rejected" | "expired";

export type ProposalConfidence = {
  /** In words: « High confidence », never colour alone. */
  label: string;
  /** 0 to 100, shown beside the words when given. */
  percent?: number;
  /** `high` · `medium` · `low`: the tone of the chip. */
  level: "high" | "medium" | "low";
};

export type ProposalWords = {
  /** « Approve » */
  approve: string;
  /** « Reject » */
  reject: string;
  /** Shown only when `onEdit` is given. */
  edit?: string;
  /** What the second press of an irreversible approval does: « Approve for good? ». */
  confirmApprove: string;
  /** The states in words, announced when they change. */
  states: Record<ProposalState, string>;
};

export type ProposalReviewProps = Omit<React.ComponentProps<"section">, "title" | "children"> & {
  /** The agent that proposes: its name, with its bird or mark in `mark`. */
  agent: string;
  /** The agent's bird or mark, drawn small beside its name. */
  mark?: React.ReactNode;
  /** What it proposes, in one sentence. */
  summary: string;
  /** How sure the agent is: in words, with the figure when known. */
  confidence: ProposalConfidence;
  /** The evidence: a `DiffView`, a list, a quote. */
  children?: React.ReactNode;
  /** Where the decision stands; the host owns it. */
  state: ProposalState;
  /** BCP 47 language for the percentage. */
  locale?: string;
  /** The words, passed translated. */
  words: ProposalWords;
  /** The person approves. */
  onApprove: () => void;
  /** The person rejects. */
  onReject: () => void;
  /** The person edits the proposal first; the button shows only when given. */
  onEdit?: () => void;
  /** The approval cannot be undone: it takes two presses. */
  irreversible?: boolean;
  /** Blocks the actions while the host saves the decision. */
  busy?: boolean;
};

const TONES = { high: "success", medium: "accent", low: "warning" } as const;

/** One proposal of an agent, its evidence, and the person's decision. */
export function ProposalReview({ agent, mark, summary, confidence, children, state, locale, words, onApprove, onReject, onEdit, irreversible = false, busy = false, className, ...props }: Readonly<ProposalReviewProps>) {
  const headingId = React.useId();
  const percent = confidence.percent === undefined ? null : new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 0 }).format(confidence.percent / 100);
  return (
    <section aria-labelledby={headingId} data-state={state} className={cn("flex flex-col gap-3 rounded-xl border border-border bg-surface-1 p-4", className)} {...props}>
      <header className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div className="flex min-w-0 items-center gap-2">
          {mark && <span className="h-8 w-8 shrink-0 [&>*]:h-full [&>*]:w-full">{mark}</span>}
          <p id={headingId} className="min-w-0 text-sm font-semibold break-words text-fg">
            {agent}
          </p>
        </div>
        <Badge tone={TONES[confidence.level]} dot>
          {confidence.label}
          {percent && ` · ${percent}`}
        </Badge>
      </header>
      <p className="text-base text-fg">{summary}</p>
      {children}
      <div className="flex flex-wrap items-center gap-2">
        {state === "waiting" ? (
          <>
            {irreversible ? (
              <ConfirmButton variant="primary" size="md" disabled={busy} confirmLabel={words.confirmApprove} onConfirm={onApprove}>
                {words.approve}
              </ConfirmButton>
            ) : (
              <Button variant="primary" size="md" disabled={busy} onClick={onApprove}>
                {words.approve}
              </Button>
            )}
            <Button variant="secondary" size="md" disabled={busy} onClick={onReject}>
              {words.reject}
            </Button>
            {onEdit && words.edit && (
              <Button variant="ghost" size="md" disabled={busy} onClick={onEdit}>
                {words.edit}
              </Button>
            )}
          </>
        ) : null}
        <output data-proposal-state={state} className={cn("text-sm font-medium", state === "waiting" ? "sr-only" : "text-fg-secondary")}>
          {words.states[state]}
        </output>
      </div>
    </section>
  );
}
