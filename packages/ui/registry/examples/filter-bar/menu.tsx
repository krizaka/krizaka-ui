"use client";

import { FilterMenu } from "@krizaka/ui/filter-bar";
import * as React from "react";

// A filter's menu: checkboxes, and what each value would give.
export default function FilterBarMenu({ defaultOpen }: { defaultOpen?: boolean }) {
  const [formats, setFormats] = React.useState(["vertical"]);
  return (
    <FilterMenu
      label="Format"
      defaultOpen={defaultOpen}
      options={[
        { value: "vertical", label: "Vertical", count: 214 },
        { value: "landscape", label: "Landscape", count: 96 },
        { value: "square", label: "Square", count: 12 },
        { value: "audio", label: "Audio only", count: 0, disabled: true },
      ]}
      value={formats}
      onValueChange={setFormats}
    />
  );
}
