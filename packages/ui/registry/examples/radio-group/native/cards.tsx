import { RadioGroup } from "@krizaka/ui/native";
import { View } from "react-native";

// Whole cards: the chosen one tinted, its check lit.
export default function NativeRadioGroupCards() {
  return (
    <View style={{ width: 340 }}>
      <RadioGroup
        label="Credit pack"
        variant="cards"
        defaultValue="pro"
        options={[
          { value: "starter", label: "100 credits", description: "$4.99" },
          { value: "pro", label: "500 credits", description: "$19.99 · save 20 %" },
        ]}
      />
    </View>
  );
}
