import { Slider } from "@krizaka/ui/native";
import { View } from "react-native";

// A price range in the brand's gradient: two named thumbs, their values floating.
export default function NativeSliderRange() {
  return (
    <View style={{ width: 300, paddingTop: 36 }}>
      <Slider<[number, number]> label="Price" thumbLabels={["Minimum price", "Maximum price"]} defaultValue={[40, 160]} max={250} step={10} floatingValue="always" formatValue={(v) => `$${v}`} />
    </View>
  );
}
