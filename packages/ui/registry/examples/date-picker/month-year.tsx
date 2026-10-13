"use client";

import { MonthPicker } from "@krizaka/ui/date-picker";
import * as React from "react";

// A billing month: twelve months at a glance, the year above them, nothing later than this month.
export default function DatePickerMonthYear() {
  const [month, setMonth] = React.useState<string | null>("2026-09");
  return <MonthPicker variant="card" locale="en-US" value={month} onValueChange={setMonth} max="2026-10" current="2026-10" />;
}
