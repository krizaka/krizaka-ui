import { Badge, DescriptionList } from "@krizaka/ui/native";
import { View } from "react-native";

// A job's details on a phone: stacked, then a receipt inline.
export default function NativeDescriptionListJobDetails() {
  return (
    <View style={{ width: 320, gap: 24 }}>
      <DescriptionList
        items={[
          { term: "Status", details: <Badge tone="accent">Running</Badge> },
          { term: "Studio", details: "Dubbing · English, Spanish" },
          { term: "Started", details: "Oct 11, 14:02", hint: "by Elena Ruiz" },
        ]}
      />
      <DescriptionList
        layout="inline"
        items={[
          { term: "Estimated", details: "120 credits" },
          { term: "Left this month", details: "1,880 credits" },
        ]}
      />
    </View>
  );
}
