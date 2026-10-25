import { StatusSetEditor,type StatusSetEditorProps } from "@krizaka/ui/native";
import { useState } from "react";
import { View } from "react-native";

const label = (fr: string, en: string) => ({ fr, en });

// The statuses of applicant files for a fictitious landlord: states in order, a final state with no way out, the moves by role.
export default function NativeStatusSetEditor() {
  const [set, setSet] = useState<StatusSetEditorProps["value"]>({
    key: "applicant_file", label: label("Dossier", "File"), mode: "editable", initial: "to_decide",
    states: [{ key: "to_decide", label: label("À décider", "To decide"), tone: "accent" }, { key: "selected", label: label("Retenu", "Selected"), tone: "success", final: true }],
    transitions: [{ from: "to_decide", to: "selected", roles: ["owner"], confirm: true }],
  });
  return (
    <View style={{ width: 340 }}>
      <StatusSetEditor value={set} onChange={setSet} roles={[{ key: "owner", label: "Owner" }]} />
    </View>
  );
}
