"use client";

import { Slider } from "@krizaka/ui/slider";

// Steps you can feel: a graduation at each one, their words under the track.
export default function SliderStepped() {
  return (
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
        { value: 1, label: "1×" },
        { value: 2, label: "2×" },
      ]}
      formatValue={(v) => `${v}×`}
    />
  );
}
