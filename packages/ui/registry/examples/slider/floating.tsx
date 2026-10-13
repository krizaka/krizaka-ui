"use client";

import { Slider } from "@krizaka/ui/slider";

// The value floats over the thumb while it is touched (`"always"` here, to be seen at rest); a thicker track.
export default function SliderFloating() {
  return (
    <div className="pt-10">
      <Slider label="Creator's share" size="lg" defaultValue={70} step={5} floatingValue="always" formatValue={(v) => `${v} %`} />
    </div>
  );
}
