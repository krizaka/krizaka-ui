"use client";

import { Slider } from "@krizaka/ui/slider";

// `origin={0}` on a ±range: the fill starts at the centre.
export default function SliderCentred() {
  return <Slider label="Brightness" showLabel defaultValue={-30} min={-100} max={100} origin={0} formatValue={(v) => `${v > 0 ? "+" : ""}${v} %`} />;
}
