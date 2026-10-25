import { StatusChip } from "@krizaka/ui/native";
import { useState } from "react";
import { View } from "react-native";

// Applicant files of a fictitious landlord: « To decide » opens the moves of the role; a derived status is read-only.
export default function NativeStatusChipDefault() {
  const [state, setState] = useState<"to-decide" | "selected" | "declined">("to-decide");
  const open = state === "to-decide";
  return (
    <View style={{ gap: 12, alignItems: "flex-start" }}>
      <StatusChip
        label={{ "to-decide": "To decide", selected: "Selected", declined: "Declined" }[state]}
        tone={open ? "accent" : state === "selected" ? "success" : "neutral"}
        moves={open ? [{ key: "selected", label: "Selected", confirm: true }, { key: "declined", label: "Declined", reasons: [{ key: "incomplete", label: "Incomplete file" }] }] : []}
        onMove={(to) => setState(to as typeof state)}
      />
      <StatusChip label="Paid" tone="success" />
    </View>
  );
}
