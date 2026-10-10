import { Segmented } from "@krizaka/ui/native";
import { useState } from "react";
import { View } from "react-native";

const OPTIONS = [
  { value: "feed", label: "Feed" },
  { value: "auctions", label: "Auctions" },
  { value: "challenges", label: "Challenges" },
] as const;

// `size="sm"`: in a header or a sheet.
export default function NativeSegmentedSmall() {
  const [value, setValue] = useState<(typeof OPTIONS)[number]["value"]>("auctions");
  return (
    <View style={{ width: 320 }}>
      <Segmented aria-label="View" options={OPTIONS} value={value} onValueChange={setValue} size="sm" />
    </View>
  );
}
