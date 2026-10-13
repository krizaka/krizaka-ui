import { Select } from "@krizaka/ui/native";
import * as React from "react";
import { View } from "react-native";

// One choice among many: the field opens a sheet of options; picking one closes it.
export default function NativeFieldSelect() {
  const [category, setCategory] = React.useState<string | null>(null);
  return (
    <View style={{ width: 300 }}>
      <Select
        label="Category"
        placeholder="Choose a category"
        value={category}
        onValueChange={setCategory}
        hint="Where your video is listed."
        options={[
          { value: "music", label: "Music" },
          { value: "sport", label: "Sport", description: "Training, matches, challenges" },
          { value: "art", label: "Art" },
          { value: "talk", label: "Talk" },
        ]}
      />
    </View>
  );
}
