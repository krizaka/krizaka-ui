import { Chip, TagChip } from "@krizaka/ui/native";
import { useState } from "react";
import { View } from "react-native";

// A client's tags (a fictitious bike workshop): the marker beside the name, a dot or a ribbon.
export default function NativeChipTags() {
  const [filter, setFilter] = useState(["regular"]);
  return (
    <View style={{ gap: 16, width: 340 }}>
      <Chip.Group type="multiple" aria-label="Filter clients by tag" value={filter} onValueChange={setFilter}>
        <TagChip value="regular" marker="blue">Regular</TagChip>
        <TagChip value="to-follow" marker="amber">To follow up</TagChip>
        <TagChip value="late" marker="red">Late payer</TagChip>
      </Chip.Group>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <TagChip marker="green" shape="ribbon" removable removeLabel="Remove the tag Pick-up" onRemove={() => {}}>Pick-up</TagChip>
      </View>
    </View>
  );
}
