import { TagSelector } from "@krizaka/ui/native";
import { useState } from "react";
import { View } from "react-native";

const TAGS = [
  { value: "regular", label: "Regular", marker: "blue" },
  { value: "to-follow", label: "To follow up", marker: "amber" },
  { value: "late", label: "Late payer", marker: "red" },
] as const;

// The tags of a client (a fictitious bike workshop), each with its marker.
export default function NativeTagSelectorTags() {
  const [chosen, setChosen] = useState<string[]>(["regular"]);
  return (
    <View style={{ width: 340 }}>
      <TagSelector label="Tags of Eric" options={TAGS} value={chosen} onValueChange={setChosen} />
    </View>
  );
}
