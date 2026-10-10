import { Spinner } from "@krizaka/ui/native";
import { View } from "react-native";

// The platform's indicator in the accent, named by `label`.
export default function NativeSpinnerSizes() {
  return (
    <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
      <Spinner label="Loading" size="sm" />
      <Spinner label="Loading" size="md" />
      <Spinner label="Loading" size="lg" />
    </View>
  );
}
