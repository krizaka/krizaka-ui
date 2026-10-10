"use client";

import { Slider } from "@krizaka/ui/slider";

// Two thumbs, each named by `thumbLabels`.
export default function SliderRange() {
  return (
    <Slider<[number, number]>
      label="Price"
      thumbLabels={["Minimum price", "Maximum price"]}
      showLabel
      defaultValue={[10, 60]}
      max={100}
      step={5}
      formatValue={(v) => `$${v}`}
    />
  );
}
