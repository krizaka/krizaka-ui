import { Slider } from "@krizaka/ui/native";
import * as React from "react";
import { View } from "react-native";

// One value, its label and value above the track; the value floats over the thumb while it is dragged.
export default function NativeSliderDefault() {
  const [share, setShare] = React.useState(70);
  return (
    <View style={{ width: 300 }}>
      <Slider label="Creator's share" showLabel floatingValue value={share} onValueChange={setShare} step={5} formatValue={(v) => `${v} %`} />
    </View>
  );
}
