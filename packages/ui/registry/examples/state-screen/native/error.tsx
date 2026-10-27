import { StateScreen } from "@krizaka/ui/native";
import { View } from "react-native";

// TEMPLATE — Error: what failed in plain words, the way to retry, and a quieter way to get help. Announced as an alert.
export default function NativeStateScreenError() {
  return (
    <View style={{ width: 360, height: 480 }}>
      <StateScreen
        kind="error"
        title="We could not load your files"
        description="Nothing was lost. Try again in a moment."
        action={{ label: "Try again", onPress: () => undefined }}
        secondary={{ label: "Contact support", onPress: () => undefined }}
      />
    </View>
  );
}
