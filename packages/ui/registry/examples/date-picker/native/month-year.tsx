import { MonthPicker } from "@krizaka/ui/native";
import * as React from "react";

// A billing month: the twelve months of the year, nothing later than this month.
export default function NativeDatePickerMonthYear() {
  const [month, setMonth] = React.useState<string | null>("2026-09");
  return <MonthPicker locale="en-US" value={month} onValueChange={setMonth} max="2026-10" />;
}
