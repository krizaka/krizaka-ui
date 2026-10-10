import { Segmented } from "@krizaka/ui/native";
import { useState } from "react";
import { View } from "react-native";

const OPTIONS = [
  { value: "feed", label: "Feed" },
  { value: "auctions", label: "Auctions" },
  { value: "challenges", label: "Challenges" },
] as const;

// Controlled: the screen holds the value and shows the matching view.
export default function NativeSegmentedDefault() {
  const [value, setValue] = useState<(typeof OPTIONS)[number]["value"]>("auctions");
  return (
    <View style={{ width: 320 }}>
      <Segmented aria-label="View" options={OPTIONS} value={value} onValueChange={setValue} />
    </View>
  );
}
