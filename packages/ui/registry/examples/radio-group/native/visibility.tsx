import { RadioGroup } from "@krizaka/ui/native";
import { View } from "react-native";

// Who sees a story: one choice among a few, all visible.
export default function NativeRadioGroupVisibility() {
  return (
    <View style={{ width: 320 }}>
      <RadioGroup
        label="Who can see this story"
        defaultValue="followers"
        options={[
          { value: "everyone", label: "Everyone" },
          { value: "followers", label: "Followers", description: "1,284 people" },
          { value: "supporters", label: "Supporters only", description: "Fans who tipped you" },
        ]}
      />
    </View>
  );
}
