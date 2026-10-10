import { Chip } from "@krizaka/ui/native";
import { View } from "react-native";

export default function NativeChipRemovable() {
  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      <Chip removable removeLabel="Remove #night" onRemove={() => {}}>
        #night
      </Chip>
      <Chip removable removeLabel="Remove #live" onRemove={() => {}}>
        #live
      </Chip>
    </View>
  );
}
