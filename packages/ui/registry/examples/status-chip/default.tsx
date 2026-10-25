"use client";

import { StatusChip, type StatusSet } from "@krizaka/ui/status-chip";
import * as React from "react";

const label = (fr: string, en: string) => ({ fr, en });
// Applicant files of a fictitious landlord (« To decide → Selected | Declined »): a declined file is final, the reason is picked.
const files: StatusSet = {
  key: "applicant-file", label: label("Dossier", "File"), mode: "editable", initial: "to-decide",
  states: [
    { key: "to-decide", label: label("À décider", "To decide"), tone: "accent" },
    { key: "selected", label: label("Retenu", "Selected"), tone: "success", final: true },
    { key: "declined", label: label("Non retenu", "Declined"), tone: "neutral", final: true },
  ],
  transitions: [
    { from: "to-decide", to: "selected", roles: ["owner"], confirm: true },
    { from: "to-decide", to: "declined", roles: ["owner"], reasons: [{ key: "incomplete", label: label("Dossier incomplet", "Incomplete file") }, { key: "other", label: label("Autre candidat", "Another applicant") }] },
  ],
};
const paid: StatusSet = { ...files, key: "invoice", mode: "derived", states: [{ key: "paid", label: label("Payée", "Paid"), tone: "success" }], transitions: [] };

export default function StatusChipDefault() {
  const [state, setState] = React.useState("to-decide");
  const move = ({ transition }: { transition: { to: string } }) => setState(transition.to);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <StatusChip set={files} state={state} role="owner" locale="en" onMove={move} />
      <StatusChip set={files} state="to-decide" role="viewer" locale="en" onMove={move} />
      <StatusChip set={paid} state="paid" role="owner" locale="en" onMove={move} />
    </div>
  );
}
