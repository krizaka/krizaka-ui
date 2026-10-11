import { Tabs, Txt } from "@krizaka/ui/native";
import { View } from "react-native";

// Two views of the same content: `variant="segmented"`.
export default function NativeTabsSegmented() {
  return (
    <View style={{ width: 320 }}>
      <Tabs
        variant="segmented"
        aria-label="Story insights"
        items={[
          { value: "viewers", label: "Viewers", content: <Txt tone="secondary">312 people watched.</Txt> },
          { value: "tips", label: "Tips", content: <Txt tone="secondary">$46 from 9 fans.</Txt> },
        ]}
      />
    </View>
  );
}
