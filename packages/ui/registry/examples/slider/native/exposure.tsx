import { Slider } from "@krizaka/ui/native";
import { useState } from "react";
import { View } from "react-native";

// Settings around zero fill from the centre; the value is said in words.
export default function NativeSliderExposure() {
  const [exposure, setExposure] = useState(0.3);
  const [volume, setVolume] = useState(70);
  return (
    <View style={{ width: 320, gap: 20 }}>
      <Slider label="Exposure" min={-2} max={2} step={0.1} value={exposure} onValueChange={setExposure} centred showValue valueText={(v) => `${v > 0 ? "+" : ""}${v.toFixed(1)} EV`} />
      <Slider label="Music volume" value={volume} onValueChange={setVolume} showValue valueText={(v) => `${v} %`} />
    </View>
  );
}
