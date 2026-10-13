import { Loader } from "@krizaka/ui/native";
import { View } from "react-native";

// `block`: the centre of a region whose content is on its way (the Jobs tab's first load).
export default function NativeLoaderBlock() {
  return (
    <View style={{ width: 320 }}>
      <Loader variant="block" label="Loading your jobs" delay={0} />
    </View>
  );
}
