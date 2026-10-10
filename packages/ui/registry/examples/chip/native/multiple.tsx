import { Chip } from "@krizaka/ui/native";
import { View } from "react-native";

// `scrollable`: one horizontal row, a filter bar.
export default function NativeChipMultiple() {
  return (
    <View style={{ width: 320 }}>
      <Chip.Group type="multiple" defaultValue={["house", "techno"]} aria-label="Genres" scrollable>
        <Chip value="house">House</Chip>
        <Chip value="techno">Techno</Chip>
        <Chip value="ambient">Ambient</Chip>
        <Chip value="jazz">Jazz</Chip>
        <Chip value="soul">Soul</Chip>
      </Chip.Group>
    </View>
  );
}
