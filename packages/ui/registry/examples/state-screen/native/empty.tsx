import { StateScreen } from "@krizaka/ui/native";
import { View } from "react-native";

// TEMPLATE — Empty: nothing yet, and the one way to fill it.
export default function NativeStateScreenEmpty() {
  return (
    <View style={{ width: 360, height: 480 }}>
      <StateScreen kind="empty" title="No files yet" description="Applicant files you create or receive will be listed here." action={{ label: "New file", onPress: () => undefined }} />
    </View>
  );
}
