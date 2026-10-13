import { RadioGroup } from "@krizaka/ui/native";
import { View } from "react-native";

// Dots and their words in 44-pt rows; one option disabled.
export default function NativeRadioGroupList() {
  return (
    <View style={{ width: 300 }}>
      <RadioGroup
        label="Notification frequency"
        defaultValue="daily"
        options={[
          { value: "instant", label: "Instantly" },
          { value: "daily", label: "Once a day", description: "At 6 pm, a summary." },
          { value: "weekly", label: "Once a week" },
          { value: "never", label: "Never", disabled: true },
        ]}
      />
    </View>
  );
}
