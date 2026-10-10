"use client";

import { Slider } from "@krizaka/ui/slider";

// `showLabel`: the label and the formatted value above the track.
export default function SliderWithLabel() {
  return <Slider label="Speed" showLabel defaultValue={1.5} min={0.5} max={2} step={0.25} formatValue={(v) => `${v}×`} />;
}
