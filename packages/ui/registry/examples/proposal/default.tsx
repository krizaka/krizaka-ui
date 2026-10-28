"use client";

import { DiffView, ProposalReview, type ProposalWords } from "@krizaka/ui/proposal";
import { useState } from "react";

export const words: ProposalWords = {
  approve: "Approve", reject: "Reject", edit: "Edit", confirmApprove: "Approve for good?",
  states: { waiting: "Waiting for your decision", approved: "Approved", rejected: "Rejected", expired: "Expired" },
};
export const diffWords = { label: "Proposed changes", added: "Added", removed: "Removed", unchanged: "Unchanged" };
export const lines = [
  { kind: "context", text: "Delivery: weekly" },
  { kind: "removed", text: "Reminder: 3 days before" },
  { kind: "added", text: "Reminder: 1 day before, by e-mail" },
] as const;

export default function ProposalDefault() {
  const [state, setState] = useState<"waiting" | "approved" | "rejected">("waiting");
  return (
    <ProposalReview agent="Planner agent" summary="Move the reminder to the day before, by e-mail." confidence={{ level: "high", label: "High confidence", percent: 92 }} state={state} locale="en-CA" words={words} onApprove={() => setState("approved")} onReject={() => setState("rejected")} onEdit={() => {}}>
      <DiffView lines={lines} words={diffWords} />
    </ProposalReview>
  );
}
