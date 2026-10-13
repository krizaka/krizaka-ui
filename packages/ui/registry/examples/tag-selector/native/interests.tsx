import { TagSelector } from "@krizaka/ui/native";
import { useState } from "react";
import { View } from "react-native";

const INTERESTS = ["Music", "Surf", "Cooking", "Hiking", "Cinema", "Climbing", "Travel", "Gaming", "Yoga", "Photography"].map((t) => ({ value: t.toLowerCase(), label: t }));

// Up to five interests: the others rest once five are chosen, the count says so.
export default function NativeTagSelectorInterests() {
  const [chosen, setChosen] = useState<string[]>(["music", "surf", "travel"]);
  return (
    <View style={{ width: 340 }}>
      <TagSelector label="Interests" options={INTERESTS} value={chosen} onValueChange={setChosen} max={5} countLabel={(n, max) => `${n} of ${max} chosen`} />
    </View>
  );
}
