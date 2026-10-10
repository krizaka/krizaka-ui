import { Skeleton } from "@krizaka/ui/native";
import { View } from "react-native";

// text · circle · rect, composed into what is loading; hidden from screen readers.
export default function NativeSkeletonShapes() {
  return (
    <View style={{ width: 320, gap: 12 }}>
      <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
        <Skeleton shape="circle" />
        <View style={{ flex: 1, gap: 8 }}>
          <Skeleton shape="text" width="60%" />
          <Skeleton shape="text" width="40%" />
        </View>
      </View>
      <Skeleton shape="rect" />
    </View>
  );
}
