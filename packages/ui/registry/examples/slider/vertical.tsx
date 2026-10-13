"use client";

import { Slider } from "@krizaka/ui/slider";

// Vertical faders: a mixer's channels, the accent alone, steps marked.
export default function SliderVertical() {
  return (
    <div className="flex h-48 gap-8">
      <Slider label="Voice" orientation="vertical" tone="solid" defaultValue={70} step={10} ticks formatValue={(v) => `${v} %`} />
      <Slider label="Music" orientation="vertical" tone="solid" defaultValue={40} step={10} ticks formatValue={(v) => `${v} %`} />
      <Slider label="Effects" orientation="vertical" defaultValue={55} step={10} ticks formatValue={(v) => `${v} %`} />
    </div>
  );
}
