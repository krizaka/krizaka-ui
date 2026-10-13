import { Tabs, Txt } from "@krizaka/ui/native";
import { View } from "react-native";

// A creator's page: sections that scroll sideways when they do not fit, a count after the words.
export default function NativeTabsSections() {
  return (
    <View style={{ width: 340 }}>
      <Tabs
        aria-label="Elena's page"
        items={[
          { value: "videos", label: "Videos", count: 42, content: <Txt tone="secondary">42 videos, newest first.</Txt> },
          { value: "auctions", label: "Auctions", count: 3, content: <Txt tone="secondary">3 auctions running.</Txt> },
          { value: "challenges", label: "Challenges", content: <Txt tone="secondary">Dares from fans.</Txt> },
          { value: "about", label: "About", content: <Txt tone="secondary">Covers and live sessions.</Txt> },
        ]}
      />
    </View>
  );
}
