import { RadioGroup } from "@krizaka/ui/native";
import { View } from "react-native";

// A segmented control that is a form's choice (a radio group), not a view switch.
export default function NativeRadioGroupSegmented() {
  return (
    <View style={{ width: 300 }}>
      <RadioGroup
        label="Billing"
        variant="segmented"
        defaultValue="yearly"
        options={[
          { value: "monthly", label: "Monthly" },
          { value: "yearly", label: "Yearly" },
          { value: "lifetime", label: "Lifetime" },
        ]}
      />
    </View>
  );
}
