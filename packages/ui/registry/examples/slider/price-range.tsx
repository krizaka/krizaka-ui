"use client";

import { Slider } from "@krizaka/ui/slider";
import * as React from "react";

// A price range in the brand's gradient: two floating values, the bounds written under the track.
export default function SliderPriceRange() {
  const [price, setPrice] = React.useState<[number, number]>([40, 160]);
  return (
    <div className="pt-10">
      <Slider<[number, number]>
        label="Price"
        thumbLabels={["Minimum price", "Maximum price"]}
        value={price}
        onValueChange={setPrice}
        max={250}
        step={10}
        floatingValue="always"
        marks={[
          { value: 0, label: "$0" },
          { value: 250, label: "$250+" },
        ]}
        formatValue={(v) => `$${v}`}
      />
    </div>
  );
}
