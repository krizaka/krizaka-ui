import { Loader } from "@krizaka/ui/native";
import { View } from "react-native";

// The app's own mark waits for you: the animated `ProductMark` of Orochia, still when the system reduces motion.
export default function NativeLoaderBranded() {
  return (
    <View style={{ width: 340 }}>
      <Loader label="Loading your videos" product="orochia" variant="block" delay={0} />
    </View>
  );
}
