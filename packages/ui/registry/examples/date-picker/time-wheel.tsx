"use client";

import { TimePicker } from "@krizaka/ui/date-picker";
import * as React from "react";

// A reminder set by the thumb: hours, minutes by 5 and the period, as the locale writes them. The value is "HH:mm".
export default function DatePickerTimeWheel() {
  const [time, setTime] = React.useState<string | null>("19:30");
  return <TimePicker label="Remind me at" locale="en-US" value={time} onValueChange={setTime} minuteStep={5} />;
}
