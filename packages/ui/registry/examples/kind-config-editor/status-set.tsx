"use client";

import { StatusSetEditor, type StatusSetEditorProps } from "@krizaka/ui/kind-config-editor";
import * as React from "react";

const ROLES = [{ key: "owner", label: "Owner" }, { key: "manager", label: "Manager" }];
const label = (fr: string, en: string) => ({ fr, en });

// The statuses of applicant files for a fictitious landlord: « To decide → Selected | Declined ». The order is the column's order,
// a final state has no way out, a move can ask for a second press and a reason picked from a list.
export default function StatusSetEditorExample() {
  const [set, setSet] = React.useState<StatusSetEditorProps["value"]>({
    key: "applicant_file", label: label("Dossier", "File"), mode: "editable", initial: "to_decide",
    states: [
      { key: "to_decide", label: label("À décider", "To decide"), tone: "accent" },
      { key: "selected", label: label("Retenu", "Selected"), tone: "success", final: true },
      { key: "declined", label: label("Non retenu", "Declined"), tone: "neutral", final: true },
    ],
    transitions: [
      { from: "to_decide", to: "selected", roles: ["owner"], confirm: true },
      { from: "to_decide", to: "declined", roles: ["owner", "manager"], reasons: [{ key: "incomplete", label: label("Dossier incomplet", "Incomplete file") }] },
    ],
  });
  return <StatusSetEditor value={set} onChange={setSet} roles={ROLES} />;
}
