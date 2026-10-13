import { RadioGroup } from "@krizaka/ui/native";
import { View } from "react-native";

// Tactile keys: raised on their ledge, sunk while pressed and once chosen — an impact haptic under the thumb.
export default function NativeRadioGroupButtons() {
  return (
    <View style={{ width: 340 }}>
      <RadioGroup
        label="Tip"
        variant="buttons"
        defaultValue="15"
        options={[
          { value: "10", label: "10 %", hint: "$4.20" },
          { value: "15", label: "15 %", hint: "$6.30" },
          { value: "20", label: "20 %", hint: "$8.40" },
          { value: "0", label: "None" },
        ]}
      />
    </View>
  );
}
