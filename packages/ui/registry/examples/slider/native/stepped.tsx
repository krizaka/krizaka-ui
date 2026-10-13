import { Slider } from "@krizaka/ui/native";
import { View } from "react-native";

// Steps you feel: a graduation at each one, a selection haptic as the thumb passes it, words under the track.
export default function NativeSliderStepped() {
  return (
    <View style={{ width: 300 }}>
      <Slider
        label="Playback speed"
        showLabel
        defaultValue={1}
        min={0.5}
        max={2}
        step={0.25}
        ticks
        marks={[
          { value: 0.5, label: "0.5×" },
          { value: 2, label: "2×" },
        ]}
        formatValue={(v) => `${v}×`}
      />
    </View>
  );
}
