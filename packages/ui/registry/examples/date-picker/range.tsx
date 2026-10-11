"use client";

import { DateRangePicker } from "@krizaka/ui/date-picker";
import * as React from "react";

// An earnings report: presets for the usual periods, two clicks for any other.
export default function DatePickerRange({ defaultOpen }: { defaultOpen?: boolean }) {
  const [period, setPeriod] = React.useState<{ start: string; end: string } | null>({ start: "2026-10-01", end: "2026-10-11" });
  return (
    <DateRangePicker
      label="Period"
      locale="en-US"
      value={period}
      onValueChange={setPeriod}
      max="2026-10-11"
      today="2026-10-11"
      defaultOpen={defaultOpen}
      presets={[
        { label: "Last 7 days", start: "2026-10-05", end: "2026-10-11" },
        { label: "This month", start: "2026-10-01", end: "2026-10-11" },
        { label: "Last month", start: "2026-09-01", end: "2026-09-30" },
      ]}
    />
  );
}
