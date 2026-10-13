import { Slider } from "@krizaka/ui/native";
import { View } from "react-native";

// Vertical faders, the accent alone, steps marked.
export default function NativeSliderVertical() {
  return (
    <View style={{ flexDirection: "row", gap: 24, height: 180 }}>
      <Slider label="Voice" orientation="vertical" tone="solid" defaultValue={70} step={10} ticks />
      <Slider label="Music" orientation="vertical" tone="solid" defaultValue={40} step={10} ticks />
      <Slider label="Effects" orientation="vertical" defaultValue={55} step={10} ticks />
    </View>
  );
}
