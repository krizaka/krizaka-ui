import { TimePicker } from "@krizaka/ui/native";
import * as React from "react";

// A reminder set by the thumb: hours, minutes by 5, the period of a 12-hour locale. The value is "HH:mm".
export default function NativeDatePickerTimeWheel() {
  const [time, setTime] = React.useState<string | null>("19:30");
  return <TimePicker label="Remind me at" locale="en-US" value={time} onValueChange={setTime} />;
}
