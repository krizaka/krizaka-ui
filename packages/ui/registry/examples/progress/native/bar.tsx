import { Progress } from "@krizaka/ui/native";
import { View } from "react-native";

export default function NativeProgressBar() {
  return (
    <View style={{ width: 320, gap: 16 }}>
      <Progress label="Upload" value={64} size="sm" />
      <Progress label="Upload" value={64} size="md" />
      <Progress label="Upload" value={64} size="lg" />
    </View>
  );
}
