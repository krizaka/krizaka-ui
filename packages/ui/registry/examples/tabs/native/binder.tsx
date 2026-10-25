import { Tabs, Txt } from "@krizaka/ui/native";
import { View } from "react-native";

// Binder dividers on a phone: a coloured edge and a count per collection; they scroll sideways when they do not fit.
export default function NativeTabsBinder() {
  return (
    <View style={{ width: 340 }}>
      <Tabs
        aria-label="Client collections"
        variant="binder"
        defaultValue="regulars"
        add={{ label: "Divider", onAdd: () => undefined }}
        items={[
          { value: "all", label: "All", count: 48, content: <Txt tone="secondary">48 clients.</Txt> },
          { value: "regulars", label: "Regulars", hue: "success", count: 21, content: <Txt tone="secondary">21 regular clients.</Txt> },
          { value: "new", label: "New", hue: "accent", count: 9, content: <Txt tone="secondary">9 new clients.</Txt> },
          { value: "follow-up", label: "Follow up", hue: "warning", count: 5, content: <Txt tone="secondary">5 to call back.</Txt> },
        ]}
      />
    </View>
  );
}
