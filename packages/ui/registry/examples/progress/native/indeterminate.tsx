import { Progress } from "@krizaka/ui/native";
import { View } from "react-native";

// No value: a wait of unknown length (still under reduced motion).
export default function NativeProgressIndeterminate() {
  return (
    <View style={{ width: 320, gap: 16 }}>
      <Progress label="Processing" />
      <Progress variant="ring" label="Processing" />
    </View>
  );
}
